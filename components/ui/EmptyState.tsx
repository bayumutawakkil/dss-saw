import React from 'react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-sm">{description}</p>
      {action && <div>{action}</div>}
    </div>
  )
}
