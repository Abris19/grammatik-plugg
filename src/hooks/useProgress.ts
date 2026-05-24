import { useState, useEffect, useCallback } from 'react';
import type { WordClass } from '../data/grammar';

export interface ClassStats {
  correct: number;
  total: number;
}

export interface ProgressState {
  xp: number;
  streak: number;
  lastStudiedDate: string | null;
  studiedDates: string[];
  classStats: Record<WordClass, ClassStats>;
  totalTime: number;
  huntHighScore: number;
  conjugateHighScore: number;
  sessionStartTime: number | null;
}

const DEFAULT_CLASS_STATS: Record<WordClass, ClassStats> = {
  substantiv: { correct: 0, total: 0 },
  verb: { correct: 0, total: 0 },
  adjektiv: { correct: 0, total: 0 },
  adverb: { correct: 0, total: 0 },
  pronomen: { correct: 0, total: 0 },
  preposition: { correct: 0, total: 0 },
  konjunktion: { correct: 0, total: 0 },
  subjunktion: { correct: 0, total: 0 },
  interjektion: { correct: 0, total: 0 },
};

const STORAGE_KEY = 'grammatik-plugg-progress';

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefault();
    return { ...getDefault(), ...JSON.parse(raw) };
  } catch {
    return getDefault();
  }
}

function getDefault(): ProgressState {
  return {
    xp: 0,
    streak: 0,
    lastStudiedDate: null,
    studiedDates: [],
    classStats: { ...DEFAULT_CLASS_STATS },
    totalTime: 0,
    huntHighScore: 0,
    conjugateHighScore: 0,
    sessionStartTime: null,
  };
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(loadProgress);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {}
  }, [progress]);

  const recordStudy = useCallback(() => {
    const today = todayString();
    setProgress(p => {
      if (p.studiedDates.includes(today)) return p;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);
      const newStreak = p.lastStudiedDate === yesterdayStr ? p.streak + 1 : 1;
      return {
        ...p,
        streak: newStreak,
        lastStudiedDate: today,
        studiedDates: [...p.studiedDates, today],
      };
    });
  }, []);

  const addXP = useCallback((amount: number) => {
    setProgress(p => ({ ...p, xp: p.xp + amount }));
  }, []);

  const recordAnswer = useCallback((wordClass: WordClass, correct: boolean) => {
    setProgress(p => {
      const prev = p.classStats[wordClass] ?? { correct: 0, total: 0 };
      return {
        ...p,
        classStats: {
          ...p.classStats,
          [wordClass]: {
            correct: prev.correct + (correct ? 1 : 0),
            total: prev.total + 1,
          },
        },
      };
    });
    if (correct) addXP(10);
    recordStudy();
  }, [addXP, recordStudy]);

  const updateHuntHighScore = useCallback((score: number) => {
    setProgress(p => ({
      ...p,
      huntHighScore: Math.max(p.huntHighScore, score),
    }));
  }, []);

  const updateConjugateHighScore = useCallback((score: number) => {
    setProgress(p => ({
      ...p,
      conjugateHighScore: Math.max(p.conjugateHighScore, score),
    }));
  }, []);

  const addTime = useCallback((seconds: number) => {
    setProgress(p => ({ ...p, totalTime: p.totalTime + seconds }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(getDefault());
  }, []);

  const totalQuestions = Object.values(progress.classStats).reduce(
    (sum, s) => sum + s.total,
    0,
  );
  const totalCorrect = Object.values(progress.classStats).reduce(
    (sum, s) => sum + s.correct,
    0,
  );
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  return {
    progress,
    recordAnswer,
    addXP,
    recordStudy,
    updateHuntHighScore,
    updateConjugateHighScore,
    addTime,
    resetProgress,
    totalQuestions,
    totalCorrect,
    accuracy,
  };
}
