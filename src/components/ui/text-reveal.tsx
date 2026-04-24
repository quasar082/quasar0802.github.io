"use client"

import {
  useRef,
  type ComponentPropsWithoutRef,
  type FC,
  type ReactNode,
} from "react"
import { motion, MotionValue, useScroll, useTransform } from "motion/react"

import { cn } from "@/lib/utils"

export interface TextRevealProps extends ComponentPropsWithoutRef<"div"> {
  children: string
  italicWords?: string[]
}

export const TextReveal: FC<TextRevealProps> = ({
  children,
  className,
  italicWords = [],
}) => {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 85%", "end 20%"],
  })

  if (typeof children !== "string") {
    throw new Error("TextReveal: children must be a string")
  }

  const words = children.split(" ")
  const italicWordSet = new Set(italicWords.map((word) => word.toLowerCase()))

  return (
    <div ref={sectionRef} className={cn("relative z-0", className)}>
      <span className="flex flex-wrap">
        {words.map((word, i) => {
          const start = i / words.length
          const end = start + 1 / words.length
          const normalizedWord = word.toLowerCase().replace(/[^a-z0-9]/gi, "")
          const isItalic = italicWordSet.has(normalizedWord)
          return (
            <Word
              key={i}
              progress={scrollYProgress}
              range={[start, end]}
              className={isItalic ? "italic" : undefined}
            >
              {word}
            </Word>
          )
        })}
      </span>
    </div>
  )
}

interface WordProps {
  children: ReactNode
  progress: MotionValue<number>
  range: [number, number]
  className?: string
}

const Word: FC<WordProps> = ({ children, progress, range, className }) => {
  const opacity = useTransform(progress, range, [0, 1])
  return (
    <span className="xl:lg-3 relative mx-1 lg:mx-1.5">
      <span className={cn("absolute opacity-30", className)}>{children}</span>
      <motion.span
        style={{ opacity: opacity }}
        className={cn("text-inherit", className)}
      >
        {children}
      </motion.span>
    </span>
  )
}
