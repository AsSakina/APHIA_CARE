"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function PWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      setDeferredPrompt(null)
      setIsInstallable(false)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === "accepted") {
        setDeferredPrompt(null)
        setIsInstallable(false)
      }
    }
  }

  if (!isInstallable) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9"
      onClick={handleInstall}
      title="Installer l'application"
    >
      <Download className="h-5 w-5" />
      <span className="sr-only">Installer l'application</span>
    </Button>
  )
}

// Alias for compatibility
export const PwaButton = PWAButton
