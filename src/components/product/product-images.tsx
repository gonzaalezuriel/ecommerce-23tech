"use client"

import { useState } from "react"
import Image from "next/image"
import { TiltImage } from "@/components/animations/tilt-image"

interface ProductImagesProps {
  images: string[]
  productName: string
}

export function ProductImages({ images, productName }: ProductImagesProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({})

  const hasImages = images.length > 0
  const currentUrl = hasImages ? images[selectedIndex] : null
  const mainFailed = !currentUrl || imgErrors[selectedIndex]

  function handleImgError(index: number) {
    setImgErrors((prev) => ({ ...prev, [index]: true }))
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-white">
        {mainFailed ? (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-6xl font-bold text-muted-foreground/20">
              {productName.charAt(0)}
            </span>
          </div>
        ) : (
          <TiltImage className="h-full w-full relative">
            <Image
              src={currentUrl ?? ""}
              alt={`${productName} - imagen ${selectedIndex + 1}`}
              fill
              className="object-contain p-4"
              onError={() => handleImgError(selectedIndex)}
            />
          </TiltImage>
        )}
      </div>

      {/* Thumbnails (solo si hay más de una imagen) */}
      {hasImages && images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {images.map((url, index) => (
            <button
              key={url}
              onClick={() => setSelectedIndex(index)}
              className={`relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-white transition-all duration-300 ${
                selectedIndex === index
                  ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background scale-105 shadow-[0_0_15px_rgba(0,212,255,0.25)]"
                  : "border-border hover:border-primary/50 hover:scale-105"
              }`}
            >
              {imgErrors[index] ? (
                <span className="text-sm font-bold text-muted-foreground/30">
                  {index + 1}
                </span>
              ) : (
                <Image
                  src={url}
                  alt={`${productName} - miniatura ${index + 1}`}
                  fill
                  className="object-contain p-1"
                  onError={() => handleImgError(index)}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
