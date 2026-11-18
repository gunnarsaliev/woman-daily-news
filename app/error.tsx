'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { SiteShell } from '@/components/site-shell'

/** Shown when a page fails to render, e.g. while the CMS is unreachable. */
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    // The digest matches the full error in the server logs without exposing its details to the reader.
    console.error(error)
  }, [error])

  const digest = error instanceof Error && 'digest' in error ? String(error.digest) : undefined

  return (
    <SiteShell>
      <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <h1 className="text-4xl font-semibold tracking-[-0.035em] text-slate-900 md:text-5xl">Something went wrong</h1>
        <p className="mt-4 text-lg text-slate-500">This page couldn&apos;t be loaded right now. Please try again in a moment.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            className="inline-flex h-10 items-center rounded-md bg-sky-600 px-5 text-sm font-medium text-white hover:bg-sky-700"
            onClick={() => retry()}
            type="button"
          >
            Try again
          </button>
          <Link
            className="inline-flex h-10 items-center rounded-md border border-slate-200 px-5 text-sm font-medium text-slate-900 hover:bg-slate-50"
            href="/"
          >
            Go to the home page
          </Link>
        </div>
        {digest && <p className="mt-6 text-xs text-slate-400">Error reference: {digest}</p>}
      </section>
    </SiteShell>
  )
}
