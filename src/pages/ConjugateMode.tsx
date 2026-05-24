import { useState, useCallback } from 'react';
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
  const pool = category === 'all'
    ? CONJUGATE_SENTENCES
    : CONJUGATE_SENTENCES.filter(s => s.category === category);
  return shuffle(pool);
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

  const current = queue[qIndex];

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

  const renderSentenceWithBlank = (sentence: string, answer: string, state: typeof answerState) => {
    const parts = sentence.split('___');
    return (
      <span>
        {parts[0]}
        <span
          className={`font-bold px-2 py-0.5 rounded mx-1 ${
            state === 'correct'
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
              : state === 'wrong'
              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              : 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
          }`}
        >
          {state !== 'idle' ? answer : '___'}
        </span>
        {parts[1]}
      </span>
    );
  };

  if (mode === 'setup') {
    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto pb-24 md:pb-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">✏️ Böj rätt</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
            Fyll i luckan — tempus, komparation och vanliga fällor.
          </p>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
            <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Filter size={16} /> Kategori
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(CATEGORY_LABELS) as Category[]).map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-2.5 px-3 rounded-xl text-sm font-semibold transition-all border-2 text-left ${
                    category === cat
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-emerald-300'
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
            <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Svarsläge</h2>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setInputMode('choice')}
                className={`py-3 rounded-xl text-sm font-semibold transition-all border-2 ${
                  inputMode === 'choice'
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                }`}
              >
                🔘 Välj alternativ
              </button>
              <button
                onClick={() => setInputMode('type')}
                className={`py-3 rounded-xl text-sm font-semibold transition-all border-2 ${
                  inputMode === 'type'
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                }`}
              >
                ⌨️ Skriv svar
              </button>
            </div>
          </div>

          <motion.button
            onClick={startGame}
            className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold text-lg shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 hover:bg-emerald-700 transition-colors"
            whileTap={{ scale: 0.97 }}
          >
            Börja öva! ✏️
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (mode === 'result') {
    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto pb-24 md:pb-8">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="text-5xl mb-3">{accuracy >= 80 ? '🏆' : accuracy >= 60 ? '⭐' : '📚'}</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {accuracy >= 80 ? 'Utmärkt!' : accuracy >= 60 ? 'Bra jobbat!' : 'Öva mer!'}
          </h1>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <p className="text-2xl font-bold text-emerald-600">{score}</p>
              <p className="text-xs text-gray-400">poäng</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <p className="text-2xl font-bold text-violet-600">{accuracy}%</p>
              <p className="text-xs text-gray-400">rätt</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <p className="text-2xl font-bold text-blue-600">{totalAnswered}</p>
              <p className="text-xs text-gray-400">frågor</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={startGame}
              className="flex-1 py-3 rounded-2xl bg-emerald-600 text-white font-semibold flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} /> Igen
            </button>
            <button
              onClick={() => setMode('setup')}
              className="flex-1 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold"
            >
              Inställningar
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="p-4 md:p-8 max-w-lg mx-auto pb-24 md:pb-8">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-gray-400">{qIndex + 1} / {queue.length}</span>
        <div className="flex items-center gap-2">
          <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
            {score} poäng
          </span>
          <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-full text-xs">
            {CATEGORY_LABELS[current.category]}
          </span>
        </div>
      </div>
      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-5">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all"
          style={{ width: `${((qIndex + 1) / queue.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-5"
        >
          <p className="text-xs text-gray-400 mb-2">Fyll i rätt form:</p>
          <p className="text-lg font-medium text-gray-800 dark:text-gray-100 leading-relaxed mb-1">
            {renderSentenceWithBlank(
              current.sentence,
              answerState !== 'idle' ? current.answer : '___',
              answerState,
            )}
          </p>
          {current.hint && (
            <p className="text-xs text-gray-400 mt-2">
              💡 Ledtråd: <span className="text-violet-500">{current.hint}</span>
            </p>
          )}

          {/* Explanation */}
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
                        Rätt svar: <span className="font-bold">{current.answer}</span>
                      </p>
                    )}
                    <p className="text-gray-600 dark:text-gray-400">{current.explanation}</p>
                  </div>
                </div>
                <button
                  onClick={next}
                  className="mt-3 w-full py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {qIndex + 1 < queue.length ? (
                    <><ArrowRight size={16} /> Nästa fråga</>
                  ) : (
                    <><Trophy size={16} /> Se resultat</>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Answer input */}
      {!showExplanation && (
        <>
          {inputMode === 'choice' && current.alternatives ? (
            <div className="grid grid-cols-1 gap-2">
              {current.alternatives.map(alt => (
                <motion.button
                  key={alt}
                  onClick={() => checkAnswer(alt)}
                  className="py-3 px-4 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:border-emerald-400 hover:-translate-y-0.5 transition-all text-left shadow-sm"
                  whileTap={{ scale: 0.98 }}
                >
                  {alt}
                </motion.button>
              ))}
            </div>
          ) : (
            <form
              onSubmit={e => {
                e.preventDefault();
                if (typedAnswer.trim()) checkAnswer(typedAnswer);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={typedAnswer}
                onChange={e => setTypedAnswer(e.target.value)}
                placeholder="Skriv ditt svar..."
                autoFocus
                className="flex-1 px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-medium focus:border-emerald-400 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!typedAnswer.trim()}
                className="px-5 py-3 rounded-2xl bg-emerald-600 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors"
              >
                OK
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
