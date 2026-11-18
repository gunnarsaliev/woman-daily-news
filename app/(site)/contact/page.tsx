import Link from 'next/link'
import { StaticPage, staticPageMetadata } from '@/components/static-page'
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site'

const page = {
  path: '/contact',
  title: 'Contact us',
  description: `How to reach the ${SITE_NAME} team with story tips, corrections and other questions.`,
  type: 'ContactPage' as const,
}

export const metadata = staticPageMetadata(page)

export default function ContactPage() {
  return (
    <StaticPage {...page}>
      {CONTACT_EMAIL ? (
        <p>
          The best way to reach us is by email at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We read every
          message, and we aim to reply within a few working days.
        </p>
      ) : (
        <p>Contact details for the {SITE_NAME} team will be listed here soon.</p>
      )}

      <h2>Story tips</h2>
      <p>Know something we should cover? Tell us what happened, why it matters and how we can follow up.</p>

      <h2>Corrections</h2>
      <p>
        If you believe something we published is wrong, please include a link to the story and what needs correcting.
        Read how we handle corrections in our <Link href="/editorial-policy#corrections">editorial policy</Link>.
      </p>
    </StaticPage>
  )
}
