import Link from 'next/link'
import { ArrowUpRight, Newspaper } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/60 px-5 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 md:px-12">
      <Link aria-label="Woman Daily News home" className="inline-flex items-center gap-2 font-semibold text-slate-800" href="/#top">
        <span className="inline-flex size-8 items-center justify-center rounded-xl bg-sky-600 text-white"><Newspaper aria-hidden="true" className="size-4" /></span>
        Woman Daily News
      </Link>
      <p>Everyday stories for women, on health, life and style.</p>
      <Link className="inline-flex items-center gap-1.5 font-medium text-sky-700 hover:text-sky-800" href="/#latest-stories-heading">
        Read the latest stories <ArrowUpRight aria-hidden="true" className="size-4" />
      </Link>
    </footer>
  )
}
