import React from 'react'

interface LoadingSkeletonProps {
  count?: number
  height?: 'sm' | 'md' | 'lg'
}

export default function LoadingSkeleton({
  count = 3,
  height = 'md',
}: LoadingSkeletonProps) {
  const heightClass = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-20',
  }[height]

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${heightClass} bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded-lg animate-pulse`}
        />
      ))}
    </div>
  )
}
