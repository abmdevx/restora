import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { ThemeToggle } from '../components/ThemeToggle'
import { useAuth } from '../hooks/useAuth'

// ── Nav links config ──────────────────────────────────────────────────────────
const ADMIN_NAV = [
  { to: '/dashboard', label: '🍽️ Tables', end: true },
  { to: '/orders', label: '📝 Orders' },
  { to: '/menu', label: '🍴 Menu' },
  { to: '/inventory', label: '📦 Inventory' },
  { to: '/reports', label: '📊 Reports' },
]

const CUSTOMER_NAV = [{ to: '/dashboard', label: '🪑 Reserve a Table', end: true }]

// ── SVG Icons ────────────────────────────────────────────────────────────────
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

function ShieldIcon({ className = 'w-5 h-5' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm-1.766 11.45 4.72-4.72a.75.75 0 1 1 1.06 1.06l-5.25 5.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 1 1 1.06-1.06l1.72 1.72Z"
      />
    </svg>
  )
}

function EyeIcon({ className = 'w-5 h-5' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

// ── Desktop NavLink ───────────────────────────────────────────────────────────
function DesktopNavLink({ to, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
          isActive
            ? 'bg-amber-500/10 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
            : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
        }`
      }
    >
      {label}
    </NavLink>
  )
}

// ── Drawer NavLink ────────────────────────────────────────────────────────────
function DrawerNavLink({ to, label, end, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
          isActive
            ? 'bg-amber-500/10 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 font-bold'
            : 'text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800'
        }`
      }
    >
      {label}
    </NavLink>
  )
}

// ── View Toggle Button (reused in header + drawer) ────────────────────────────
function ViewToggleButton({ previewCustomer, onToggle, isIconOnly = false }) {
  return (
    <button
      onClick={onToggle}
      title={previewCustomer ? 'Switch to Admin View' : 'Switch to Customer View'}
      aria-label={previewCustomer ? 'Switch to Admin View' : 'Switch to Customer View'}
      className={`flex items-center justify-center rounded-xl border transition active:scale-95 ${
        previewCustomer
          ? 'border-amber-400 bg-amber-500 text-white shadow-xs hover:bg-amber-600 dark:border-amber-500 dark:bg-amber-600'
          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700'
      } ${isIconOnly ? 'h-10 w-10 shadow-2xs' : 'gap-2 px-3 py-1.5 text-xs font-semibold'}`}
    >
      <span
        className={`flex items-center justify-center ${
          previewCustomer ? 'text-white' : 'text-amber-600 dark:text-amber-400'
        }`}
      >
        {previewCustomer ? <ShieldIcon /> : <EyeIcon />}
      </span>
      {!isIconOnly && (
        <span className="hidden md:inline">
          {previewCustomer ? 'Admin View' : 'Customer View'}
        </span>
      )}
    </button>
  )
}

// ── Main Layout ───────────────────────────────────────────────────────────────
export function DashboardLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const name = user?.name?.split(' ')[0] || 'there'
  const role = user?.role || 'customer'
  const isAdmin = role === 'admin'

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [previewCustomer, setPreviewCustomer] = useState(false)

  const togglePreview = () => setPreviewCustomer((v) => !v)

  const logout = async () => {
    await signOut()
    navigate('/', { replace: true })
  }

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
    <div className="min-h-screen bg-[#fcfaf6] text-stone-900 dark:bg-[#141210] dark:text-stone-100">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-stone-200 bg-white/95 px-3 backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/95 sm:h-20 sm:px-8">
        {/* Left: hamburger (mobile) + logo + desktop nav */}
        <div className="flex items-center gap-2 sm:gap-6">
          {/* Hamburger Button — mobile only */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-stone-700 transition hover:bg-stone-100 active:scale-95 dark:text-stone-300 dark:hover:bg-stone-800 sm:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
          >
            <HamburgerIcon open={false} />
          </button>

          <Logo />

          {/* Desktop nav — hidden on mobile */}
          <nav className="hidden items-center gap-1.5 sm:flex">
            {(isAdmin && !previewCustomer ? ADMIN_NAV : CUSTOMER_NAV).map((link) => (
              <DesktopNavLink key={link.to} {...link} />
            ))}
          </nav>
        </div>

        {/* Right: view toggle (admin only) + theme + user info + sign out */}
        <div className="flex items-center gap-2 sm:gap-4">
          {isAdmin && (
            <ViewToggleButton
              previewCustomer={previewCustomer}
              onToggle={togglePreview}
            />
          )}

          <ThemeToggle />

          {/* User info — desktop only */}
          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-sm text-stone-600 dark:text-stone-400">Hi, {name}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                role === 'admin'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
              }`}
            >
              {role}
            </span>
          </div>

          <button
            className="hidden text-xs font-bold text-amber-600 transition hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 sm:block"
            onClick={logout}
          >
            Sign out
          </button>
        </div>
      </header>

      {/* ── Mobile Drawer Backdrop ───────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300 sm:hidden ${
          drawerOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* ── Mobile Drawer Panel ──────────────────────────────────────────────── */}
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

        {/* User info pill */}
        <div className="mx-3 mt-3 shrink-0 flex items-center gap-2.5 rounded-xl bg-amber-50 px-3 py-2 dark:bg-amber-950/20">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-stone-900 dark:text-stone-100">
              {user?.name || 'Guest'}
            </p>
            <span
              className={`inline-block rounded-full px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider ${
                role === 'admin'
                  ? 'bg-amber-200 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                  : 'bg-stone-200 text-stone-600 dark:bg-stone-700 dark:text-stone-400'
              }`}
            >
              {role}
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="mt-3 px-3">
          <p className="mb-1 px-1 text-[9px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">
            Navigation
          </p>
          <nav className="flex flex-col gap-0.5">
            {(isAdmin && !previewCustomer ? ADMIN_NAV : CUSTOMER_NAV).map((link) => (
              <DrawerNavLink
                key={link.to}
                {...link}
                onClick={() => setDrawerOpen(false)}
              />
            ))}
          </nav>
        </div>

        <div className="mx-3 my-2.5 shrink-0 border-t border-stone-100 dark:border-stone-800" />

        {/* Account & Settings Icons Row */}
        <div className="px-3 pb-3">
          <p className="mb-2 px-1 text-[9px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">
            Account & Settings
          </p>
          <div className="flex items-center justify-around gap-2 rounded-2xl border border-stone-100 bg-stone-50/70 p-2 dark:border-stone-800 dark:bg-stone-800/40">
            {/* View Toggle Icon Button (Clean SVG) */}
            {isAdmin && (
              <ViewToggleButton
                previewCustomer={previewCustomer}
                onToggle={() => {
                  togglePreview()
                  setDrawerOpen(false)
                }}
                isIconOnly
              />
            )}

            {/* Sun / Moon Theme Toggle Icon Button (Clean SVG) */}
            <ThemeToggle showLabel={false} />

            {/* Logout Icon Button (Clean SVG) */}
            <button
              type="button"
              onClick={() => {
                setDrawerOpen(false)
                logout()
              }}
              title="Sign Out"
              aria-label="Sign Out"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 shadow-2xs transition hover:bg-rose-100 active:scale-95 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/50"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto border-t border-stone-100 px-3 py-2.5 dark:border-stone-800 shrink-0">
          <p className="text-center text-[10px] text-stone-400 dark:text-stone-500">
            Restora · Restaurant Management
          </p>
        </div>
      </aside>

      {/* ── Page Content ────────────────────────────────────────────────────── */}
      <Outlet context={{ previewCustomer }} />
    </div>
  )
}
