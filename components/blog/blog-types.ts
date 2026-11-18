export type BlogHeroData = {
  eyebrow: string
  title: string
  accent: string
  description: string
}

export type BlogCategory = {
  id: string
  label: string
  description?: string
}

export type BlogAuthor = {
  name: string
  /** Profile page of the author, on this site or elsewhere. */
  url?: string
  description?: string
}

export type BlogArticle = {
  id: string
  title: string
  categoryId: string
  summary: string
  tags: string[]
  readTime: string
  date: string
  timeAgo?: string
  /** Absent when the post has no main image. */
  image?: string
  imageAlt: string
  /** ISO 8601 date the post was first published. */
  publishedAt?: string
  /** ISO 8601 date the post was last changed. */
  updatedAt?: string
  /** Empty when the publication itself is the author. */
  authors?: BlogAuthor[]
  wordCount?: number
}

export type BlogHomeData = {
  hero: BlogHeroData
  categories: BlogCategory[]
  trustedBy: string[]
  spotlightArticleId: string
  articles: BlogArticle[]
}
