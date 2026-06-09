'use client'

import { useEffect } from 'react'

// Finds code blocks tagged `language-mermaid` in the rendered post body and
// replaces them with brand-themed SVG diagrams. Mermaid is loaded lazily so it
// only ships to readers on posts that actually contain a diagram.
export default function MermaidClient() {
  useEffect(() => {
    let cancelled = false

    ;(async () => {
      const blocks = Array.from(
        document.querySelectorAll<HTMLElement>('.post-body pre code.language-mermaid'),
      )
      if (blocks.length === 0) return

      const mermaid = (await import('mermaid')).default
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'base',
        themeVariables: {
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          fontSize: '15px',
          background: 'transparent',
          primaryColor: '#161A3B',
          primaryTextColor: '#ffffff',
          primaryBorderColor: '#161A3B',
          secondaryColor: '#D7F26C',
          secondaryTextColor: '#0A0A0A',
          tertiaryColor: '#F4F4F2',
          tertiaryTextColor: '#0A0A0A',
          lineColor: '#8A8DA3',
          textColor: '#0A0A0A',
          noteBkgColor: '#D7F26C',
          noteTextColor: '#0A0A0A',
        },
      })

      for (let i = 0; i < blocks.length; i++) {
        const code = blocks[i].textContent ?? ''
        const pre = blocks[i].closest('pre')
        if (!pre || !code.trim()) continue
        try {
          const { svg } = await mermaid.render(`mmd-${Date.now()}-${i}`, code)
          if (cancelled) return
          const fig = document.createElement('figure')
          fig.className = 'post-mermaid'
          fig.innerHTML = svg
          pre.replaceWith(fig)
        } catch {
          // Leave the original code block in place if the diagram fails to parse.
        }
      }
    })()

    return () => { cancelled = true }
  }, [])

  return null
}
