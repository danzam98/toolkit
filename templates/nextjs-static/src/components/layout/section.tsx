'use client'

import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import { fadeInUp, useReducedMotion } from '@/lib/animations'

interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export function Section({ children, className, id }: SectionProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={prefersReducedMotion ? { hidden: {}, visible: {} } : fadeInUp}
      className={cn('py-16 sm:py-24', className)}
    >
      {children}
    </motion.section>
  )
}
