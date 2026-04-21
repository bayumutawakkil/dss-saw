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
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100 px-8 py-6 mb-8">
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <div className="flex items-center gap-2 mb-4">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {crumb.href ? (
                <a href={crumb.href} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  {crumb.label}
                </a>
              ) : (
                <span className="text-sm text-slate-600 font-medium">{crumb.label}</span>
              )}
              {idx < breadcrumbs.length - 1 && (
                <span className="text-slate-400">/</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Header Content */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          {icon && (
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
            {description && (
              <p className="text-slate-600 mt-1">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex gap-3">{actions}</div>}
      </div>
    </div>
  )
}
