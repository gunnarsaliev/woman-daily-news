/** URL of a category's listing page. */
export function categoryPath(categoryId: string) {
  return `/${categoryId}`
}

/** Canonical URL of a post. Posts live at the root, next to category pages (a category wins a shared slug). */
export function postPath(post: { id: string; categoryId?: string }) {
  return `/${post.id}`
}

/** Generated sharing card (app/og) for a post that has no image of its own. */
export function ogImagePath(post: { id: string }) {
  return `/og${postPath(post)}`
}
