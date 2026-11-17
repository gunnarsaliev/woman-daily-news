'use client'

import { useState } from 'react'
import { Check, Link2 } from 'lucide-react'

const NETWORKS = [
  { label: 'X', shareUrl: (url: string, title: string) => `https://twitter.com/intent/tweet?url=${url}&text=${title}` },
  { label: 'Facebook', shareUrl: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${url}` },
  { label: 'LinkedIn', shareUrl: (url: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${url}` },
  { label: 'WhatsApp', shareUrl: (url: string, title: string) => `https://wa.me/?text=${title}%20${url}` },
]

const buttonClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700'

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  // The page URL is read on click, so the article stays statically rendered.
  function share(shareUrl: (url: string, title: string) => string) {
    const url = encodeURIComponent(window.location.href.split('#')[0])
    window.open(shareUrl(url, encodeURIComponent(title)), '_blank', 'noopener,noreferrer')
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href.split('#')[0])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access can be denied; the address bar still has the link.
    }
  }

  return (
    <section aria-labelledby="share-heading">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400" id="share-heading">
        Share this story
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {NETWORKS.map((network) => (
          <button
            aria-label={`Share on ${network.label}`}
            className={buttonClass}
            key={network.label}
            onClick={() => share(network.shareUrl)}
            type="button"
          >
            {network.label}
          </button>
        ))}
        <button className={buttonClass} onClick={copyLink} type="button">
          {copied ? <Check aria-hidden="true" className="size-3.5" /> : <Link2 aria-hidden="true" className="size-3.5" />}
          <span aria-live="polite">{copied ? 'Link copied' : 'Copy link'}</span>
        </button>
      </div>
    </section>
  )
}
