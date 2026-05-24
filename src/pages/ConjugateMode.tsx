import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowRight, RotateCcw, Filter, Trophy } from 'lucide-react';
import { CONJUGATE_SENTENCES } from '../data/sentences';
import type { ConjugateSentence } from '../data/sentences';
import { useProgress } from '../hooks/useProgress';

type Mode = 'setup' | 'playing' | 'result';
type InputMode = 'type' | 'choice';
type Category = ConjugateSentence['category'] | 'all';

const CATEGORY_LABELS: Record<Category, string> = {
  all: '🔀 Alla',
  tempus: '⏰ Tempus',
  komparation: '📊 Komparation',
  'var-vart': '📍 Var/Vart',
  'de-dem': '👥 De/Dem',
  'sin-hans': '🔄 Sin/Hans',
  kongruens: '🎨 Kongruens',
  supinum: '⚠️ Supinum',
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getQueue(category: Category): ConjugateSentence[] {
  const pool = category === 'all' ? CONJUGATE_SENTENCES : CONJUGATE_SENTENCES.filter(s => s.category === category);
  return shuffle(pool);
}

function vibrate(pattern: number | number[]) {
  if ('vibrate' in navigator) { try { navigator.vibrate(pattern); } catch {} }
}

export function ConjugateMode({ muted }: { muted: boolean }) {
  const { addXP, recordStudy, updateConjugateHighScore } = useProgress();

  const [mode, setMode] = useState<Mode>('setup');
  const [category, setCategory] = useState<Category>('all');
  const [inputMode, setInputMode] = useState<InputMode>('choice');
  const [queue, setQueue] = useState<ConjugateSentence[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [answerState, setAnswerState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const answerAreaRef = useRef<HTMLDivElement>(null);
  const current = queue[qIndex];

  // Scroll input into view when keyboard opens on iOS
  const handleInputFocus = () => {
    setTimeout(() => {
      answerAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 350);
  };

  // Auto-focus input when question changes in type mode
  useEffect(() => {
    if (mode === 'playing' && inputMode === 'type' && !showExplanation) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [qIndex, mode, inputMode, showExplanation]);

  const playSound = useCallback((correct: boolean) => {
    if (muted) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g); g.connect(ctx.destination);
      osc.frequency.value = correct ? 880 : 220;
      osc.type = correct ? 'sine' : 'sawtooth';
      g.gain.setValueAtTime(0.12, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(); osc.stop(ctx.currentTime + 0.3);
    } catch {}
  }, [muted]);

  const checkAnswer = useCallback((answer: string) => {
    if (!current || answerState !== 'idle') return;
    const correct = answer.trim().toLowerCase() === current.answer.toLowerCase();
    setAnswerState(correct ? 'correct' : 'wrong');
    setShowExplanation(true);
    setTotalAnswered(n => n + 1);
    playSound(correct);
    recordStudy();
    vibrate(correct ? 10 : [40, 30, 40]);
    if (correct) {
      setScore(s => s + 15);
      setTotalCorrect(n => n + 1);
      addXP(15);
    }
  }, [current, answerState, addXP, recordStudy, playSound]);

  const next = () => {
    if (qIndex + 1 >= queue.length) {
      updateConjugateHighScore(score);
      setMode('result');
    } else {
      setQIndex(i => i + 1);
      setTypedAnswer('');
      setAnswerState('idle');
      setShowExplanation(false);
    }
  };

  const startGame = () => {
    setQueue(getQueue(category));
    setQIndex(0);
    setTypedAnswer('');
    setAnswerState('idle');
    setShowExplanation(false);
    setScore(0);
    setTotalAnswered(0);
    setTotalCorrect(0);
    setMode('playing');
  };

  const renderBlank = (sentence: string, answer: string, state: typeof answerState) => {
    const parts = sentence.split('___');
    return (
      <span>
        {parts[0]}
        <span className={`font-bold px-2 py-0.5 rounded-lg mx-1 ${
          state === 'correct' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
          : state === 'wrong' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
          : 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
        }`}>
          {state !== 'idle' ? answer : '___'}
        </span>
        {parts[1]}
      </span>
    );
  };

  // ── Setup ───────────────────────────────────────────────────────
  if (mode === 'setup') {
    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto pb-nav md:pb-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 mt-4">✏️ Böj rätt</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Fyll i luckan — tempus, komparation och vanliga fällor.</p>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
            <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2 text-sm">
              <Filter size={15} /> Kategori
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(CATEGORY_LABELS) as Category[]).map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-3 px-3 rounded-xl text-sm font-semibold border-2 text-left min-h-[48px] ${
                    category === cat
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
            <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 text-sm">Svarsläge</h2>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setInputMode('choice')}
                className={`py-3.5 rounded-xl text-sm font-semibold border-2 min-h-[48px] ${inputMode === 'choice' ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}
              >
                🔘 Välj alternativ
              </button>
              <button
                onClick={() => setInputMode('type')}
                className={`py-3.5 rounded-xl text-sm font-semibold border-2 min-h-[48px] ${inputMode === 'type' ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}
              >
                ⌨️ Skriv svar
              </button>
            </div>
          </div>

          <motion.button
            onClick={startGame}
            className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold text-lg shadow-lg min-h-[56px]"
            whileTap={{ scale: 0.97 }}
          >
            Börja öva! ✏️
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ── Result ──────────────────────────────────────────────────────
  if (mode === 'result') {
    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto pb-nav md:pb-8">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center pt-8">
          <div className="text-6xl mb-3">{accuracy >= 80 ? '🏆' : accuracy >= 60 ? '⭐' : '📚'}</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {accuracy >= 80 ? 'Utmärkt!' : accuracy >= 60 ? 'Bra jobbat!' : 'Öva mer!'}
          </h1>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { val: score, label: 'poäng', color: 'text-emerald-600' },
              { val: `${accuracy}%`, label: 'rätt', color: 'text-violet-600' },
              { val: totalAnswered, label: 'frågor', color: 'text-blue-600' },
            ].map(({ val, label, color }) => (
              <div key={label} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <p className={`text-2xl font-bold ${color}`}>{val}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={startGame} className="flex-1 py-4 rounded-2xl bg-emerald-600 text-white font-semibold flex items-center justify-center gap-2 min-h-[52px]">
              <RotateCcw size={16} /> Igen
            </button>
            <button onClick={() => setMode('setup')} className="flex-1 py-4 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold min-h-[52px]">
              Inställningar
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Playing ─────────────────────────────────────────────────────
  if (!current) return null;

  return (
    <div className="flex flex-col practice-scroll md:block md:max-w-lg md:mx-auto" style={{ minHeight: '100dvh' }}>
      {/* Progress bar (sticky top) */}
      <div
        className="flex-none header-glass border-b border-gray-200/60 dark:border-gray-800/60 px-4 py-3"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400 font-medium">{qIndex + 1} / {queue.length}</span>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
              {score} p
            </span>
            <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-full text-xs">
              {CATEGORY_LABELS[current.category]}
            </span>
          </div>
        </div>
        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500 rounded-full"
            animate={{ width: `${((qIndex + 1) / queue.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="flex-1 px-4 py-5 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-5"
          >
            <p className="text-xs text-gray-400 mb-2 font-medium">Fyll i rätt form:</p>
            <p className="text-lg font-medium text-gray-800 dark:text-gray-100 leading-relaxed mb-2">
              {renderBlank(current.sentence, answerState !== 'idle' ? current.answer : '___', answerState)}
            </p>
            {current.hint && (
              <p className="text-xs text-gray-400 mt-2">
                💡 <span className="text-violet-500">{current.hint}</span>
              </p>
            )}

            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"
                >
                  <div className={`rounded-xl p-3 text-sm flex gap-2 items-start ${
                    answerState === 'correct'
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                  }`}>
                    {answerState === 'correct'
                      ? <Check size={16} className="text-emerald-600 mt-0.5 flex-none" />
                      : <X size={16} className="text-red-600 mt-0.5 flex-none" />
                    }
                    <div>
                      {answerState === 'wrong' && (
                        <p className="font-semibold text-red-700 dark:text-red-400 mb-1">
                          Rätt: <span className="font-bold">{current.answer}</span>
                        </p>
                      )}
                      <p className="text-gray-600 dark:text-gray-400 leading-snug">{current.explanation}</p>
                    </div>
                  </div>
                  <button
                    onClick={next}
                    className="mt-3 w-full py-3.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm flex items-center justify-center gap-2 min-h-[48px]"
                  >
                    {qIndex + 1 < queue.length
                      ? <><ArrowRight size={16} /> Nästa fråga</>
                      : <><Trophy size={16} /> Se resultat</>
                    }
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* ── Answer input area ─────────────────────────────── */}
        {!showExplanation && (
          <div ref={answerAreaRef}>
            {inputMode === 'choice' && current.alternatives ? (
              <div className="grid grid-cols-1 gap-2.5">
                {current.alternatives.map(alt => (
                  <motion.button
                    key={alt}
                    onClick={() => checkAnswer(alt)}
                    className="py-4 px-5 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-base text-left shadow-sm min-h-[56px]"
                    whileTap={{ scale: 0.98 }}
                  >
                    {alt}
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={typedAnswer}
                  onChange={e => setTypedAnswer(e.target.value)}
                  onFocus={handleInputFocus}
                  onKeyDown={e => e.key === 'Enter' && typedAnswer.trim() && checkAnswer(typedAnswer)}
                  placeholder="Skriv ditt svar..."
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  className="flex-1 px-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium focus:border-emerald-400 focus:outline-none transition-colors"
                  style={{ fontSize: '16px' }}
                />
                <button
                  onClick={() => typedAnswer.trim() && checkAnswer(typedAnswer)}
                  disabled={!typedAnswer.trim()}
                  className="px-5 py-4 rounded-2xl bg-emerald-600 text-white font-semibold disabled:opacity-40 min-w-[64px] min-h-[56px]"
                >
                  OK
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Safe area spacer for bottom nav */}
      <div className="flex-none" style={{ height: 'calc(64px + env(safe-area-inset-bottom, 0px))' }} />
    </div>
  );
}
