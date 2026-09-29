import { useState } from 'react'
import { CalendarDays, ChevronDown } from 'lucide-react'
import type { SiteData } from '@/lib/data'
import { formatDate } from '@/lib/data'
import NewsCard from '@/components/NewsCard'

/** 日报存档：每天一期精选简报，可翻历史 */
export default function Archive({ data }: { data: SiteData }) {
  const [openDate, setOpenDate] = useState<string | null>(data.digests[0]?.date ?? null)

  return (
    <main className="mx-auto max-w-5xl px-5 pb-20">
      <section className="mt-10">
        <div className="mb-6 flex items-baseline gap-3">
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-white">
            <CalendarDays className="h-5 w-5 text-teal-300" />
            日报存档
          </h2>
          <span className="text-sm text-white/40">共 {data.digests.length} 期 · 每天一期精选简报</span>
          <div className="mx-2 h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
        </div>

        <div className="space-y-3">
          {data.digests.map((d, idx) => {
            const open = openDate === d.date
            const { main, weekday, full } = formatDate(d.date)
            return (
              <article
                key={d.date}
                className="card-glow overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md"
              >
                <button
                  onClick={() => setOpenDate(open ? null : d.date)}
                  className="flex w-full items-center gap-4 p-4 text-left"
                >
                  <div className="w-16 shrink-0 text-center">
                    <p className="font-display text-lg font-bold leading-tight text-white">{main}</p>
                    <p className="text-[11px] text-white/40">{weekday}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white/85">
                      {idx === 0 && <span className="mr-2 rounded bg-teal-300/15 px-1.5 py-0.5 text-[11px] text-teal-200">最新一期</span>}
                      {d.headline}
                    </p>
                    <p className="mt-1 text-xs text-white/40">
                      {full} · 精选 {d.picks.length} 条 · 收录 {d.itemCount} 条 · {d.eventCount} 个事件
                    </p>
                  </div>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && (
                  <div className="grid gap-4 border-t border-white/10 p-4 md:grid-cols-2">
                    {d.picks.map((item) => (
                      <NewsCard key={item.id} item={item} dense />
                    ))}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
