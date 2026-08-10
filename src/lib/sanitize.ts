import DOMPurify from 'dompurify'

/* Defence in depth (plan §6.3). The API already sanitises rich text before it
   is stored, so this should never have anything to remove — but the public
   site is the last place an editor's HTML is turned into live DOM, and a
   second pass costs nothing next to the consequence of missing one. */

const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'blockquote',
  'ul',
  'ol',
  'li',
  'h2',
  'h3',
  'h4',
  'a',
  'code',
  'pre',
  'hr',
  'span',
]

const ALLOWED_ATTR = ['href', 'title', 'target', 'rel']

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.hasAttribute('href')) {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer nofollow')
  }
})

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['style', 'srcset', 'formaction'],
  })
}

/** Props for rendering CMS rich text. Never build these by hand. */
export function richTextProps(html: string | undefined | null): {
  dangerouslySetInnerHTML: { __html: string }
} {
  return { dangerouslySetInnerHTML: { __html: sanitizeHtml(html ?? '') } }
}
