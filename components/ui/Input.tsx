import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helpText?: string
  icon?: React.ReactNode
}

export default function Input({
  label,
  error,
  helpText,
  icon,
  id,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && <div className="absolute left-3 top-3 text-slate-400 dark:text-slate-500">{icon}</div>}
        <input
          id={id}
          className={`w-full px-4 py-2.5 ${icon ? 'pl-10' : ''} rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      {helpText && !error && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{helpText}</p>}
    </div>
  )
}
