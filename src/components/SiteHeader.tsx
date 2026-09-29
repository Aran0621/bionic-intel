import { NavLink, Link } from 'react-router-dom'
import Aura from './Aura'
import type { Meta } from '@/lib/data'

const NAV = [
  { to: '/', label: '情报流', end: true },
  { to: '/archive', label: '日报存档' },
  { to: '/companies', label: '公司追踪' },
]

export default function SiteHeader({ meta }: { meta?: Meta }) {
  return (
    <header className="relative border-b border-white/10">
      <Aura />
      {/* 顶部细条 */}
      <div className="relative border-b border-white/5 bg-black/30">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-2 text-[11px] tracking-[0.22em] text-white/40">
          <span className="uppercase">Bionic Robotics Intelligence · 硅胶皮肤 × 仿真头部 × 高表情交互</span>
          <span className="hidden sm:inline">每日 12:00（北京时间）自动更新</span>
        </div>
      </div>

      <div className="relative mx-auto max-w-5xl px-5 pb-8 pt-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-3 flex items-center gap-2 text-[11px] font-medium tracking-[0.32em] text-teal-300/70">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-teal-300" />
              SYNTHETIC SKIN · EXPRESSIVE FACE · DAILY BRIEFING
            </p>
            <Link to="/">
              <h1 className="font-display text-4xl font-black leading-none tracking-tight text-white sm:text-5xl">
                仿生机器人情报站
              </h1>
            </Link>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/50">
              只追踪一个赛道：带<span className="font-semibold text-teal-300">硅胶皮肤</span>、
              <span className="font-semibold text-indigo-300">仿真头部</span>与
              <span className="font-semibold text-rose-300">高表情交互</span>的仿生机器人。
              同一事件多家报道自动聚簇，官方渠道优先，铁壳工业机器人新闻一概不收。
            </p>
          </div>
          {meta && (
            <div className="shrink-0 text-right text-xs leading-6 text-white/40">
              <p>收录 <span className="font-semibold text-white/85">{meta.itemCount}</span> 条 · 聚簇 <span className="font-semibold text-white/85">{meta.eventCount}</span> 事件</p>
              <p>追踪公司 <span className="font-semibold text-white/85">{meta.companyCount}</span> 家 · 日报 <span className="font-semibold text-white/85">{meta.digestCount}</span> 期</p>
              <p>更新至 {new Date(meta.generatedAt).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</p>
            </div>
          )}
        </div>

        {/* 导航胶囊 */}
        <nav className="mt-8 flex flex-wrap gap-2">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `rounded-full border px-4 py-1.5 text-sm font-medium backdrop-blur-md transition-all ${
                  isActive
                    ? 'border-teal-300/60 bg-teal-300/15 text-teal-200 shadow-lg shadow-teal-500/10'
                    : 'border-white/10 bg-white/5 text-white/55 hover:border-white/25 hover:text-white/85'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
