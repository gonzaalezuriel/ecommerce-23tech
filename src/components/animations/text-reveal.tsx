"use client"

import { motion, Variants } from "framer-motion"

export function TextReveal({
  text,
  className = "",
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  const words = text.split(" ")

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: delay },
    },
  }

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 100 } },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={`${className} flex flex-wrap gap-x-2`}
    >
      {words.map((word, i) => (
        <motion.span key={i} variants={item} className="inline-block">
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}
