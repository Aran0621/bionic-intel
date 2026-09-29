export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/30">
      <div className="mx-auto max-w-5xl px-5 py-8 text-xs leading-6 text-white/40">
        <p className="font-semibold text-white/70">关于本站</p>
        <p>
          仿生机器人情报站是一个单赛道策展式情报站：只收录带硅胶皮肤 / 仿真头部 / 高表情交互的仿生机器人动态，
          明确不收录铁壳工业机器人新闻。条目链接官方渠道（官网、官方博客、官方 X 帖、GitHub）优先，
          官方没有对应页面时才采用媒体报道；摘要与推荐理由为编辑整理，原文观点归原信源所有。
        </p>
        <p className="mt-2">
          机制参考开源项目 AIHOT（事件聚簇 / 每日日报 / 精选摘要+推荐理由）· 每日北京时间 12:00 后自动检索更新，
          数据滚动保留最近 300 条。
        </p>
      </div>
    </footer>
  )
}
