import { Link, Outlet } from 'react-router'

export default function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 pt-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between rounded-2xl border border-border bg-white px-6 py-4 shadow-sm">
          <Link to="/" className="font-display text-xl font-extrabold text-foreground">
            Event Participants
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10">
        <Outlet />
      </main>
    </div>
  )
}
