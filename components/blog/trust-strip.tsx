import { Heart } from 'lucide-react'

export function TrustStrip({ brands }: { brands: string[] }) {
  return (
    <section aria-label="Topics we cover" className="border-y border-slate-100 bg-slate-50/70 px-5 py-6 sm:px-8 md:px-10 lg:px-12">
      <div className="flex flex-col items-center gap-5 md:flex-row md:justify-between">
        <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
          <Heart aria-hidden="true" className="size-4" />
          What we cover
        </div>
        <ul className="flex w-full flex-wrap items-center justify-center gap-x-8 gap-y-4 text-lg text-slate-300 sm:gap-x-12 md:justify-between">
          {brands.map((brand) => (
            <li className="text-xl font-semibold tracking-tight" key={brand}>{brand}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
