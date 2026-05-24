import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

interface Props {
  front: string;
  back: string;
  color?: string;
}

export function Flashcard({ front, back, color = '#7C3AED' }: Props) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="flip-card cursor-pointer select-none"
      style={{ height: 180, perspective: 1000 }}
      onClick={() => setFlipped(f => !f)}
    >
      <div className={`flip-card-inner ${flipped ? 'flipped' : ''}`} style={{ height: 180 }}>
        {/* Front */}
        <div
          className="flip-card-front rounded-2xl flex flex-col items-center justify-center p-6 shadow-md"
          style={{ background: color + '18', border: `2px solid ${color}40` }}
        >
          <p className="text-gray-700 dark:text-gray-200 font-semibold text-center leading-snug text-base">
            {front}
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs text-gray-400">
            <RotateCcw size={12} />
            Klicka för att vända
          </div>
        </div>
        {/* Back */}
        <div
          className="flip-card-back rounded-2xl flex flex-col items-center justify-center p-6 shadow-md"
          style={{ background: color + '28', border: `2px solid ${color}60` }}
        >
          <p className="text-gray-800 dark:text-gray-100 text-center leading-relaxed text-sm">
            {back}
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs text-gray-400">
            <RotateCcw size={12} />
            Klicka för att vända
          </div>
        </div>
      </div>
    </div>
  );
}

export function FlashcardDeck({
  cards,
  color,
}: {
  cards: { front: string; back: string }[];
  color?: string;
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = (dir: number) => {
    setDirection(dir);
    setIndex(i => (i + dir + cards.length) % cards.length);
  };

  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -direction * 40 }}
          transition={{ duration: 0.25 }}
        >
          <Flashcard front={cards[index].front} back={cards[index].back} color={color} />
        </motion.div>
      </AnimatePresence>
      <div className="flex items-center justify-between">
        <button
          onClick={() => go(-1)}
          className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          ← Föregående
        </button>
        <span className="text-xs text-gray-400">
          {index + 1} / {cards.length}
        </span>
        <button
          onClick={() => go(1)}
          className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Nästa →
        </button>
      </div>
    </div>
  );
}
