import { useLocation } from 'react-router-dom'

const pageTitles = {
  '/': { title: 'Dashboard', description: 'Overview of your exhibition setup' },
  '/hall-upload': { title: 'Hall Upload', description: 'Upload and manage SVG floor plans' },
  '/booth-mapping': { title: 'Booth Mapping', description: 'Place and configure exhibition booths' },
  '/navigation-editor': { title: 'Navigation Editor', description: 'Build the indoor navigation graph' },
}

function Header() {
  const { pathname } = useLocation()
  const { title, description } = pageTitles[pathname] || { title: 'Admin Panel', description: '' }

  return (
    <header className="h-16 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div>
        <h1 className="text-base font-semibold text-slate-900 leading-none">{title}</h1>
        {description && (
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell placeholder */}
        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        {/* User avatar placeholder */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
          A
        </div>
      </div>
    </header>
  )
}

export default Header
