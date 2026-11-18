import type { LexicalNode } from '@/components/blog/rich-text'
import { absoluteUrl } from '@/lib/site'

/** Converts Payload's Lexical rich text JSON to plain HTML, for RSS `content:encoded`. */

// Lexical stores text formatting as a bitmask (see components/blog/rich-text.tsx).
const BOLD = 1
const ITALIC = 2
const STRIKETHROUGH = 4
const UNDERLINE = 8
const CODE = 16

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/**
 * Only web and mail links are kept, so CMS content can't inject `javascript:` URLs into feed readers.
 * Site-relative links are made absolute because feed readers show the content away from the site.
 */
function safeUrl(url: string | undefined) {
  if (!url) return undefined
  if (url.startsWith('/') && !url.startsWith('//')) return absoluteUrl(url)
  return /^(https?:|mailto:)/i.test(url) ? url : undefined
}

function render(node: LexicalNode): string {
  const inner = (node.children ?? []).map(render).join('')

  switch (node.type) {
    case 'text': {
      const format = typeof node.format === 'number' ? node.format : 0
      let out = escapeHtml(node.text ?? '')
      if (format & CODE) out = `<code>${out}</code>`
      if (format & BOLD) out = `<strong>${out}</strong>`
      if (format & ITALIC) out = `<em>${out}</em>`
      if (format & UNDERLINE) out = `<u>${out}</u>`
      if (format & STRIKETHROUGH) out = `<s>${out}</s>`
      return out
    }
    case 'linebreak':
      return '<br>'
    case 'paragraph':
      return `<p>${inner}</p>`
    case 'heading': {
      const tag = node.tag && /^h[2-6]$/.test(node.tag) ? node.tag : 'h2'
      return `<${tag}>${inner}</${tag}>`
    }
    case 'quote':
      return `<blockquote>${inner}</blockquote>`
    case 'list':
      return node.listType === 'number' ? `<ol>${inner}</ol>` : `<ul>${inner}</ul>`
    case 'listitem':
      return `<li>${inner}</li>`
    case 'horizontalrule':
      return '<hr>'
    case 'link':
    case 'autolink': {
      const url = safeUrl(node.fields?.url)
      return url ? `<a href="${escapeHtml(url)}">${inner}</a>` : inner
    }
    default:
      return inner
  }
}

export function lexicalToHtml(root: LexicalNode | undefined): string {
  return root ? (root.children ?? []).map(render).join('\n') : ''
}
