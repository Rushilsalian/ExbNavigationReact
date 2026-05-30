import Button from './Button'

function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
      {icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        {description && (
          <p className="text-sm text-slate-500 max-w-xs">{description}</p>
        )}
      </div>
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
