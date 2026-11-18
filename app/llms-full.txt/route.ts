import { postMarkdown, textResponse } from '@/lib/feeds'
import { getCategories, getPosts } from '@/lib/payload'
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/site'

const MAX_ARTICLES = 50

/** The full text of recent articles in one Markdown file, for LLMs that ingest a site in one request. */
export async function GET() {
  try {
    const [posts, categories] = await Promise.all([getPosts(), getCategories()])
    const byId = new Map(categories.map((category) => [category.id, category]))
    const articles = posts.slice(0, MAX_ARTICLES).map((post) => postMarkdown(post, byId.get(post.categoryId)).replace(/^# /, '## '))
    const body = [`# ${SITE_NAME}`, '', `> ${SITE_DESCRIPTION}`, '', articles.join('\n---\n\n')].join('\n')
    return textResponse(body, 'text/plain', { noindex: true })
  } catch (error) {
    console.error(error)
    return textResponse('Service unavailable', 'text/plain', { status: 503 })
  }
}
