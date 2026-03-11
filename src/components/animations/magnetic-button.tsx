"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  intensity?: number
}

export function MagneticButton({
  children,
  className = "",
  intensity = 0.5,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHoverable, setIsHoverable] = useState(false)

  useEffect(() => {
    setIsHoverable(window.matchMedia("(hover: hover) and (pointer: fine)").matches)
  }, [])

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHoverable) return
    const { clientX, clientY } = e
    const { height, width, left, top } = ref.current!.getBoundingClientRect()
    const middleX = clientX - (left + width / 2)
    const middleY = clientY - (top + height / 2)
    setPosition({ x: middleX * intensity, y: middleY * intensity })
  }

  const reset = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  )
}
