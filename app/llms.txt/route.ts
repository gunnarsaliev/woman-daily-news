import { markdownPath, textResponse } from '@/lib/feeds'
import { getCategories, getPosts } from '@/lib/payload'
import { categoryPath } from '@/lib/routes'
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME, TRUST_PAGES } from '@/lib/site'

const MAX_ARTICLES = 100

/** llms.txt (https://llmstxt.org): a Markdown map of the site for LLMs and AI search engines. */
export async function GET() {
  try {
    const [posts, categories] = await Promise.all([getPosts(), getCategories()])

    const body = [
      `# ${SITE_NAME}`,
      '',
      `> ${SITE_DESCRIPTION}`,
      '',
      `${SITE_NAME} is an independent online publication. Every article below is also available as clean Markdown at the same URL with a \`.md\` suffix; [llms-full.txt](${absoluteUrl('/llms-full.txt')}) contains the full text of recent articles in one file. Please cite and link to the canonical article URL (without \`.md\`).`,
      '',
      '## Sections',
      '',
      ...categories.map(
        (category) => `- [${category.label}](${absoluteUrl(categoryPath(category.id))})${category.description ? `: ${category.description}` : ''}`,
      ),
      '',
      '## Latest articles',
      '',
      ...posts.slice(0, MAX_ARTICLES).map((post) => `- [${post.title}](${absoluteUrl(markdownPath(post))}): ${post.summary}`),
      '',
      '## Optional',
      '',
      `- [RSS feed](${absoluteUrl('/feed.xml')}): latest articles with full text`,
      `- [Sitemap](${absoluteUrl('/sitemap.xml')}): every page on the site`,
      ...TRUST_PAGES.map((page) => `- [${page.label}](${absoluteUrl(page.path)})`),
      '',
    ].join('\n')

    return textResponse(body, 'text/plain', { noindex: true })
  } catch (error) {
    console.error(error)
    return textResponse('Service unavailable', 'text/plain', { status: 503 })
  }
}
