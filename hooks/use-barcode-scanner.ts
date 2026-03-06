"use client"

import { useEffect, useRef } from "react"

interface BarcodeScannerOptions {
  onScan: (barcode: string) => void
  timeout?: number
}

export function useBarcodeScanner({ onScan, timeout = 100 }: BarcodeScannerOptions) {
  const bufferRef = useRef<string>("")
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Ignore if typing in an input that's not the barcode field
      if (
        event.target instanceof HTMLInputElement &&
        event.target.getAttribute("data-barcode-input") !== "true"
      ) {
        return
      }

      // Clear timer and buffer on escape
      if (event.key === "Escape") {
        bufferRef.current = ""
        if (timerRef.current) clearTimeout(timerRef.current)
        return
      }

      // Process on Enter
      if (event.key === "Enter") {
        event.preventDefault()
        if (bufferRef.current.trim()) {
          onScan(bufferRef.current.trim())
          bufferRef.current = ""
        }
        if (timerRef.current) clearTimeout(timerRef.current)
        return
      }

      // Accumulate characters
      if (event.key.length === 1) {
        event.preventDefault()
        bufferRef.current += event.key

        // Reset timer
        if (timerRef.current) clearTimeout(timerRef.current)

        // Auto-trigger after timeout if buffer looks like a barcode
        timerRef.current = setTimeout(() => {
          if (bufferRef.current.length >= 5) {
            onScan(bufferRef.current)
            bufferRef.current = ""
          }
        }, timeout)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [onScan, timeout])

  const clearBuffer = () => {
    bufferRef.current = ""
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  return { clearBuffer }
}
