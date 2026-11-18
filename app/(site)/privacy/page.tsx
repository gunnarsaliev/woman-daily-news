import Link from 'next/link'
import { StaticPage, staticPageMetadata } from '@/components/static-page'
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site'

// TEMPLATE: describes what this codebase does today; it is not legal advice. Have it reviewed (e.g. for GDPR)
// before launch, and update it whenever analytics, ads, newsletters or accounts are added.
const LAST_UPDATED = 'November 18, 2026'

const page = {
  path: '/privacy',
  title: 'Privacy policy',
  description: `What information ${SITE_NAME} collects when you read the site, and how it is used.`,
}

export const metadata = staticPageMetadata(page)

export default function PrivacyPage() {
  return (
    <StaticPage {...page}>
      <p>
        <em>Last updated: {LAST_UPDATED}</em>
      </p>

      <h2>The short version</h2>
      <p>
        You can read {SITE_NAME} without an account. We don&apos;t use advertising, advertising trackers or tracking
        cookies, and we don&apos;t sell personal information.
      </p>

      <h2>Analytics</h2>
      <p>
        We use Vercel Web Analytics and Speed Insights to understand which pages are read and how fast they load. They
        work without cookies and report aggregated statistics, such as page views, referring sites, countries, device
        types and loading times, rather than profiles of individual visitors.
      </p>

      <h2>Hosting and server logs</h2>
      <p>
        The site is hosted by Vercel. Like most web hosts, its servers briefly keep technical logs of requests, such as IP
        addresses, browser types and the pages requested, to keep the service running and secure.
      </p>

      <h2>Sharing buttons</h2>
      <p>
        The share buttons on our stories only contact X or LinkedIn when you click them. Those services then handle your
        information under their own privacy policies.
      </p>

      <h2>Your choices and questions</h2>
      <p>
        {CONTACT_EMAIL ? (
          <>
            For any privacy question or request, email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </>
        ) : (
          <>
            For any privacy question or request, please <Link href="/contact">contact us</Link>.
          </>
        )}
      </p>
    </StaticPage>
  )
}
