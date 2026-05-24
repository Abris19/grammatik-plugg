import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Target, BarChart2, Moon, Sun, Volume2, VolumeX } from 'lucide-react';
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
  { to: '/boj-ratt', label: 'Böj rätt', icon: BookOpen },
  { to: '/framsteg', label: 'Framsteg', icon: BarChart2 },
];

export function Navigation({ darkMode, onToggleDark, muted, onToggleMute }: Props) {
  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 h-full w-60 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40 shadow-sm">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <h1 className="text-xl font-bold text-violet-600 dark:text-violet-400 tracking-tight">
            Svenska Grammatik
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Ordklasser & böjning</p>
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

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40 safe-area-pb">
        <div className="flex items-center justify-around px-2 py-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'text-violet-600 dark:text-violet-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <motion.div
                    animate={{ scale: isActive ? 1.15 : 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <Icon size={20} />
                  </motion.div>
                  <span className="text-[10px]">{label}</span>
                </>
              )}
            </NavLink>
          ))}
          <button
            onClick={onToggleDark}
            className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-xs text-gray-400"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span className="text-[10px]">Tema</span>
          </button>
        </div>
      </nav>
    </>
  );
}
