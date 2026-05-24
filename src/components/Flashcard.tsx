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
      className="cursor-pointer select-none w-full"
      style={{ height: 220, perspective: 1200 }}
      onClick={() => setFlipped(f => !f)}
    >
      <div className={`flip-card-inner ${flipped ? 'flipped' : ''}`} style={{ height: 220 }}>
        {/* Front */}
        <div
          className="flip-card-front rounded-2xl flex flex-col items-center justify-center p-6 shadow-sm will-change-transform"
          style={{ background: color + '15', border: `2px solid ${color}35` }}
        >
          <p className="text-gray-700 dark:text-gray-200 font-semibold text-center leading-snug text-base">
            {front}
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-400">
            <RotateCcw size={11} />
            Tryck för att vända
          </div>
        </div>
        {/* Back */}
        <div
          className="flip-card-back rounded-2xl flex flex-col items-center justify-center p-6 shadow-sm will-change-transform"
          style={{ background: color + '25', border: `2px solid ${color}55` }}
        >
          <p className="text-gray-800 dark:text-gray-100 text-center leading-relaxed text-sm">
            {back}
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-400">
            <RotateCcw size={11} />
            Tryck för att vända
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
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1 mb-1">
        {cards.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all"
            style={{
              width: i === index ? 16 : 6,
              height: 6,
              background: i === index ? color : '#e5e7eb',
            }}
          />
        ))}
      </div>

      {/* Swipeable card */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.25}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) go(1);
            else if (info.offset.x > 60) go(-1);
          }}
          initial={{ opacity: 0, x: direction * 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -direction * 50 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{ cursor: 'grab', willChange: 'transform' }}
          whileDrag={{ cursor: 'grabbing' }}
        >
          <Flashcard front={cards[index].front} back={cards[index].back} color={color} />
        </motion.div>
      </AnimatePresence>

      {/* Nav buttons */}
      <div className="flex items-center justify-between mt-1">
        <button
          onClick={() => go(-1)}
          className="px-5 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-semibold min-h-[44px] min-w-[100px]"
        >
          ← Föregående
        </button>
        <span className="text-xs text-gray-400 font-medium">
          {index + 1} / {cards.length}
        </span>
        <button
          onClick={() => go(1)}
          className="px-5 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-semibold min-h-[44px] min-w-[100px]"
        >
          Nästa →
        </button>
      </div>
    </div>
  );
}
