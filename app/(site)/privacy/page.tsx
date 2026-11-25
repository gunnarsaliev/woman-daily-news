import Link from 'next/link'
import { CookieSettingsButton } from '@/components/cookie-settings-button'
import { StaticPage, staticPageMetadata } from '@/components/static-page'
import { CONSENT_CATEGORIES } from '@/lib/consent'
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site'

// TEMPLATE: describes what this codebase does today; it is not legal advice. Have it reviewed (e.g. for GDPR)
// before launch, and update it whenever analytics, ads, newsletters or accounts are added — including tags added
// inside Google Tag Manager, which don't show up in this codebase.
const LAST_UPDATED = 'November 25, 2026'

const page = {
  path: '/privacy',
  title: 'Privacy policy',
  description: `What information ${SITE_NAME} collects when you read the site, which cookies it uses, and how to change your choices.`,
}

export const metadata = staticPageMetadata(page)

const inlineButton = 'font-medium text-sky-700 underline underline-offset-2 hover:text-sky-800'

export default function PrivacyPage() {
  return (
    <StaticPage {...page}>
      <p>
        <em>Last updated: {LAST_UPDATED}</em>
      </p>

      <h2>The short version</h2>
      <p>
        You can read {SITE_NAME} without an account, we don&apos;t show ads, and we don&apos;t sell personal
        information. We use Google Analytics to see how the site is used, but only if you agree to analytics cookies, and you can change your mind at any time from{' '}
        <CookieSettingsButton className={inlineButton} /> (also linked at the bottom of every page).
      </p>

      <h2>Cookies and your consent</h2>
      <p>
        When you first visit, we ask which kinds of cookies and similar storage you allow. Until you choose, everything
        except security storage is switched off. We remember your choice in a cookie on your device so we don&apos;t ask
        again on every visit; we may ask again if the kinds of storage we use change.
      </p>
      <ul>
        {CONSENT_CATEGORIES.map((category) => (
          <li key={category.id}>
            <strong>{category.title}</strong>
            {category.necessary ? ' (always on)' : ''}: {category.description}
          </li>
        ))}
      </ul>

      <h2>Google Analytics and Google Tag Manager</h2>
      <p>
        We use Google Analytics 4, loaded through Google Tag Manager, to understand how readers find and use the site.
        With your consent to analytics, Google Analytics records things like the pages you view, how long you stay,
        how you arrived (for example from a search engine or social network), your approximate location (city or
        country) and your device and browser type. It identifies returning browsers with first-party cookies named{' '}
        <code>_ga</code> and <code>_ga_&lt;ID&gt;</code>, which last up to two years. Google Analytics 4
        doesn&apos;t log or store IP addresses.
      </p>
      <p>
        Google Tag Manager itself only loads the Analytics tag and doesn&apos;t set cookies. We use Google Consent Mode
        to pass your choices to Google: if you decline analytics, Google Analytics doesn&apos;t set or read its cookies,
        though Google may still receive basic, cookieless signals (such as the fact that a page was loaded) as described
        in{' '}
        <a href="https://policies.google.com/technologies/partner-sites" rel="noopener noreferrer" target="_blank">
          how Google uses information from sites that use its services
        </a>
        . Google processes this information under its own{' '}
        <a href="https://policies.google.com/privacy" rel="noopener noreferrer" target="_blank">
          privacy policy
        </a>
        , and you can also block Google Analytics on every site with Google&apos;s{' '}
        <a href="https://tools.google.com/dlpage/gaoptout" rel="noopener noreferrer" target="_blank">
          opt-out browser add-on
        </a>
        .
      </p>
      <p>
        We don&apos;t currently show ads. The advertising and personalization choices in our cookie settings are there
        so that any such features are off unless you agree to them.
      </p>

      <h2>Vercel Analytics</h2>
      <p>
        We also use Vercel Web Analytics and Speed Insights to understand which pages are read and how fast they load.
        They work without cookies and report aggregated statistics, such as page views, referring sites, countries,
        device types and loading times, rather than profiles of individual visitors.
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
        You can review or change your cookie choices at any time from <CookieSettingsButton className={inlineButton} />.
        You can also block or delete cookies in your browser settings, though some parts of the site may then not
        remember your preferences.
      </p>
      <p>
        {CONTACT_EMAIL ? (
          <>
            For any other privacy question or request, email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </>
        ) : (
          <>
            For any other privacy question or request, please <Link href="/contact">contact us</Link>.
          </>
        )}
      </p>
    </StaticPage>
  )
}
