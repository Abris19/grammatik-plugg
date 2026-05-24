import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Zap, Trophy, ArrowRight, RotateCcw, Settings } from 'lucide-react';
import { HUNT_SENTENCES } from '../data/sentences';
import { ALL_WORD_CLASSES, WORD_CLASS_COLORS, WORD_CLASS_EMOJIS } from '../data/grammar';
import type { WordClass } from '../data/grammar';
import type { HuntSentence } from '../data/sentences';
import { WordClassButton } from '../components/WordClassButton';
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

function getQueue(difficulty: Difficulty, timerMode: boolean): HuntSentence[] {
  let pool = [...HUNT_SENTENCES];
  if (difficulty === 'easy') pool = pool.filter(s => s.difficulty === 'easy' || s.difficulty === 'medium');
  if (difficulty === 'hard') pool = pool.filter(s => s.difficulty === 'medium' || s.difficulty === 'hard');
  const q = shuffle(pool);
  return timerMode ? q.slice(0, 999) : q;
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
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = correct ? 880 : 220;
      osc.type = correct ? 'sine' : 'sawtooth';
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
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

    if (correct) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      const bonus = newCombo >= 3 ? 20 : 10;
      setScore(s => s + bonus);
      setTotalCorrect(n => n + 1);
      if (newCombo === 10) setConfetti(true);
    } else {
      setCombo(0);
      setShowExplanation(true);
    }

    setTimeout(() => {
      if (!correct) return;
      next();
    }, 600);
  };

  const next = () => {
    setAnswerState('idle');
    setShowExplanation(false);
    if (qIndex + 1 >= queue.length) {
      if (!timerMode) endGame();
      else setQIndex(i => i + 1);
    } else {
      setQIndex(i => i + 1);
    }
  };

  const startGame = () => {
    setQueue(getQueue(difficulty, timerMode));
    setQIndex(0);
    setScore(0);
    setCombo(0);
    setAnswerState('idle');
    setShowExplanation(false);
    setTimeLeft(60);
    setTotalAnswered(0);
    setTotalCorrect(0);
    setMode('playing');
  };

  const sentenceTokens = current
    ? current.sentence.split(' ').map((word, i) => ({
        word: word.replace(/[.,!?]/, ''),
        punct: word.match(/[.,!?]/)?.[0] ?? '',
        isTarget: i === current.wordIndex,
      }))
    : [];

  if (mode === 'setup') {
    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto pb-24 md:pb-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            🎯 Ordklass-jakten
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
            Identifiera ordklassen för det markerade ordet i meningen.
          </p>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
            <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Settings size={16} /> Svårighetsgrad
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`py-3 rounded-xl text-sm font-semibold transition-all border-2 ${
                    difficulty === d
                      ? 'bg-violet-600 border-violet-600 text-white'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-violet-300'
                  }`}
                >
                  {d === 'easy' ? '😊 Lätt' : d === 'medium' ? '🤔 Medel' : '🔥 Svår'}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {difficulty === 'easy'
                ? 'Endast 4 alternativ: substantiv, verb, adjektiv, adverb'
                : difficulty === 'medium'
                ? 'Alla 9 ordklasser'
                : 'Alla 9 ordklasser + trixiga ord'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
            <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Timer size={16} /> Läge
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTimerMode(false)}
                className={`py-3 rounded-xl text-sm font-semibold transition-all border-2 ${
                  !timerMode
                    ? 'bg-violet-600 border-violet-600 text-white'
                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                }`}
              >
                📚 Lugn öving
              </button>
              <button
                onClick={() => setTimerMode(true)}
                className={`py-3 rounded-xl text-sm font-semibold transition-all border-2 ${
                  timerMode
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                }`}
              >
                ⏱️ Timer (60s)
              </button>
            </div>
          </div>

          <motion.button
            onClick={startGame}
            className="w-full py-4 rounded-2xl bg-violet-600 text-white font-bold text-lg shadow-lg shadow-violet-200 dark:shadow-violet-900/30 hover:bg-violet-700 transition-colors"
            whileTap={{ scale: 0.97 }}
          >
            Starta jakten! 🚀
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (mode === 'result') {
    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto pb-24 md:pb-8 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full"
        >
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">
              {accuracy >= 80 ? '🏆' : accuracy >= 60 ? '⭐' : '📚'}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {accuracy >= 80 ? 'Fantastiskt!' : accuracy >= 60 ? 'Bra jobbat!' : 'Fortsätt öva!'}
            </h1>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700">
              <p className="text-2xl font-bold text-violet-600">{score}</p>
              <p className="text-xs text-gray-400">poäng</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700">
              <p className="text-2xl font-bold text-emerald-600">{accuracy}%</p>
              <p className="text-xs text-gray-400">rätt</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700">
              <p className="text-2xl font-bold text-blue-600">{totalAnswered}</p>
              <p className="text-xs text-gray-400">frågor</p>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              onClick={startGame}
              className="flex-1 py-3 rounded-2xl bg-violet-600 text-white font-semibold flex items-center justify-center gap-2"
              whileTap={{ scale: 0.97 }}
            >
              <RotateCcw size={16} /> Spela igen
            </motion.button>
            <motion.button
              onClick={() => setMode('setup')}
              className="flex-1 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold"
              whileTap={{ scale: 0.97 }}
            >
              Inställningar
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Playing
  if (!current) return null;

  return (
    <div className="p-4 md:p-8 max-w-lg mx-auto pb-24 md:pb-8">
      <Confetti active={confetti} />

      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-3 py-1.5 rounded-full text-sm font-bold">
            <Zap size={14} /> {score}
          </div>
          {combo >= 2 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 px-2.5 py-1 rounded-full text-xs font-bold"
            >
              🔥 {combo}x combo!
            </motion.div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {timerMode && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${
              timeLeft <= 10
                ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}>
              <Timer size={14} /> {timeLeft}s
            </div>
          )}
          {!timerMode && (
            <span className="text-xs text-gray-400">{qIndex + 1} / {queue.length}</span>
          )}
        </div>
      </div>

      {/* Timer bar */}
      {timerMode && (
        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 overflow-hidden">
          <motion.div
            className="h-full bg-violet-500 rounded-full"
            animate={{ width: `${(timeLeft / 60) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-5"
        >
          <p className="text-xs text-gray-400 mb-3 text-center">Vilken ordklass är det understrukna ordet?</p>
          <p className="text-lg md:text-xl font-medium text-gray-800 dark:text-gray-100 text-center leading-relaxed">
            {sentenceTokens.map(({ word, punct, isTarget }, i) => (
              <span key={i}>
                {isTarget ? (
                  <motion.span
                    className="font-bold"
                    style={{
                      textDecoration: 'underline',
                      textDecorationStyle: 'wavy',
                      textDecorationColor: '#7C3AED',
                      textUnderlineOffset: '4px',
                      color: answerState === 'correct'
                        ? '#10B981'
                        : answerState === 'wrong'
                        ? '#EF4444'
                        : '#7C3AED',
                    }}
                    animate={
                      answerState === 'correct'
                        ? { scale: [1, 1.1, 1] }
                        : answerState === 'wrong'
                        ? { x: [0, -4, 4, -4, 0] }
                        : {}
                    }
                    transition={{ duration: 0.4 }}
                  >
                    {word}
                  </motion.span>
                ) : (
                  <span>{word}</span>
                )}
                {punct}
                {i < sentenceTokens.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>

          {/* Explanation shown after wrong answer */}
          <AnimatePresence>
            {showExplanation && lastCorrectClass && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"
              >
                <div
                  className="rounded-xl p-3 text-sm"
                  style={{
                    background: WORD_CLASS_COLORS[lastCorrectClass] + '15',
                    borderLeft: `3px solid ${WORD_CLASS_COLORS[lastCorrectClass]}`,
                  }}
                >
                  <span className="font-semibold" style={{ color: WORD_CLASS_COLORS[lastCorrectClass] }}>
                    {WORD_CLASS_EMOJIS[lastCorrectClass]} Rätt svar: {SWEDISH_NAMES[lastCorrectClass]}
                  </span>
                  <p className="text-gray-600 dark:text-gray-400 mt-1 leading-snug">
                    {current.explanation}
                  </p>
                </div>
                <button
                  onClick={next}
                  className="mt-3 w-full py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Nästa fråga <ArrowRight size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Answer buttons */}
      {!showExplanation && (
        <div className={`grid gap-2 ${activeClasses.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {activeClasses.map(wc => (
            <WordClassButton
              key={wc}
              wordClass={wc}
              label={SWEDISH_NAMES[wc]}
              onClick={() => handleAnswer(wc)}
              state={
                answerState === 'idle'
                  ? 'default'
                  : wc === current.correctClass
                  ? 'correct'
                  : answerState === 'wrong' && wc !== current.correctClass
                  ? 'disabled'
                  : 'disabled'
              }
              size="md"
            />
          ))}
        </div>
      )}

      {/* Stop button */}
      <button
        onClick={endGame}
        className="mt-4 w-full py-2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex items-center justify-center gap-1"
      >
        <Trophy size={12} /> Avsluta och se resultat
      </button>
    </div>
  );
}
