#!/usr/bin/env python3
"""通过 GitHub REST API 把本地 git HEAD 快照推送到远程分支。

背景：本机网络对 github.com 的 git 协议（大包 POST）不稳定，
但 api.github.com 的 REST 调用可用。本脚本用 Git Data API
（blobs/trees/commits/refs）完成与 `git push` 等价的操作。

用法：
    python scripts/push-api.py                # 推送当前 HEAD 到 main
环境变量：
    GH_TOKEN        GitHub Personal Access Token（缺省读 gh CLI 的 hosts.yml）
    GITHUB_REPO     形如 owner/repo（缺省 Aran0621/bionic-intel）
    GITHUB_BRANCH   缺省 main
    HTTPS_PROXY     缺省 http://127.0.0.1:7897（本机 Clash 代理）
"""
import base64
import os
import subprocess
import sys
import time
from pathlib import Path

import requests

REPO = os.environ.get("GITHUB_REPO", "Aran0621/bionic-intel")
BRANCH = os.environ.get("GITHUB_BRANCH", "main")
API = "https://api.github.com"
ROOT = Path(__file__).resolve().parent.parent


def get_token() -> str:
    tok = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
    if tok:
        return tok.strip()
    hosts = Path(os.environ.get("APPDATA", "")) / "GitHub CLI" / "hosts.yml"
    if hosts.exists():
        for line in hosts.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line.startswith("oauth_token:"):
                return line.split(":", 1)[1].strip()
    sys.exit("错误：未找到 GH_TOKEN，也未找到 gh CLI 登录配置")


def make_session() -> requests.Session:
    s = requests.Session()
    s.headers.update({
        "Authorization": f"Bearer {get_token()}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    })
    proxy = (os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
             or "http://127.0.0.1:7897")
    s.proxies = {"http": proxy, "https": proxy}
    return s


def call(s: requests.Session, method: str, path: str, payload=None,
         ok=(200, 201), allow_404=False):
    """带重试的 API 调用；失败重试 4 次后退出。"""
    for attempt in range(4):
        try:
            r = s.request(method, API + path, json=payload, timeout=45)
            if r.status_code in ok:
                return r.json() if r.content else {}
            if r.status_code in (404, 409) and allow_404:
                # 404=引用不存在；409=空仓库（Git Repository is empty）
                return None
            print(f"  [{attempt+1}/4] {method} {path} -> {r.status_code}: {r.text[:300]}")
        except Exception as e:  # noqa: BLE001
            print(f"  [{attempt+1}/4] {method} {path} 异常: {e}")
        time.sleep(3 * (attempt + 1))
    sys.exit(f"失败：{method} {path} 重试 4 次仍不成功")


def git(*args: str) -> str:
    return subprocess.check_output(
        ["git", *args], cwd=ROOT, text=True,
        encoding="utf-8", errors="replace").strip()


def main() -> None:
    s = make_session()

    # 1. 收集工作区 git 跟踪文件
    paths = git("ls-files").splitlines()
    modes = {}
    for line in git("ls-files", "-s").splitlines():
        meta, p = line.split("\t", 1)
        modes[p] = meta.split()[0]
    print(f"待推送文件: {len(paths)} 个")

    # 2. 构造 tree（文本内联 content；二进制走 base64 blob）
    tree = []
    for i, rel in enumerate(paths, 1):
        raw = (ROOT / rel).read_bytes()
        entry = {"path": rel, "mode": modes.get(rel, "100644"), "type": "blob"}
        try:
            entry["content"] = raw.decode("utf-8")
        except UnicodeDecodeError:
            blob = call(s, "POST", f"/repos/{REPO}/git/blobs",
                        {"content": base64.b64encode(raw).decode(),
                         "encoding": "base64"})
            entry["sha"] = blob["sha"]
        tree.append(entry)
        if i % 20 == 0:
            print(f"  已处理 {i}/{len(paths)}")

    # 3. 查询远程当前引用；空仓库先用 Contents API 初始化首个提交
    ref = call(s, "GET", f"/repos/{REPO}/git/ref/heads/{BRANCH}", allow_404=True)
    if ref is None:
        print("远程为空仓库，先初始化首个提交…")
        call(s, "PUT", f"/repos/{REPO}/contents/README.md",
             {"message": "init",
              "content": base64.b64encode(
                  f"# {REPO.split('/')[-1]}\n".encode()).decode(),
              "branch": BRANCH})
        ref = call(s, "GET", f"/repos/{REPO}/git/ref/heads/{BRANCH}")
    parent_sha = ref["object"]["sha"]

    # 4. 创建 tree
    t = call(s, "POST", f"/repos/{REPO}/git/trees", {"tree": tree})
    tree_sha = t["sha"]
    print(f"tree 已创建: {tree_sha[:12]}")

    # 5. 与远程比较，无变化则跳过
    if parent_sha:
        parent = call(s, "GET", f"/repos/{REPO}/git/commits/{parent_sha}")
        if parent["tree"]["sha"] == tree_sha:
            print("远程内容已是最新，无需推送。")
            return

    # 6. 创建 commit 并移动引用
    msg = git("log", "-1", "--pretty=%B") or "update"
    commit = call(s, "POST", f"/repos/{REPO}/git/commits",
                  {"message": msg, "tree": tree_sha,
                   "parents": [parent_sha] if parent_sha else []})
    csha = commit["sha"]
    print(f"commit 已创建: {csha[:12]} ({msg.splitlines()[0][:50]})")

    if parent_sha:
        call(s, "PATCH", f"/repos/{REPO}/git/refs/heads/{BRANCH}",
             {"sha": csha, "force": False}, ok=(200,))
    else:
        call(s, "POST", f"/repos/{REPO}/git/refs",
             {"ref": f"refs/heads/{BRANCH}", "sha": csha})
    print(f"推送完成: https://github.com/{REPO}/tree/{BRANCH} -> {csha[:12]}")


if __name__ == "__main__":
    main()
