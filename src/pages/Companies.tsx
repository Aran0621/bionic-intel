import { useState } from 'react'
import { Building2, ExternalLink, Globe } from 'lucide-react'
import type { Company, SiteData } from '@/lib/data'
import { scoreColor } from '@/lib/data'

function CompanyCard({ company }: { company: Company }) {
  const [showTimeline, setShowTimeline] = useState(false)
  return (
    <article className="card-glow flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] tracking-[0.18em] text-white/35">{company.nameEn}</p>
          <h3 className="mt-1 font-display text-xl font-bold text-white">{company.name}</h3>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] ${
            company.tier === '重点追踪'
              ? 'border-teal-300/30 bg-teal-300/10 text-teal-200'
              : 'border-white/15 bg-white/5 text-white/50'
          }`}
        >
          {company.tier}
        </span>
      </div>

      <p className="mt-1 text-xs text-white/40">
        {company.region} · 成立于 {company.founded} · {company.focus}
      </p>
      <p className="mt-3 text-sm leading-6 text-white/60">{company.blurb}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {company.products.map((p) => (
          <span key={p} className="rounded border border-indigo-300/20 bg-indigo-300/[0.08] px-1.5 py-0.5 text-[11px] text-indigo-200/90">
            {p}
          </span>
        ))}
      </div>

      {/* 官方渠道 */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-white/60 transition-colors hover:border-teal-300/40 hover:text-teal-200"
          >
            <Globe className="h-3 w-3" /> 官网
          </a>
        )}
        {company.channels
          .filter((ch) => ch.url !== company.website)
          .map((ch) => (
            <a
              key={ch.url}
              href={ch.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-white/60 transition-colors hover:border-teal-300/40 hover:text-teal-200"
            >
              <ExternalLink className="h-3 w-3" /> {ch.label}
            </a>
          ))}
        {!company.website && company.channels.length === 0 && (
          <span className="text-white/30">官方渠道待补充</span>
        )}
      </div>

      {/* 动态时间线 */}
      <div className="mt-4 border-t border-white/10 pt-3">
        <button
          onClick={() => setShowTimeline(!showTimeline)}
          className="text-xs font-medium text-teal-300/80 transition-colors hover:text-teal-200"
        >
          {showTimeline ? '收起动态' : `动态时间线（${company.timeline.length} 条）`}
        </button>
        {showTimeline &&
          (company.timeline.length ? (
            <ol className="relative mt-3 space-y-3 border-l border-white/15 pl-4">
              {company.timeline.map((t) => (
                <li key={t.id} className="relative">
                  <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-teal-300/70" />
                  <p className="flex items-baseline gap-2 text-[11px] text-white/35">
                    <span className="font-mono tabular-nums">{t.date}</span>
                    <span>{t.source}</span>
                    <span className={`ml-auto font-mono tabular-nums ${scoreColor(t.score)}`}>{t.score}</span>
                  </p>
                  <a
                    href={t.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-0.5 block text-[13px] leading-5 text-white/75 decoration-white/25 underline-offset-4 hover:text-teal-200 hover:underline"
                  >
                    {t.title}
                  </a>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-2 text-xs text-white/30">暂无收录动态，等待每日任务检索补充。</p>
          ))}
      </div>
    </article>
  )
}

/** 公司追踪：每家重点公司一张档案卡 + 动态时间线 */
export default function Companies({ data }: { data: SiteData }) {
  const primary = data.companies.filter((c) => c.tier === '重点追踪')
  const secondary = data.companies.filter((c) => c.tier !== '重点追踪')
  return (
    <main className="mx-auto max-w-5xl px-5 pb-20">
      <section className="mt-10">
        <div className="mb-6 flex items-baseline gap-3">
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-white">
            <Building2 className="h-5 w-5 text-teal-300" />
            公司追踪
          </h2>
          <span className="text-sm text-white/40">重点 {primary.length} 家 · 扩展关注 {secondary.length} 家</span>
          <div className="mx-2 h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {primary.map((c) => (
            <CompanyCard key={c.id} company={c} />
          ))}
        </div>

        {secondary.length > 0 && (
          <>
            <h3 className="mb-4 mt-10 font-display text-lg font-bold text-white/70">扩展关注</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {secondary.map((c) => (
                <CompanyCard key={c.id} company={c} />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  )
}
