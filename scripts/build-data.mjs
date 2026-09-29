#!/usr/bin/env node
/**
 * 仿生机器人情报站 · 数据管线
 * 输入:  data/seed-items.json  (人工/Agent 策展的原始条目，链接必须来自真实检索)
 *        data/companies.json   (追踪公司档案)
 * 输出:  public/data/{items,events,digests,companies,meta}.json
 *        data/last-run.json    (供补跑保险任务检查当天是否成功运行)
 *
 * 机制:
 *  1. 校验 + 按 id 去重
 *  2. 滚动保留最近 300 条 (按 date 降序, 同日期按 score 降序)
 *  3. 事件聚簇: 相同 eventId 合并, 标注 "N 家报道", 热度 = 最高分 + 7*(信源数-1), 封顶 99
 *  4. 每日日报: 按日期分组, 每天取评分最高的最多 6 条作为精选
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const MAX_ITEMS = 300
const DIGEST_PICKS = 6

const rawItems = JSON.parse(readFileSync(join(root, 'data/seed-items.json'), 'utf8'))
const companies = JSON.parse(readFileSync(join(root, 'data/companies.json'), 'utf8'))

// ---------- 1. 校验 + 去重 ----------
const REQUIRED = ['id', 'date', 'source', 'sourceUrl', 'score', 'title', 'summary', 'reason', 'eventId']
const seen = new Set()
const items = []
const errors = []
for (const it of rawItems) {
  const missing = REQUIRED.filter((k) => it[k] === undefined || it[k] === null || it[k] === '')
  if (missing.length) { errors.push(`${it.id ?? '(无id)'} 缺字段: ${missing.join(',')}`); continue }
  if (!/^https?:\/\//.test(it.sourceUrl)) { errors.push(`${it.id} sourceUrl 非法`); continue }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(it.date)) { errors.push(`${it.id} date 格式非法`); continue }
  if (seen.has(it.id)) continue
  seen.add(it.id)
  items.push({ ...it, companies: it.companies ?? [], score: Math.round(it.score) })
}
if (errors.length) {
  console.error('数据校验失败:\n' + errors.join('\n'))
  process.exit(1)
}

// ---------- 2. 滚动 300 条 ----------
items.sort((a, b) => b.date.localeCompare(a.date) || b.score - a.score)
const kept = items.slice(0, MAX_ITEMS)

// ---------- 3. 事件聚簇 ----------
const eventMap = new Map()
for (const it of kept) {
  const ev = eventMap.get(it.eventId) ?? { id: it.eventId, items: [] }
  ev.items.push(it)
  eventMap.set(it.eventId, ev)
}
const events = [...eventMap.values()].map((ev) => {
  ev.items.sort((a, b) => b.score - a.score)
  const sources = [...new Set(ev.items.map((i) => i.source))]
  const heat = Math.min(99, ev.items[0].score + 7 * (sources.length - 1))
  return {
    id: ev.id,
    title: ev.items[0].title,
    date: ev.items.map((i) => i.date).sort().at(-1),
    heat,
    reportCount: sources.length,
    sources,
    companies: [...new Set(ev.items.flatMap((i) => i.companies))],
    items: ev.items,
  }
})
events.sort((a, b) => b.heat - a.heat || b.date.localeCompare(a.date))

// ---------- 4. 每日日报 ----------
const byDate = new Map()
for (const it of kept) {
  const list = byDate.get(it.date) ?? []
  list.push(it)
  byDate.set(it.date, list)
}
const digests = [...byDate.entries()]
  .sort((a, b) => b[0].localeCompare(a[0]))
  .map(([date, list]) => {
    const picks = [...list].sort((a, b) => b.score - a.score).slice(0, DIGEST_PICKS)
    const eventIds = new Set(picks.map((p) => p.eventId))
    return {
      date,
      headline: picks[0]?.title ?? '',
      picks,
      eventCount: eventIds.size,
      itemCount: list.length,
    }
  })

// ---------- 5. 公司时间线 ----------
const companyOut = companies.map((c) => ({
  ...c,
  timeline: kept
    .filter((i) => i.companies.includes(c.id))
    .map((i) => ({ id: i.id, date: i.date, title: i.title, source: i.source, sourceUrl: i.sourceUrl, score: i.score, eventId: i.eventId })),
}))

// ---------- 写文件 ----------
const outDir = join(root, 'public/data')
mkdirSync(outDir, { recursive: true })
const write = (name, obj) => writeFileSync(join(outDir, name), JSON.stringify(obj, null, 2))
write('items.json', kept)
write('events.json', events)
write('digests.json', digests)
write('companies.json', companyOut)
write('meta.json', {
  generatedAt: new Date().toISOString(),
  itemCount: kept.length,
  eventCount: events.length,
  digestCount: digests.length,
  companyCount: companies.length,
  maxItems: MAX_ITEMS,
})

writeFileSync(
  join(root, 'data/last-run.json'),
  JSON.stringify(
    { date: new Date().toISOString(), status: 'success', itemCount: kept.length, eventCount: events.length },
    null,
    2,
  ),
)
console.log(`✓ items=${kept.length} events=${events.length} digests=${digests.length} companies=${companies.length}`)
