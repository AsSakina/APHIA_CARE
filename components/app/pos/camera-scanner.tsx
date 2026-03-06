"use client"

import React from "react"
import { useState, useEffect, useRef } from "react"
import { Camera, X, AlertCircle, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCameraBarcodeScanner } from "@/hooks/use-camera-barcode-scanner"

interface CameraScannerProps {
  onScan: (barcode: string) => void
  isOpen: boolean
  onClose: () => void
}

export function CameraScanner({ onScan, isOpen, onClose }: CameraScannerProps) {
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [scannedText, setScannedText] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const { videoRef, isActive, initializeCamera, stopCamera } =
    useCameraBarcodeScanner({
      onScan: (barcode) => {
        console.log("[v0] Barcode scanned:", barcode)
        setScannedText(barcode)
        onScan(barcode)
        onClose()
      },
      onError: (err) => {
        console.log("[v0] Camera error:", err)
        setError(err)
      },
    })

  useEffect(() => {
    console.log("[v0] Component mounted")
    setMounted(true)
  }, [])

  // Initialize camera when modal opens
  useEffect(() => {
    if (isOpen && mounted) {
      console.log("[v0] Modal opened, initializing camera. isActive:", isActive)
      if (!isActive) {
        // Small delay to ensure videoRef is ready
        const timer = setTimeout(() => {
          initializeCamera()
        }, 100)
        return () => clearTimeout(timer)
      }
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [isOpen, mounted, isActive, initializeCamera])

  // Stop camera when modal closes
  useEffect(() => {
    if (!isOpen && isActive) {
      console.log("[v0] Modal closed, stopping camera")
      stopCamera()
    }
  }, [isOpen, isActive, stopCamera])

  const handleManualInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value) {
      const barcode = e.currentTarget.value.trim()
      console.log("[v0] Manual input:", barcode)
      setScannedText(barcode)
      onScan(barcode)
      e.currentTarget.value = ""
      setTimeout(() => setScannedText(""), 2000)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Scanner de Code Barre</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="border-b border-destructive/50 bg-destructive/10 px-4 py-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-destructive">{error}</p>
                <p className="text-xs text-destructive/70 mt-1">
                  Utilisez l'input en bas pour scanner manuellement
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Video Preview */}
        <div className="relative bg-black overflow-hidden">
          {!isActive ? (
            <div className="flex h-80 flex-col items-center justify-center gap-3 px-4 py-8">
              <Loader className="h-8 w-8 animate-spin text-cyan-500" />
              <p className="text-center text-sm text-white font-medium">
                Activation de la caméra...
              </p>
              <p className="text-center text-xs text-gray-300">
                Autorisez l'accès à la caméra quand demandé
              </p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-80 w-full object-cover"
              />

              {/* Overlay Grid */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-64 w-64 border-2 border-cyan-500/50 rounded-lg shadow-[inset_0_0_20px_rgba(6,182,212,0.2)]" />
              </div>

              {/* Status Badge */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-white">Caméra active</span>
              </div>
            </>
          )}
        </div>

        {/* Scanned Result or Error */}
        <div className="border-t p-4 space-y-3">
          {scannedText && (
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-2">
              <Badge variant="default" className="bg-green-600">Scan OK</Badge>
              <span className="text-sm font-mono">{scannedText}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-lg p-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          )}

          {/* Manual Input (pour scanner USB) */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Code barre (Scanner USB ou manuel)
            </label>
            <input
              ref={inputRef}
              type="text"
              placeholder="Scannez ou tapez le code..."
              onKeyDown={handleManualInput}
              className="w-full px-3 py-2 text-sm border rounded-lg bg-background"
              autoComplete="off"
            />
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-transparent"
            variant="outline"
          >
            Fermer
          </Button>
        </div>
      </Card>
    </div>
  )
}
