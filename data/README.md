# 数据策展手册（每日任务必读）

本站只追踪一个赛道：**带硅胶皮肤 / 仿真头部 / 高表情交互的仿生机器人**。
明确**不收录**铁壳工业机器人、纯仓储/工厂人形机器人新闻（优必选 Walker 工业线这类内容不收，但其仿生线「优世界 U1」要收）。

## 铁律

1. **链接必须真实**：`sourceUrl` 只能来自本次检索工具（WebSearch / FetchURL）实际返回的 URL，严禁凭记忆编造或拼接 URL。
2. **官方渠道优先**：公司官网、官方博客、官方 X 帖、官方新闻稿（Business Wire / PR Newswire 公司通稿）、GitHub 优先；官方没有对应页面时才用媒体报道。
3. **不收广告软文与伪原创聚合站**（如内容农场）。权威媒体、行业媒体、官方账号优先。
4. 同一事件多家报道 = 同一个 `eventId`，不要拆成多个事件。
5. **新鲜度优先**：每日收录以**最近 48 小时内**的赛道动态为主（检索时用 after 参数或结果日期过滤）。若当天确实没有新动态，可补录此前未收录的**重大历史事件**（融资、旗舰发布、官方里程碑），但每天补录不超过 3 条，且必须在 `summary` 开头标注「历史补录：」。宁可某天零新增，也不要用旧闻充数。

## 每日工作流

1. 用下面「检索 query 清单」中的 **至少 10 个 query** 调用 WebSearch（可按当天热点自行增补）。中英文混用。
2. 从结果中筛选符合赛道定义的新条目。与 `data/seed-items.json` 已有条目比对，**已收录的 URL 不要重复收录**（同一事件有新的报道方时，作为新条目加入同一 `eventId` 聚簇）。
3. 每条写入字段：
   - `id`：`日期-主题短横线`（全小写英文，唯一）
   - `date`：`YYYY-MM-DD`（报道/发布日期，不是检索日期）
   - `source`：信源名（官方渠道标注「官方」）
   - `sourceUrl`：检索结果里的真实链接
   - `score`：60-95 整数。官方一手 +5，独家深度 +5，多家报道的热点取高分
   - `eventId`：事件聚簇标识（全小写英文短横线，同事件同标识）
   - `companies`：命中的公司 id 数组（见 `data/companies.json` 的 `id` 字段；没命中就给 `[]`）
   - `title`：中文标题，说清楚「谁 + 做了什么 + 关键数字」
   - `summary`：3-5 句中文摘要，保留关键参数与数字
   - `reason`：一句推荐理由（为什么值得读）
4. 把新条目**追加**到 `data/seed-items.json`（保持 JSON 合法）。
5. 若发现追踪公司有新官方渠道（官网改版、新官方 X / YouTube / 公众号），更新 `data/companies.json` 的 `channels`。
6. 运行数据管线与构建验证（在项目 `app/` 目录下）：
   ```bash
   export PATH="$HOME/bin:/c/Users/Administrator/AppData/Local/Programs/kimi-desktop/resources/resources/runtime:$PATH"
   cd "C:/Users/Administrator/Documents/kimi/tasks/2026-09-29/16-19-32-5bd3bb15/app"
   npm run build
   ```
   `npm run build` 会先跑 `scripts/build-data.mjs`（校验、去重、聚簇、日报、滚动 300 条），再做 TS + Vite 构建。**构建必须成功才算完成**；失败必须修复后重跑。
7. 构建成功后写 git 提交并发布：
   ```bash
   git add -A && git commit -m "data: YYYY-MM-DD daily update"
   python scripts/push-api.py
   ```
   **注意：不要用 `git push`**——本机网络对 git 协议不稳定，必须用 `scripts/push-api.py`（走 GitHub REST API，自带重试；令牌从 gh CLI 配置读取，代理缺省 127.0.0.1:7897）。推送成功后 GitHub Actions 会自动构建并发布到 https://aran0621.github.io/bionic-intel/ ，全程约 1-2 分钟。若推送因网络失败，记录后正常结束即可，次日任务会携带累积变更重试。
8. 若是补跑任务，无论成败都要把当天日期追加写入 `data/backfill-log.json`（JSON 数组，元素为 `YYYY-MM-DD`，没有就新建），防止一天内反复补跑。

## 检索 query 清单（每日至少选 10 个）

1. `首形科技 AheadForm 仿生机器人 最新`
2. `优必选 优世界 U1 仿生 交付 OR 订单`
3. `松延动力 小诺 OR 小月 OR Hobbs 仿生`
4. `数字华夏 夏澜 仿生机器人`
5. `卓益得 DroidUp Moya 仿生机器人`
6. `Robonova Eva.i 伴侣机器人`
7. `金三玩美 WMdoll MetaBox AI 娃娃`
8. `Hanson Robotics Sophia news`
9. `Realbotix Aria OR Melody news`
10. `Engineered Arts Ameca news`
11. `Clone Robotics Protoclone`
12. `仿生机器人 硅胶皮肤 表情 融资`
13. `仿生机器人 表情交互 新品 发布`
14. `WRC OR WAIC OR AGIC 仿生机器人 展会`
15. `bionic humanoid robot silicone skin face expression`
16. `无论科技 Anywit 表情头`（扩展关注公司，可轮换其他新玩家）

## 信源白名单（优先）

- 公司官网 / 官方博客 / 官方 X / 官方 YouTube / 官方新闻稿
- 微信公众号文章（机器人前瞻 robot_pro、机器人大讲堂 leaderobot）
- 36氪、雷峰网、量子位、智东西、钛媒体、虎嗅、IT之家
- IT桔子 / 天眼查 / 证券之星（融资动态）
- 新华网、财新、证券时报（权威背书）
- 展会官网（WRC / WAIC / AGIC）
