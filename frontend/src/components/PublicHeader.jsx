import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'

function HamburgerIcon({ open }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {open ? (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </>
      )}
    </svg>
  )
}

export function PublicHeader() {
  const { user } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Close drawer on ESC
  useEffect(() => {
    if (!drawerOpen) return
    const handler = (e) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [drawerOpen])

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  return (
    <header className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-8 lg:px-10">
      <Logo />

      {/* Desktop Links */}
      <nav
        className="hidden items-center gap-8 text-sm text-stone-500 lg:flex dark:text-stone-400"
        aria-label="Main navigation"
      >
        <a className="transition hover:text-amber-600 dark:hover:text-amber-400" href="#experience">
          Experience
        </a>
        <a className="transition hover:text-amber-600 dark:hover:text-amber-400" href="#features">
          Features
        </a>
        <a className="transition hover:text-amber-600 dark:hover:text-amber-400" href="#story">
          Our story
        </a>
      </nav>

      {/* Desktop Right Actions (Hidden on Mobile) */}
      <div className="hidden items-center gap-3 sm:flex">
        <ThemeToggle />

        {user ? (
          <Link
            className="flex items-center gap-1.5 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-amber-500/20 transition hover:bg-amber-600"
            to="/dashboard"
          >
            <span>Dashboard</span>
            <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <>
            <Link
              className="rounded-full px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-800"
              to="/login"
            >
              Sign in
            </Link>
            <Link
              className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-amber-500/20 transition hover:-translate-y-0.5 hover:bg-amber-600"
              to="/register"
            >
              Get started <span aria-hidden="true">↗</span>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Right Controls: Only Theme Toggle + Hamburger */}
      <div className="flex items-center gap-2 sm:hidden">
        <ThemeToggle showLabel={false} />

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-stone-700 transition hover:bg-stone-100 active:scale-95 dark:text-stone-300 dark:hover:bg-stone-800"
          aria-label="Open navigation menu"
          aria-expanded={drawerOpen}
        >
          <HamburgerIcon open={false} />
        </button>
      </div>

      {/* ── Mobile Drawer Backdrop ───────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300 sm:hidden ${
          drawerOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* ── Mobile Drawer Panel (Identical slide-in animation & dimensions) ──── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full max-h-screen w-67.5 max-w-[80vw] flex-col overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ease-out dark:bg-stone-900 sm:hidden ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation drawer"
      >
        {/* Drawer Header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-stone-100 px-4 dark:border-stone-800">
          <Logo />
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-stone-500 transition hover:bg-stone-100 active:scale-95 dark:text-stone-400 dark:hover:bg-stone-800"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation menu"
          >
            <HamburgerIcon open={true} />
          </button>
        </div>

        {/* User Card or Welcome Card */}
        {user ? (
          <div className="mx-3 mt-3 shrink-0 flex items-center gap-2.5 rounded-xl bg-amber-50 px-3 py-2 dark:bg-amber-950/20">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-stone-900 dark:text-stone-100">
                {user?.name}
              </p>
              <span className="inline-block rounded-full bg-amber-200 px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                {user?.role || 'User'}
              </span>
            </div>
          </div>
        ) : (
          <div className="mx-3 mt-3 shrink-0 rounded-xl bg-stone-50 p-3 dark:bg-stone-800/40">
            <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">Welcome to Restora</p>
            <p className="mt-0.5 text-[11px] text-stone-500 dark:text-stone-400">Hospitality made human.</p>
          </div>
        )}

        {/* Navigation list */}
        <div className="mt-3 px-3">
          <p className="mb-1 px-1 text-[9px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">
            Explore
          </p>
          <nav className="flex flex-col gap-0.5">
            <a
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-stone-700 transition hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
              href="#experience"
            >
              <span>✨</span> Experience
            </a>
            <a
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-stone-700 transition hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
              href="#features"
            >
              <span>✦</span> Features
            </a>
            <a
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-stone-700 transition hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
              href="#story"
            >
              <span>📖</span> Our story
            </a>
          </nav>
        </div>

        <div className="mx-3 my-2.5 shrink-0 border-t border-stone-100 dark:border-stone-800" />

        {/* Actions section */}
        <div className="px-3 pb-3">
          <p className="mb-2 px-1 text-[9px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">
            Account
          </p>

          {user ? (
            <Link
              onClick={() => setDrawerOpen(false)}
              to="/dashboard"
              className="flex w-full items-center justify-between rounded-xl bg-amber-500 px-4 py-3 text-xs font-bold text-white shadow-xs transition hover:bg-amber-600 active:scale-98"
            >
              <span>Open Dashboard</span>
              <span>→</span>
            </Link>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                onClick={() => setDrawerOpen(false)}
                to="/register"
                className="flex w-full items-center justify-center rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-amber-600 active:scale-98"
              >
                Get Started
              </Link>
              <Link
                onClick={() => setDrawerOpen(false)}
                to="/login"
                className="flex w-full items-center justify-center rounded-xl border border-stone-200 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 active:scale-98 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto border-t border-stone-100 px-3 py-2.5 dark:border-stone-800 shrink-0">
          <p className="text-center text-[10px] text-stone-400 dark:text-stone-500">
            Restora · Restaurant Management
          </p>
        </div>
      </aside>
    </header>
  )
}
