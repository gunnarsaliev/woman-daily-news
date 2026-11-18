import Link from 'next/link'
import { StaticPage, staticPageMetadata } from '@/components/static-page'
import { SITE_NAME } from '@/lib/site'

// TEMPLATE: review with the editorial team before launch. Google News and E-E-A-T read this as a commitment.
const page = {
  path: '/editorial-policy',
  title: 'Editorial policy',
  description: `The standards ${SITE_NAME} follows when choosing, writing, checking and correcting stories.`,
}

export const metadata = staticPageMetadata(page)

export default function EditorialPolicyPage() {
  return (
    <StaticPage {...page}>
      <h2>Accuracy</h2>
      <p>
        We aim to be accurate, fair and clear. Facts, figures and quotes are checked against their original sources before
        we publish, and we link to those sources where we can.
      </p>

      <h2>Independence</h2>
      <p>
        Our editorial decisions are made independently. Sponsored content, if we ever publish it, will always be clearly
        labelled as such.
      </p>

      <h2>Sources</h2>
      <p>
        We prefer primary sources such as official documents, research and direct interviews. When we rely on another
        publication&apos;s reporting, we say so and link to it.
      </p>

      <h2>Use of AI tools</h2>
      <p>
        Editors may use software tools, including AI, to help with research and drafting. Every story is reviewed by a
        person before it is published, and that person is responsible for its accuracy.
      </p>

      <h2 id="corrections">Corrections</h2>
      <p>
        When we get something wrong, we fix it promptly and, for significant errors, add a note to the story explaining
        what changed. To report an error, please <Link href="/contact">contact us</Link>.
      </p>
    </StaticPage>
  )
}
