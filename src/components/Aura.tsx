/** 报头呼吸漂浮光晕：青 / 紫 / 玫三团柔焦渐变 */
export default function Aura() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="aura-float-a absolute -top-48 left-[-12%] h-[580px] w-[580px] rounded-full bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.28),transparent_65%)] blur-3xl" />
      <div className="aura-float-b absolute -top-32 right-[-10%] h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle_at_center,rgba(129,140,248,0.24),transparent_65%)] blur-3xl" />
      <div className="aura-float-c absolute left-[32%] top-20 h-[440px] w-[440px] rounded-full bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.16),transparent_65%)] blur-3xl" />
      {/* 四角准星线 */}
      <span className="absolute left-6 top-6 h-4 w-px bg-white/20" />
      <span className="absolute left-6 top-6 h-px w-4 bg-white/20" />
      <span className="absolute right-6 top-6 h-4 w-px bg-white/20" />
      <span className="absolute right-6 top-6 h-px w-4 bg-white/20" />
    </div>
  )
}
