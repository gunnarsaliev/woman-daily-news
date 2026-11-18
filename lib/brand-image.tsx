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
