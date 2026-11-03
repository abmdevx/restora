import { useTheme } from '../hooks/useTheme'

function SunIcon({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export function ThemeToggle({ showLabel = true }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white/80 text-stone-600 shadow-2xs transition hover:border-amber-500 hover:text-amber-600 active:scale-95 dark:border-stone-700 dark:bg-stone-800/80 dark:text-stone-300 dark:hover:border-amber-400 dark:hover:text-amber-400 ${
        showLabel ? 'gap-2 px-3 py-1.5 text-xs' : 'h-10 w-10 text-base'
      }`}
      type="button"
      onClick={toggleTheme}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className="text-amber-500 dark:text-amber-400" aria-hidden="true">
        {isDark ? <SunIcon /> : <MoonIcon />}
      </span>
      {showLabel && (
        <span className="hidden sm:inline font-medium">{isDark ? 'Light' : 'Dark'}</span>
      )}
    </button>
  )
}
