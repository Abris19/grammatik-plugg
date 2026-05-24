import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = ['#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899'];

interface Particle {
  id: number;
  x: number;
  color: string;
  rotation: number;
  size: number;
}

interface Props {
  active: boolean;
}

export function Confetti({ active }: Props) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) return;
    const ps: Particle[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      size: 6 + Math.random() * 8,
    }));
    setParticles(ps);
    const t = setTimeout(() => setParticles([]), 2500);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute top-0 rounded-sm"
            style={{
              left: `${p.x}%`,
              width: p.size,
              height: p.size * 0.6,
              background: p.color,
              rotate: p.rotation,
            }}
            initial={{ y: -20, opacity: 1 }}
            animate={{ y: '110vh', opacity: [1, 1, 0], rotate: p.rotation + 720 }}
            transition={{ duration: 2 + Math.random(), ease: 'easeIn' }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
