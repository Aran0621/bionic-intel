import { ExternalLink } from 'lucide-react'
import type { NewsItem } from '@/lib/data'
import { scoreColor } from '@/lib/data'

/** 单条情报卡：标题链接 + 摘要 + 推荐理由 */
export default function NewsCard({ item, dense }: { item: NewsItem; dense?: boolean }) {
  return (
    <article className={`card-glow rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md ${dense ? 'p-4' : 'p-5'}`}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
        <span className="font-mono tabular-nums text-white/35">{item.date}</span>
        <span className="rounded border border-teal-300/25 bg-teal-300/10 px-1.5 py-0.5 font-medium text-teal-200">
          {item.source}
        </span>
        <span className={`ml-auto font-mono font-semibold tabular-nums ${scoreColor(item.score)}`}>
          {item.score}/100
        </span>
      </div>

      <a
        href={item.sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-2.5 block font-display text-[17px] font-bold leading-snug text-white decoration-white/30 underline-offset-4 hover:text-teal-200 hover:underline"
      >
        {item.title}
        <ExternalLink className="mb-0.5 ml-1.5 inline h-3.5 w-3.5 text-white/30" />
      </a>

      <p className="mt-2 text-sm leading-6 text-white/60">{item.summary}</p>

      <div className="mt-3 rounded-lg border-l-2 border-teal-300/70 bg-teal-300/[0.06] px-3 py-2">
        <p className="text-[13px] leading-6 text-white/65">
          <span className="mr-1.5 font-semibold text-teal-200">推荐理由</span>
          {item.reason}
        </p>
      </div>
    </article>
  )
}
