import type { ArticleHeading } from '@/components/blog/rich-text'

export function TableOfContents({ headings }: { headings: ArticleHeading[] }) {
  if (headings.length === 0) return null

  return (
    <nav aria-labelledby="table-of-contents-heading">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400" id="table-of-contents-heading">
        In this article
      </h2>
      <ol className="mt-3 flex flex-col gap-2.5 border-l border-slate-100 text-sm">
        {headings.map((heading) => (
          <li className={heading.level === 3 ? 'pl-7' : 'pl-4'} key={heading.id}>
            <a className="leading-snug text-slate-600 hover:text-sky-700" href={`#${heading.id}`}>
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
