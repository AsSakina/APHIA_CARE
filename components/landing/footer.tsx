import Link from "next/link"
import { ThemeLogo } from "./theme-logo"

const footerLinks = [
  { label: "Fonctionnalités", href: "#features" },
  { label: "Modules", href: "#benefits" },
  { label: "Sécurité", href: "#security" },
  { label: "Contact", href: "#contact" },
  { label: "Mentions légales", href: "/legal" },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card px-4 py-12 sm:px-6 lg:px-8" role="contentinfo">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <Link href="/" aria-label="APHIA - Accueil">
            <ThemeLogo width={100} height={33} />
          </Link>

          <nav aria-label="Navigation du pied de page">
            <ul className="flex flex-wrap items-center justify-center gap-6">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">&copy; {currentYear} APHIA. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
