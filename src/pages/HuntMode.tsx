import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Zap, Trophy, ArrowRight, RotateCcw, Settings } from 'lucide-react';
import { HUNT_SENTENCES } from '../data/sentences';
import { ALL_WORD_CLASSES, WORD_CLASS_COLORS, WORD_CLASS_EMOJIS } from '../data/grammar';
import type { WordClass } from '../data/grammar';
import type { HuntSentence } from '../data/sentences';
import { Confetti } from '../components/Confetti';
import { useProgress } from '../hooks/useProgress';

type Difficulty = 'easy' | 'medium' | 'hard';
type Mode = 'setup' | 'playing' | 'result';
type AnswerState = 'idle' | 'correct' | 'wrong';

const EASY_CLASSES: WordClass[] = ['substantiv', 'verb', 'adjektiv', 'adverb'];

const SWEDISH_NAMES: Record<WordClass, string> = {
  substantiv: 'Substantiv',
  verb: 'Verb',
  adjektiv: 'Adjektiv',
  adverb: 'Adverb',
  pronomen: 'Pronomen',
  preposition: 'Preposition',
  konjunktion: 'Konjunktion',
  subjunktion: 'Subjunktion',
  interjektion: 'Interjektion',
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getQueue(difficulty: Difficulty): HuntSentence[] {
  let pool = [...HUNT_SENTENCES];
  if (difficulty === 'easy') pool = pool.filter(s => s.difficulty !== 'hard');
  if (difficulty === 'hard') pool = pool.filter(s => s.difficulty !== 'easy');
  return shuffle(pool);
}

function vibrate(pattern: number | number[]) {
  if ('vibrate' in navigator) {
    try { navigator.vibrate(pattern); } catch {}
  }
}

export function HuntMode({ muted }: { muted: boolean }) {
  const { recordAnswer, updateHuntHighScore } = useProgress();

  const [mode, setMode] = useState<Mode>('setup');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [timerMode, setTimerMode] = useState(false);
  const [queue, setQueue] = useState<HuntSentence[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [lastCorrectClass, setLastCorrectClass] = useState<WordClass | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [confetti, setConfetti] = useState(false);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [flashColor, setFlashColor] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeClasses = difficulty === 'easy' ? EASY_CLASSES : ALL_WORD_CLASSES;
  const current = queue[qIndex];

  const endGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    updateHuntHighScore(score);
    setMode('result');
  }, [score, updateHuntHighScore]);

  useEffect(() => {
    if (!timerMode || mode !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { endGame(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerMode, mode, endGame]);

  const playSound = useCallback((correct: boolean) => {
    if (muted) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = correct ? 880 : 220;
      osc.type = correct ? 'sine' : 'sawtooth';
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(); osc.stop(ctx.currentTime + 0.3);
    } catch {}
  }, [muted]);

  const handleAnswer = (chosen: WordClass) => {
    if (answerState !== 'idle' || !current) return;
    const correct = chosen === current.correctClass;
    setAnswerState(correct ? 'correct' : 'wrong');
    setLastCorrectClass(current.correctClass);
    setTotalAnswered(n => n + 1);
    recordAnswer(current.correctClass, correct);
    playSound(correct);

    // Screen flash
    setFlashColor(correct ? '#10B981' : '#EF4444');
    setTimeout(() => setFlashColor(null), 350);

    if (correct) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setScore(s => s + (newCombo >= 3 ? 20 : 10));
      setTotalCorrect(n => n + 1);
      if (newCombo === 10) { setConfetti(true); vibrate([20, 50, 20, 50, 20]); }
      else vibrate(10);
      setTimeout(next, 550);
    } else {
      setCombo(0);
      setShowExplanation(true);
      vibrate([40, 30, 40]);
    }
  };

  const next = () => {
    setAnswerState('idle');
    setShowExplanation(false);
    if (qIndex + 1 >= queue.length) {
      if (!timerMode) endGame();
    } else {
      setQIndex(i => i + 1);
    }
  };

  const startGame = () => {
    setQueue(getQueue(difficulty));
    setQIndex(0);
    setScore(0);
    setCombo(0);
    setAnswerState('idle');
    setShowExplanation(false);
    setTimeLeft(60);
    setTotalAnswered(0);
    setTotalCorrect(0);
    setFlashColor(null);
    setConfetti(false);
    setMode('playing');
  };

  const sentenceTokens = current
    ? current.sentence.split(' ').map((word, i) => ({
        word: word.replace(/[.,!?]$/, ''),
        punct: word.match(/[.,!?]$/)?.[0] ?? '',
        isTarget: i === current.wordIndex,
      }))
    : [];

  // ── Setup screen ────────────────────────────────────────────────
  if (mode === 'setup') {
    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto pb-nav md:pb-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 mt-4">
            🎯 Ordklass-jakten
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
            Identifiera ordklassen för det markerade ordet.
          </p>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
            <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2 text-sm">
              <Settings size={15} /> Svårighetsgrad
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`py-3.5 rounded-xl text-sm font-semibold transition-all border-2 min-h-[48px] ${
                    difficulty === d
                      ? 'bg-violet-600 border-violet-600 text-white'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {d === 'easy' ? '😊 Lätt' : d === 'medium' ? '🤔 Medel' : '🔥 Svår'}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {difficulty === 'easy' ? '4 alternativ (substantiv, verb, adjektiv, adverb)' : difficulty === 'medium' ? 'Alla 9 ordklasser' : 'Alla 9 + trixiga ord'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
            <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2 text-sm">
              <Timer size={15} /> Läge
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTimerMode(false)}
                className={`py-3.5 rounded-xl text-sm font-semibold border-2 min-h-[48px] ${!timerMode ? 'bg-violet-600 border-violet-600 text-white' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}
              >
                📚 Lugn öving
              </button>
              <button
                onClick={() => setTimerMode(true)}
                className={`py-3.5 rounded-xl text-sm font-semibold border-2 min-h-[48px] ${timerMode ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}
              >
                ⏱️ Timer (60s)
              </button>
            </div>
          </div>

          <motion.button
            onClick={startGame}
            className="w-full py-4 rounded-2xl bg-violet-600 text-white font-bold text-lg shadow-lg shadow-violet-200 dark:shadow-violet-900/30 min-h-[56px]"
            whileTap={{ scale: 0.97 }}
          >
            Starta jakten! 🚀
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ── Result screen ────────────────────────────────────────────────
  if (mode === 'result') {
    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto pb-nav md:pb-8">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full pt-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">{accuracy >= 80 ? '🏆' : accuracy >= 60 ? '⭐' : '📚'}</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {accuracy >= 80 ? 'Fantastiskt!' : accuracy >= 60 ? 'Bra jobbat!' : 'Fortsätt öva!'}
            </h1>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { val: score, label: 'poäng', color: 'text-violet-600' },
              { val: `${accuracy}%`, label: 'rätt', color: 'text-emerald-600' },
              { val: totalAnswered, label: 'frågor', color: 'text-blue-600' },
            ].map(({ val, label, color }) => (
              <div key={label} className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700">
                <p className={`text-2xl font-bold ${color}`}>{val}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <motion.button onClick={startGame} className="flex-1 py-4 rounded-2xl bg-violet-600 text-white font-semibold flex items-center justify-center gap-2 min-h-[52px]" whileTap={{ scale: 0.97 }}>
              <RotateCcw size={16} /> Spela igen
            </motion.button>
            <motion.button onClick={() => setMode('setup')} className="flex-1 py-4 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold min-h-[52px]" whileTap={{ scale: 0.97 }}>
              Inställningar
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Playing screen ───────────────────────────────────────────────
  if (!current) return null;

  return (
    <div
      className="flex flex-col practice-scroll md:block md:max-w-lg md:mx-auto md:p-8 md:pb-8"
      style={{ height: '100dvh' }}
    >
      <Confetti active={confetti} />

      {/* Screen flash overlay */}
      <AnimatePresence>
        {flashColor && (
          <motion.div
            className="screen-flash"
            style={{ backgroundColor: flashColor }}
            initial={{ opacity: 0.35 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      {/* ── Status bar ─────────────────────────────────── */}
      <div
        className="flex-none flex items-center justify-between px-4 py-3 header-glass border-b border-gray-200/60 dark:border-gray-800/60"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-3 py-1.5 rounded-full text-sm font-bold">
            <Zap size={13} /> {score}
          </div>
          <AnimatePresence>
            {combo >= 2 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 px-2.5 py-1 rounded-full text-xs font-bold"
              >
                🔥 {combo}x
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-2">
          {timerMode && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${timeLeft <= 10 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
              <Timer size={13} /> {timeLeft}s
            </div>
          )}
          {!timerMode && (
            <span className="text-xs text-gray-400 font-medium">{qIndex + 1}/{queue.length}</span>
          )}
          <button
            onClick={endGame}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Trophy size={16} />
          </button>
        </div>
      </div>

      {/* Timer progress bar */}
      {timerMode && (
        <div className="flex-none h-1 bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <motion.div
            className="h-full bg-violet-500"
            animate={{ width: `${(timeLeft / 60) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      {/* ── Sentence area ───────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-4 min-h-0">
        <p className="text-xs text-gray-400 mb-4 font-medium tracking-wide uppercase">
          Vilken ordklass?
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="w-full text-center"
          >
            <p
              className="font-medium text-gray-800 dark:text-gray-100 leading-relaxed text-center"
              style={{ fontSize: 'clamp(1.25rem, 5vw, 1.5rem)' }}
            >
              {sentenceTokens.map(({ word, punct, isTarget }, i) => (
                <span key={i}>
                  {isTarget ? (
                    <motion.span
                      className="font-bold"
                      style={{
                        textDecoration: 'underline',
                        textDecorationStyle: 'wavy',
                        textDecorationColor: answerState === 'correct' ? '#10B981' : answerState === 'wrong' ? '#EF4444' : '#7C3AED',
                        textUnderlineOffset: '5px',
                        color: answerState === 'correct' ? '#10B981' : answerState === 'wrong' ? '#EF4444' : '#7C3AED',
                      }}
                      animate={answerState === 'correct' ? { scale: [1, 1.12, 1] } : answerState === 'wrong' ? { x: [0, -5, 5, -3, 3, 0] } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      {word}
                    </motion.span>
                  ) : (
                    <span className="text-gray-700 dark:text-gray-200">{word}</span>
                  )}
                  {punct}{i < sentenceTokens.length - 1 ? ' ' : ''}
                </span>
              ))}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Explanation after wrong answer */}
        <AnimatePresence>
          {showExplanation && lastCorrectClass && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 w-full max-w-sm"
            >
              <div
                className="rounded-2xl p-4 text-sm"
                style={{
                  background: WORD_CLASS_COLORS[lastCorrectClass] + '15',
                  borderLeft: `3px solid ${WORD_CLASS_COLORS[lastCorrectClass]}`,
                }}
              >
                <p className="font-bold mb-1" style={{ color: WORD_CLASS_COLORS[lastCorrectClass] }}>
                  {WORD_CLASS_EMOJIS[lastCorrectClass]} Rätt: {SWEDISH_NAMES[lastCorrectClass]}
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-snug text-xs">
                  {current.explanation}
                </p>
              </div>
              <button
                onClick={next}
                className="mt-3 w-full py-3.5 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm flex items-center justify-center gap-2 min-h-[48px]"
              >
                Nästa <ArrowRight size={15} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Answer grid ─────────────────────────────────── */}
      {!showExplanation && (
        <div
          className="flex-none px-3 pb-3"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 80px)' }}
        >
          <div className={`grid gap-2 ${activeClasses.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {activeClasses.map(wc => {
              const color = WORD_CLASS_COLORS[wc];
              const st = answerState === 'idle'
                ? 'default'
                : wc === current.correctClass
                ? 'correct'
                : 'disabled';

              return (
                <motion.button
                  key={wc}
                  onClick={() => handleAnswer(wc)}
                  disabled={answerState !== 'idle'}
                  className={`
                    rounded-2xl font-semibold flex flex-col items-center justify-center gap-1
                    border-2 transition-all select-none
                    ${activeClasses.length <= 4 ? 'min-h-[88px] text-base' : 'min-h-[80px] text-sm'}
                    ${st === 'disabled' ? 'opacity-40 cursor-not-allowed' : ''}
                  `}
                  style={{
                    backgroundColor: st === 'correct' ? color + '30' : st === 'disabled' ? '#f3f4f6' : color + '15',
                    borderColor: st === 'correct' ? color : st === 'disabled' ? '#e5e7eb' : color + '50',
                    color: st === 'disabled' ? '#9ca3af' : color,
                  }}
                  whileTap={answerState === 'idle' ? { scale: 0.94 } : undefined}
                  animate={st === 'correct' ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-xl leading-none">{WORD_CLASS_EMOJIS[wc]}</span>
                  <span className="leading-tight">{SWEDISH_NAMES[wc]}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
