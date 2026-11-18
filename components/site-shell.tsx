import { SiteFooter } from '@/components/blog/site-footer'

/** The light-blue page background and rounded white card that every page sits in, with the footer. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f0f6ff] px-3 py-4 sm:px-6 sm:py-8 lg:px-8" id="top">
      <div className="mx-auto max-w-[1440px] overflow-clip rounded-[28px] border border-white/80 bg-white shadow-[0_24px_80px_-48px_rgba(38,94,162,0.35)]">
        {children}
        <SiteFooter />
      </div>
    </main>
  )
}
