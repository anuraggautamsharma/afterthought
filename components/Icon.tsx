import type { CSSProperties } from 'react'

export interface IconProps {
  /** Material Symbol name, e.g. "search", "arrow_forward", "delete". */
  name: string
  /** Pixel size (also drives optical size unless overridden). Default 24. */
  size?: number
  /** Filled vs outlined. Default false (outlined). */
  fill?: boolean
  /** Stroke weight, 100–700. Default 400. */
  weight?: number
  /** Grade (emphasis), -50–200. Default 0. */
  grade?: number
  /** Optical size, 20–48. Defaults to `size`. */
  opticalSize?: number
  /** Colour (defaults to currentColor). */
  color?: string
  className?: string
  style?: CSSProperties
  /** Accessible label. If omitted, the icon is hidden from screen readers. */
  label?: string
}

/**
 * Google Material Symbols icon. The font is loaded globally in the root layout.
 * Browse names at https://fonts.google.com/icons
 */
export default function Icon({
  name,
  size = 24,
  fill = false,
  weight = 400,
  grade = 0,
  opticalSize,
  color,
  className = '',
  style,
  label,
}: IconProps) {
  return (
    <span
      className={`material-symbols-outlined${className ? ` ${className}` : ''}`}
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      style={{
        fontSize: size,
        color,
        ['--icon-fill' as string]: fill ? 1 : 0,
        ['--icon-wght' as string]: weight,
        ['--icon-grad' as string]: grade,
        ['--icon-opsz' as string]: opticalSize ?? size,
        ...style,
      } as CSSProperties}
    >
      {name}
    </span>
  )
}
