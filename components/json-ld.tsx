import type { Graph, Thing, WithContext } from 'schema-dts'

/**
 * Renders schema.org structured data as a JSON-LD script tag.
 * `<` is escaped so text from the CMS can never close the script tag (XSS).
 */
export function JsonLd({ data }: { data: WithContext<Thing> | Graph }) {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
      type="application/ld+json"
    />
  )
}
