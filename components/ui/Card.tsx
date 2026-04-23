import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  border?: boolean
  shadow?: 'sm' | 'md' | 'lg' | 'none'
}

export default function Card({
  children,
  className = '',
  padding = 'md',
  border = true,
  shadow = 'sm',
}: CardProps) {
  const paddingClass = {
    sm: 'p-3 md:p-4',
    md: 'p-4 md:p-6',
    lg: 'p-5 md:p-8',
  }[padding]

  const shadowClass = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    none: '',
  }[shadow]

  const borderClass = border ? 'border border-slate-200 dark:border-slate-700' : ''

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-2xl ${borderClass} ${shadowClass} transition-shadow duration-200 ${paddingClass} ${className}`}
    >
      {children}
    </div>
  )
}
