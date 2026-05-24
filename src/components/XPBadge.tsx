import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Props {
  xp: number;
}

export function XPBadge({ xp }: Props) {
  const [prev, setPrev] = useState(xp);
  const [showGain, setShowGain] = useState(false);

  useEffect(() => {
    if (xp > prev) {
      setShowGain(true);
      const t = setTimeout(() => setShowGain(false), 1200);
      setPrev(xp);
      return () => clearTimeout(t);
    }
  }, [xp, prev]);

  return (
    <div className="relative">
      <div className="flex items-center gap-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-3 py-1.5 rounded-full text-sm font-bold">
        ⚡ {xp} XP
      </div>
      <AnimatePresence>
        {showGain && (
          <motion.div
            className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold text-emerald-500 whitespace-nowrap pointer-events-none"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -24 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            +10 XP
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
