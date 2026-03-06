import Image from "next/image"

interface ThemeLogoProps {
  className?: string
  width?: number
  height?: number
}

export function ThemeLogo({ className, width = 120, height = 40 }: ThemeLogoProps) {
  return (
    <>
      {/* Light mode logo (dark text) - shown on light backgrounds */}
      <Image
        src="/images/1-20copy.png"
        alt="APHIA"
        width={width}
        height={height}
        className={`dark:hidden ${className}`}
        priority
      />
      {/* Dark mode logo (white text) - shown on dark backgrounds */}
      <Image
        src="/images/2-20copy.png"
        alt="APHIA"
        width={width}
        height={height}
        className={`hidden dark:block ${className}`}
        priority
      />
    </>
  )
}
