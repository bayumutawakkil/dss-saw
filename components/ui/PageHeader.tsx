import React from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: Array<{ label: string; href?: string }>
  actions?: React.ReactNode
  icon?: React.ReactNode
}

export default function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  icon,
}: PageHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-slate-800 border-b border-indigo-100 dark:border-slate-700 px-4 py-4 md:px-8 md:py-6 mb-6 md:mb-8">
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {crumb.href ? (
                <a href={crumb.href} className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium">
                  {crumb.label}
                </a>
              ) : (
                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{crumb.label}</span>
              )}
              {idx < breadcrumbs.length - 1 && (
                <span className="text-slate-400 dark:text-slate-600">/</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Header Content */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          {icon && (
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">{title}</h1>
            {description && (
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex gap-3 flex-wrap">{actions}</div>}
      </div>
    </div>
  )
}
