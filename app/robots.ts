import type { MetadataRoute } from 'next'
import { absoluteUrl, IS_INDEXABLE, SITE_URL } from '@/lib/site'

/**
 * AI assistants and AI search engines that are explicitly welcome. They are already allowed by the `*` rule;
 * naming them documents the choice and keeps them allowed if the `*` rule ever gets stricter.
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Meta-ExternalAgent',
  'Amazonbot',
  'DuckAssistBot',
  'MistralAI-User',
  'cohere-ai',
  'CCBot',
]

export default function robots(): MetadataRoute.Robots {
  // Preview deployments and local builds must never be indexed.
  if (!IS_INDEXABLE) return { rules: { userAgent: '*', disallow: '/' } }

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      { userAgent: AI_CRAWLERS, allow: '/', disallow: ['/api/'] },
    ],
    sitemap: [absoluteUrl('/sitemap.xml'), absoluteUrl('/news-sitemap.xml')],
    host: SITE_URL,
  }
}
