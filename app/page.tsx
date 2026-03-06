import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Benefits } from "@/components/landing/benefits"
import { Security } from "@/components/landing/security"
import { CtaSection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content">
        <Hero />
        <Features />
        <Benefits />
        <Security />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
