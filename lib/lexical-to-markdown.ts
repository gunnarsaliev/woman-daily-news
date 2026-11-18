import type { LexicalNode } from '@/components/blog/rich-text'

/** Converts Payload's Lexical rich text JSON to Markdown, for LLM-friendly article endpoints. */

// Lexical stores text formatting as a bitmask (see components/blog/rich-text.tsx).
const BOLD = 1
const ITALIC = 2
const STRIKETHROUGH = 4
const CODE = 16

function inline(node: LexicalNode): string {
  switch (node.type) {
    case 'text': {
      const text = node.text ?? ''
      if (!text.trim()) return text
      const format = typeof node.format === 'number' ? node.format : 0
      let out = text
      if (format & CODE) out = `\`${out}\``
      if (format & BOLD) out = `**${out}**`
      if (format & ITALIC) out = `_${out}_`
      if (format & STRIKETHROUGH) out = `~~${out}~~`
      return out
    }
    case 'linebreak':
      return '  \n'
    case 'link':
    case 'autolink': {
      const label = children(node)
      const url = node.fields?.url
      return url ? `[${label}](${url})` : label
    }
    default:
      return children(node)
  }
}

function children(node: LexicalNode) {
  return (node.children ?? []).map(inline).join('')
}

function block(node: LexicalNode, depth = 0): string {
  switch (node.type) {
    case 'heading': {
      // The article title is the only h1, so headings start at h2, as on the page.
      const level = Math.min(6, Math.max(2, Number(node.tag?.slice(1)) || 2))
      return `${'#'.repeat(level)} ${children(node).trim()}`
    }
    case 'quote':
      return children(node)
        .split('\n')
        .map((line) => `> ${line}`)
        .join('\n')
    case 'list':
      return (node.children ?? [])
        .map((item, index) => {
          const nested = (item.children ?? []).filter((child) => child.type === 'list')
          const text = (item.children ?? [])
            .filter((child) => child.type !== 'list')
            .map(inline)
            .join('')
            .trim()
          const marker = node.listType === 'number' ? `${index + 1}.` : '-'
          const indent = '  '.repeat(depth)
          const lines = text ? [`${indent}${marker} ${text}`] : []
          return [...lines, ...nested.map((list) => block(list, depth + 1))].join('\n')
        })
        .join('\n')
    case 'horizontalrule':
      return '---'
    default:
      return children(node).trim()
  }
}

export function lexicalToMarkdown(root: LexicalNode | undefined): string {
  if (!root) return ''
  return (root.children ?? [])
    .map((node) => block(node))
    // Drops paragraphs that are empty or hold only zero-width characters left by the editor.
    .filter((text) => text.replace(/[\s\u200B-\u200D\uFEFF]/g, ''))
    .join('\n\n')
}
