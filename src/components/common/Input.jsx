function Input({
  label,
  error,
  hint,
  icon,
  id,
  className = '',
  type = 'text',
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          type={type}
          className={`
            w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900
            placeholder:text-slate-400 transition-colors
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            disabled:bg-slate-50 disabled:cursor-not-allowed
            ${error ? 'border-red-400 focus:ring-red-500' : 'border-slate-300'}
            ${icon ? 'pl-9' : ''}
          `}
          {...props}
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}

export default Input
