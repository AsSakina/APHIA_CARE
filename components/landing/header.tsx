"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeLogo } from "./theme-logo"
import { Menu, X } from "lucide-react"

const navItems = [
  { label: "Fonctionnalités", href: "#features" },
  { label: "Modules", href: "#benefits" },
  { label: "Sécurité", href: "#security" },
  { label: "Contact", href: "#contact" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Navigation principale"
      >
        <Link href="/" className="flex items-center" aria-label="APHIA - Accueil">
          <ThemeLogo width={120} height={40} />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex md:items-center md:gap-3">
          <Button variant="ghost" asChild>
            <Link href="/auth/login">Se connecter</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/register">S'inscrire</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="border-t border-border md:hidden">
          <div className="space-y-1 px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4">
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/auth/login">Se connecter</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/auth/register">S'inscrire</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
