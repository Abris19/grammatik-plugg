import { motion } from 'framer-motion';
import { WORD_CLASS_COLORS, WORD_CLASS_EMOJIS } from '../data/grammar';
import type { WordClass } from '../data/grammar';

interface Props {
  wordClass: WordClass;
  label: string;
  onClick: () => void;
  state?: 'default' | 'correct' | 'wrong' | 'disabled';
  size?: 'sm' | 'md' | 'lg';
}

const STATE_CLASSES = {
  default: 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-violet-400 hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
  correct: 'bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-400 text-emerald-700 dark:text-emerald-300',
  wrong: 'bg-red-50 dark:bg-red-900/30 border-2 border-red-400 text-red-700 dark:text-red-300',
  disabled: 'bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed opacity-60',
};

const SIZE_CLASSES = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-4 py-3 text-sm',
  lg: 'px-5 py-4 text-base',
};

export function WordClassButton({ wordClass, label, onClick, state = 'default', size = 'md' }: Props) {
  const color = WORD_CLASS_COLORS[wordClass];
  const emoji = WORD_CLASS_EMOJIS[wordClass];

  return (
    <motion.button
      onClick={state === 'disabled' ? undefined : onClick}
      className={`
        ${STATE_CLASSES[state]}
        ${SIZE_CLASSES[size]}
        rounded-2xl font-semibold transition-all duration-200
        flex items-center justify-center gap-2 shadow-sm
        select-none w-full
      `}
      style={state === 'default' ? { '--accent': color } as React.CSSProperties : undefined}
      whileTap={state !== 'disabled' ? { scale: 0.95 } : undefined}
      animate={
        state === 'correct'
          ? { scale: [1, 1.05, 1] }
          : state === 'wrong'
          ? { x: [0, -6, 6, -4, 4, 0] }
          : {}
      }
      transition={{ duration: 0.4 }}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </motion.button>
  );
}
