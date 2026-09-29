import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Newspaper, Search } from 'lucide-react'
import type { SiteData } from '@/lib/data'
import { formatDate } from '@/lib/data'
import EventCard from '@/components/EventCard'
import NewsCard from '@/components/NewsCard'

export default function Home({ data }: { data: SiteData }) {
  const [query, setQuery] = useState('')
  const today = data.digests[0]

  const events = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return data.events
    return data.events.filter((ev) =>
      [ev.title, ...ev.sources, ...ev.items.flatMap((i) => [i.title, i.summary, i.reason, i.source])]
        .join('\n')
        .toLowerCase()
        .includes(q),
    )
  }, [data.events, query])

  return (
    <main className="mx-auto max-w-5xl px-5 pb-20">
      {/* ── 当日日报 ── */}
      {today && (
        <section className="mt-10">
          <div className="mb-4 flex items-baseline gap-3">
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-white">
              <Newspaper className="h-5 w-5 text-teal-300" />
              当日日报 · {formatDate(today.date).main}
            </h2>
            <span className="text-sm text-white/40">{formatDate(today.date).weekday}</span>
            <div className="mx-2 h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
            <Link to="/archive" className="text-xs text-teal-300/80 transition-colors hover:text-teal-200">
              历史存档 →
            </Link>
          </div>

          <div className="rounded-2xl border border-teal-300/20 bg-gradient-to-br from-teal-300/[0.07] to-transparent p-5 backdrop-blur-md">
            <p className="text-xs tracking-[0.2em] text-teal-300/70">TODAY'S BRIEFING · 精选 {today.picks.length} 条 / 收录 {today.itemCount} 条 / {today.eventCount} 个事件</p>
            <p className="mt-2 font-display text-xl font-bold leading-snug text-white">{today.headline}</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {today.picks.map((item) => (
                <NewsCard key={item.id} item={item} dense />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 热点事件流 ── */}
      <section className="mt-12">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h2 className="font-display text-2xl font-bold text-white">热点事件流</h2>
          <span className="text-xs text-white/40">同一事件多家报道自动合并 · 按热度排序</span>
          <div className="ml-auto flex w-full items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md transition-colors focus-within:border-teal-300/40 sm:w-72">
            <Search className="h-4 w-4 text-white/30" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索事件、公司或信源…"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
            />
            {query && (
              <button onClick={() => setQuery('')} className="shrink-0 text-xs text-white/40 hover:text-white/80">
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {events.map((ev, i) => (
            <EventCard key={ev.id} event={ev} companies={data.companies} defaultOpen={i === 0 && !query} />
          ))}
        </div>
        {events.length === 0 && (
          <p className="mt-16 text-center text-sm text-white/35">没有找到匹配「{query.trim()}」的事件，换个关键词试试。</p>
        )}
      </section>
    </main>
  )
}
