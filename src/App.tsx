import { Routes, Route } from 'react-router-dom'
import { useSiteData } from '@/lib/data'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import Home from '@/pages/Home'
import Archive from '@/pages/Archive'
import Companies from '@/pages/Companies'

export default function App() {
  const { data, error } = useSiteData()

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b14] text-sm text-rose-300">
        数据加载失败：{error}
      </div>
    )
  }
  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b14]">
        <p className="flex items-center gap-2 text-sm text-white/50">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-teal-300" />
          情报加载中…
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070b14]">
      <SiteHeader meta={data.meta} />
      <Routes>
        <Route path="/" element={<Home data={data} />} />
        <Route path="/archive" element={<Archive data={data} />} />
        <Route path="/companies" element={<Companies data={data} />} />
        <Route path="*" element={<Home data={data} />} />
      </Routes>
      <SiteFooter />
    </div>
  )
}
