import { socialCardImage, SOCIAL_IMAGE_SIZE } from '@/lib/brand-image'
import { SITE_NAME, SITE_TAGLINE } from '@/lib/site'

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`
export const size = SOCIAL_IMAGE_SIZE
export const contentType = 'image/png'

export default function OpengraphImage() {
  return socialCardImage()
}
