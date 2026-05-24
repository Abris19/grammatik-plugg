import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, Target, BarChart2, Moon, Sun, Volume2, VolumeX, PenLine } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  muted: boolean;
  onToggleMute: () => void;
}

const NAV_ITEMS = [
  { to: '/', label: 'Hem', icon: Home },
  { to: '/lar-dig', label: 'Lär dig', icon: BookOpen },
  { to: '/ordklass-jakten', label: 'Jakten', icon: Target },
  { to: '/boj-ratt', label: 'Böj rätt', icon: PenLine },
  { to: '/framsteg', label: 'Framsteg', icon: BarChart2 },
];

export function Navigation({ darkMode, onToggleDark, muted, onToggleMute }: Props) {
  const location = useLocation();

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────── */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 h-full w-60 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40 shadow-sm">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <h1 className="text-xl font-bold text-violet-600 dark:text-violet-400 tracking-tight">
            Svenska Grammatik
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Ordklasser &amp; böjning</p>
        </div>

        <div className="flex flex-col gap-1 p-3 flex-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </div>

        <div className="p-3 border-t border-gray-100 dark:border-gray-800 flex gap-2">
          <button
            onClick={onToggleDark}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
            {darkMode ? 'Ljust' : 'Mörkt'}
          </button>
          <button
            onClick={onToggleMute}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            {muted ? 'Ljud av' : 'Ljud på'}
          </button>
        </div>
      </nav>

      {/* ── Mobile bottom tab bar ────────────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-900/90 border-t border-gray-200 dark:border-gray-800"
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <div className="flex items-stretch justify-around h-16">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const isActive = to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(to);
            return (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className="flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 relative"
                style={{ touchAction: 'manipulation' }}
              >
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-violet-500"
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
                <motion.div
                  animate={{ scale: isActive ? 1.1 : 1, y: isActive ? -1 : 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={isActive ? 'text-violet-600 dark:text-violet-400' : 'text-gray-400 dark:text-gray-500'}
                >
                  <Icon size={22} />
                </motion.div>
                <span
                  className={`text-[10px] font-medium leading-none truncate px-1 ${
                    isActive ? 'text-violet-600 dark:text-violet-400' : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {label}
                </span>
              </NavLink>
            );
          })}

          {/* Settings button */}
          <button
            onClick={onToggleDark}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 text-gray-400 dark:text-gray-500"
            style={{ touchAction: 'manipulation' }}
            aria-label="Byt tema"
          >
            <div className="w-[22px] h-[22px] flex items-center justify-center">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </div>
            <span className="text-[10px] font-medium">Tema</span>
          </button>
        </div>
      </nav>
    </>
  );
}
