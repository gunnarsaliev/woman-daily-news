import { ImageResponse } from 'next/og'
import { BRAND, SITE_NAME, SITE_TAGLINE } from '@/lib/site'

/** Square brand mark (initials on the brand colour), used for favicons and the Organization logo. */
export function brandMarkImage(size: number) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: BRAND.background,
          color: BRAND.foreground,
          fontSize: Math.round(size * 0.46),
          fontWeight: 700,
          letterSpacing: '-0.04em',
        }}
      >
        {BRAND.initials}
      </div>
    ),
    { width: size, height: size },
  )
}

export const SOCIAL_IMAGE_SIZE = { width: 1200, height: 630 }

/** Longest title shown on an article card before it is cut with an ellipsis. */
const MAX_CARD_TITLE_LENGTH = 120

/** 1200×630 sharing card for an article without its own image: section, title and brand. */
export function articleCardImage(title: string, section?: string) {
  const text = title.length > MAX_CARD_TITLE_LENGTH ? `${title.slice(0, MAX_CARD_TITLE_LENGTH - 1).trimEnd()}…` : title
  // Longer titles get a smaller size so they fit in about three lines.
  const fontSize = text.length > 80 ? 54 : text.length > 50 ? 64 : 76
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: BRAND.background,
          color: BRAND.foreground,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 16,
              background: BRAND.accent,
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            {BRAND.initials}
          </div>
          <div style={{ fontSize: 30, fontWeight: 600 }}>{SITE_NAME}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {section && (
            <div style={{ display: 'flex', fontSize: 26, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.7 }}>
              {section}
            </div>
          )}
          <div style={{ display: 'flex', fontSize, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.025em' }}>{text}</div>
        </div>
      </div>
    ),
    {
      ...SOCIAL_IMAGE_SIZE,
      // Cards change only when a title does; cache them at the CDN for a day, then refresh in the background.
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
    },
  )
}

/** Default 1200×630 social sharing card: site name and tagline. */
export function socialCardImage(title = SITE_NAME, subtitle = SITE_TAGLINE) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: BRAND.background,
          color: BRAND.foreground,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div
            style={{
              width: 88,
              height: 88,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 20,
              background: BRAND.accent,
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            {BRAND.initials}
          </div>
          <div style={{ fontSize: 36, fontWeight: 600 }}>{SITE_NAME}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em' }}>{title}</div>
          <div style={{ fontSize: 34, opacity: 0.75 }}>{subtitle}</div>
        </div>
      </div>
    ),
    SOCIAL_IMAGE_SIZE,
  )
}
