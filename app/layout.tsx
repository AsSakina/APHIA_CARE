import type React from "react"
import type { Metadata, Viewport } from "next"

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"

import { Poppins, Geist_Mono, Poppins as V0_Font_Poppins, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _poppins = V0_Font_Poppins({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"] })

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "APHIA - Plateforme de gestion pour pharmacies",
  description:
    "La plateforme intelligente de gestion pour pharmacies. Optimisez vos stocks, finances et performances avec APHIA.",
  keywords: ["pharmacie", "gestion", "stocks", "finance", "Afrique", "APHIA"],
  authors: [{ name: "APHIA" }],
  creator: "APHIA",
  publisher: "APHIA",
  metadataBase: new URL("https://aphia.app"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://aphia.app",
    siteName: "APHIA",
    title: "APHIA - Plateforme de gestion pour pharmacies",
    description:
      "La plateforme intelligente de gestion pour pharmacies. Optimisez vos stocks, finances et performances.",
  },
  twitter: {
    card: "summary_large_image",
    title: "APHIA - Plateforme de gestion pour pharmacies",
    description:
      "La plateforme intelligente de gestion pour pharmacies. Optimisez vos stocks, finances et performances.",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffcff" },
    { media: "(prefers-color-scheme: dark)", color: "#060d1f" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${poppins.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
          storageKey="aphia-theme"
          themes={["light", "dark", "system"]}
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
