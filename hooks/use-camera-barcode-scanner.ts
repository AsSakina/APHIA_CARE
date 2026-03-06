"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface CameraBarcodeScannerOptions {
  onScan: (barcode: string) => void
  onError?: (error: string) => void
}

export function useCameraBarcodeScanner({ onScan, onError }: CameraBarcodeScannerOptions) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isActive, setIsActive] = useState(false)
  const streamRef = useRef<MediaStream | null>(null)

  const initializeCamera = useCallback(async () => {
    try {
      console.log("[v0] Initializing camera...")
      
      if (!navigator.mediaDevices?.getUserMedia) {
        const msg = "Caméra non supportée sur cet appareil"
        console.log("[v0] Error:", msg)
        onError?.(msg)
        return
      }

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })

      console.log("[v0] Stream received")

      // IMPORTANT: Set isActive FIRST so video element renders
      setIsActive(true)
      streamRef.current = stream

      // THEN attach stream in next frame when video element exists
      requestAnimationFrame(() => {
        if (videoRef.current) {
          console.log("[v0] Attaching stream to video element")
          videoRef.current.srcObject = stream
          console.log("[v0] Stream attached successfully")
        } else {
          console.log("[v0] WARNING: Video ref is null after setIsActive")
          stream.getTracks().forEach(track => track.stop())
        }
      })
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erreur d'accès caméra"
      console.log("[v0] Camera error:", errorMsg)
      onError?.(errorMsg)
      setIsActive(false)
    }
  }, [onError])

  const stopCamera = useCallback(() => {
    console.log("[v0] Stopping camera...")
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        console.log("[v0] Stopping track:", track.kind)
        track.stop()
      })
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsActive(false)
  }, [])

  return {
    videoRef,
    isActive,
    initializeCamera,
    stopCamera,
  }
}
