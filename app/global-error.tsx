'use client'

import { useEffect } from 'react'
import { SITE_NAME } from '@/lib/site'

/**
 * Last-resort page when the root layout itself fails. It replaces the whole document, and global CSS isn't
 * loaded here, so it uses inline styles.
 */
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#0f172a',
          background: '#ffffff',
        }}
      >
        <main style={{ maxWidth: 480, padding: 24, textAlign: 'center' }}>
          <p style={{ margin: 0, fontWeight: 600 }}>{SITE_NAME}</p>
          <h1 style={{ fontSize: 32, margin: '16px 0 8px' }}>Something went wrong</h1>
          <p style={{ margin: 0, color: '#64748b' }}>The site couldn&apos;t be loaded right now. Please try again in a moment.</p>
          <button
            onClick={() => retry()}
            style={{
              marginTop: 24,
              padding: '10px 20px',
              border: 0,
              borderRadius: 6,
              background: '#0f172a',
              color: '#ffffff',
              fontSize: 14,
              cursor: 'pointer',
            }}
            type="button"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
