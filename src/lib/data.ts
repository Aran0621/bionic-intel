import { useEffect, useState } from 'react'

export interface NewsItem {
  id: string
  date: string
  source: string
  sourceUrl: string
  score: number
  eventId: string
  companies: string[]
  title: string
  summary: string
  reason: string
}

export interface EventCluster {
  id: string
  title: string
  date: string
  heat: number
  reportCount: number
  sources: string[]
  companies: string[]
  items: NewsItem[]
}

export interface Digest {
  date: string
  headline: string
  picks: NewsItem[]
  eventCount: number
  itemCount: number
}

export interface Company {
  id: string
  name: string
  nameEn: string
  region: string
  founded: string
  tier: string
  focus: string
  products: string[]
  website: string | null
  channels: { label: string; url: string }[]
  keywords: string[]
  blurb: string
  timeline: { id: string; date: string; title: string; source: string; sourceUrl: string; score: number; eventId: string }[]
}

export interface Meta {
  generatedAt: string
  itemCount: number
  eventCount: number
  digestCount: number
  companyCount: number
  maxItems: number
}

const BASE = import.meta.env.BASE_URL

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}data/${path}`)
  if (!res.ok) throw new Error(`加载 ${path} 失败: ${res.status}`)
  return res.json() as Promise<T>
}

export interface SiteData {
  items: NewsItem[]
  events: EventCluster[]
  digests: Digest[]
  companies: Company[]
  meta: Meta
}

export function useSiteData() {
  const [data, setData] = useState<SiteData | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    Promise.all([
      get<NewsItem[]>('items.json'),
      get<EventCluster[]>('events.json'),
      get<Digest[]>('digests.json'),
      get<Company[]>('companies.json'),
      get<Meta>('meta.json'),
    ])
      .then(([items, events, digests, companies, meta]) =>
        setData({ items, events, digests, companies, meta }),
      )
      .catch((e) => setError(String(e)))
  }, [])
  return { data, error }
}

export const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return {
    main: `${d.getMonth() + 1}月${d.getDate()}日`,
    weekday: WEEKDAYS[d.getDay()],
    full: `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`,
  }
}

export function heatColor(heat: number) {
  if (heat >= 90) return 'text-rose-300'
  if (heat >= 80) return 'text-amber-300'
  return 'text-slate-400'
}

export function scoreColor(score: number) {
  if (score >= 85) return 'text-emerald-300'
  if (score >= 75) return 'text-amber-300'
  return 'text-slate-400'
}
