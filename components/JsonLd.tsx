/**
 * Renders a JSON-LD <script> for structured data (schema.org).
 * Pass a single object or an array of schema objects.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // Schema is built server-side from our own data — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
