import Image from '@tiptap/extension-image'

/**
 * Image extension with an extra `ratio` attribute (natural | 16-9 | square),
 * serialised as `data-ratio`. Used by BOTH the editor and the HTML renderer so
 * the chosen crop round-trips. CSS in globals.css / admin.css applies the crop.
 */
export const RichImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ratio: {
        default: 'natural',
        parseHTML: (el: HTMLElement) => el.getAttribute('data-ratio') || 'natural',
        renderHTML: (attrs: { ratio?: string }) =>
          attrs.ratio && attrs.ratio !== 'natural' ? { 'data-ratio': attrs.ratio } : {},
      },
    }
  },
})
