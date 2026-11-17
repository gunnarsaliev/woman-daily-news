import type { ReactNode } from 'react'

/** A node of Payload's Lexical rich text JSON. */
export type LexicalNode = {
  type: string
  children?: LexicalNode[]
  text?: string
  format?: number | string
  tag?: string
  listType?: string
  fields?: { url?: string; newTab?: boolean }
}

export type ArticleHeading = {
  id: string
  text: string
  level: 2 | 3
}

// Lexical stores text formatting as a bitmask.
const BOLD = 1
const ITALIC = 2
const STRIKETHROUGH = 4
const UNDERLINE = 8
const CODE = 16

function plainText(node: LexicalNode): string {
  if (typeof node.text === 'string') return node.text
  return (node.children ?? []).map(plainText).join('')
}

/** Zero-width characters count as empty: the CMS leaves them in trailing paragraphs. */
function isBlank(text: string) {
  return text.replace(/[\s\u200b-\u200d\ufeff]/g, '') === ''
}

/** The article title is the page's only h1, so h1 in the body is demoted to h2. */
function headingTag(node: LexicalNode) {
  return (node.tag && node.tag !== 'h1' ? node.tag : 'h2') as 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

/** Whether a heading gets an anchor id and a table of contents entry. */
function isSectionHeading(node: LexicalNode) {
  const tag = headingTag(node)
  return node.type === 'heading' && (tag === 'h2' || tag === 'h3') && !isBlank(plainText(node))
}

/**
 * Section headings (h2 and h3) in document order. Ids are positional, so they
 * match the ones RichText renders for the same content.
 */
export function getHeadings(root: LexicalNode): ArticleHeading[] {
  const headings: ArticleHeading[] = []
  function visit(node: LexicalNode) {
    if (isSectionHeading(node)) {
      headings.push({
        id: `section-${headings.length + 1}`,
        text: plainText(node).trim(),
        level: headingTag(node) === 'h2' ? 2 : 3,
      })
    }
    node.children?.forEach(visit)
  }
  visit(root)
  return headings
}

function renderText(node: LexicalNode): ReactNode {
  const format = typeof node.format === 'number' ? node.format : 0
  let content: ReactNode = node.text
  if (format & CODE) content = <code>{content}</code>
  if (format & BOLD) content = <strong>{content}</strong>
  if (format & ITALIC) content = <em>{content}</em>
  if (format & UNDERLINE) content = <u>{content}</u>
  if (format & STRIKETHROUGH) content = <s>{content}</s>
  return content
}

export function RichText({ root }: { root: LexicalNode }) {
  let sectionCount = 0

  function renderNode(node: LexicalNode, key: number): ReactNode {
    // Claim the section id before rendering children, matching getHeadings' order.
    const sectionId = isSectionHeading(node) ? `section-${++sectionCount}` : undefined
    const children = node.children?.map(renderNode)

    switch (node.type) {
      case 'text':
        return <span key={key}>{renderText(node)}</span>
      case 'linebreak':
        return <br key={key} />
      case 'paragraph':
        return isBlank(plainText(node)) ? null : <p key={key}>{children}</p>
      case 'heading': {
        const Tag = headingTag(node)
        return (
          <Tag className="scroll-mt-24" id={sectionId} key={key}>
            {children}
          </Tag>
        )
      }
      case 'quote':
        return <blockquote key={key}>{children}</blockquote>
      case 'list':
        return node.listType === 'number' ? <ol key={key}>{children}</ol> : <ul key={key}>{children}</ul>
      case 'listitem':
        return <li key={key}>{children}</li>
      case 'horizontalrule':
        return <hr key={key} />
      case 'link':
      case 'autolink': {
        const newTab = node.fields?.newTab
        return (
          <a href={node.fields?.url ?? '#'} key={key} rel={newTab ? 'noopener noreferrer' : undefined} target={newTab ? '_blank' : undefined}>
            {children}
          </a>
        )
      }
      default:
        // Unknown node types (e.g. custom blocks) still show their text.
        return children ? <div key={key}>{children}</div> : null
    }
  }

  return <>{root.children?.map(renderNode)}</>
}
