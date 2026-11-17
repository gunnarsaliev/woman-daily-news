import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export type Breadcrumb = {
  label: string
  /** Omit for items that aren't links, such as the current page. */
  href?: string
}

export function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex min-w-0 items-center gap-1.5 text-sm text-slate-500">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1
          return (
            <li className={`flex items-center gap-1.5 ${isCurrent ? 'min-w-0' : 'shrink-0'}`} key={item.label}>
              {index > 0 && <ChevronRight aria-hidden="true" className="size-3.5 shrink-0 text-slate-300" />}
              {item.href ? (
                <Link className="inline-flex items-center gap-1.5 font-medium text-sky-700 hover:text-sky-800" href={item.href}>
                  {index === 0 && <Home aria-hidden="true" className="size-3.5" />}
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isCurrent ? 'page' : undefined} className={isCurrent ? 'truncate text-slate-400' : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
