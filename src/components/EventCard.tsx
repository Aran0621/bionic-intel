import { useState } from 'react'
import { ChevronDown, Flame } from 'lucide-react'
import type { EventCluster, Company } from '@/lib/data'
import { heatColor } from '@/lib/data'
import NewsCard from './NewsCard'

/** 事件聚簇卡：同一事件多家报道合并，标注「N 家报道」，按热度排序 */
export default function EventCard({
  event,
  companies,
  defaultOpen,
}: {
  event: EventCluster
  companies: Company[]
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen ?? false)
  const lead = event.items[0]
  const companyNames = event.companies
    .map((id) => companies.find((c) => c.id === id)?.name)
    .filter(Boolean) as string[]

  return (
    <article className="card-glow rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md">
      <button onClick={() => setOpen(!open)} className="block w-full p-5 text-left">
        {/* 元信息行 */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
          <span className={`flex items-center gap-1 font-mono font-semibold tabular-nums ${heatColor(event.heat)}`}>
            <Flame className="h-3.5 w-3.5" />
            热度 {event.heat}
          </span>
          {event.reportCount > 1 ? (
            <span className="rounded-full border border-rose-300/30 bg-rose-300/10 px-2 py-0.5 font-medium text-rose-200">
              {event.reportCount} 家报道
            </span>
          ) : (
            <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-white/45">独家</span>
          )}
          {companyNames.map((n) => (
            <span key={n} className="rounded border border-indigo-300/25 bg-indigo-300/10 px-1.5 py-0.5 text-indigo-200">
              {n}
            </span>
          ))}
          <span className="ml-auto font-mono tabular-nums text-white/35">{event.date}</span>
        </div>

        <h3 className="mt-2.5 font-display text-lg font-bold leading-snug text-white">
          {event.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/55">{lead.summary}</p>

        <div className="mt-3 flex items-center justify-between text-xs text-white/40">
          <span>
            {event.sources.join(' · ')}
          </span>
          <span className="flex items-center gap-1 text-teal-300/80">
            {open ? '收起' : '展开详情'}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
          </span>
        </div>
      </button>

      {open && (
        <div className="space-y-3 border-t border-white/10 p-4">
          {event.items.map((item) => (
            <NewsCard key={item.id} item={item} dense />
          ))}
        </div>
      )}
    </article>
  )
}
