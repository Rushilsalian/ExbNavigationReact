import Sidebar from './Sidebar'
import Header from './Header'

function MainLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto p-6 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout
