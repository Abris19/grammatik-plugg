import { motion } from 'framer-motion';
import { Flame, Zap, Trophy, Clock, Target } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { GRAMMAR_DATA, WORD_CLASS_COLORS, WORD_CLASS_EMOJIS } from '../data/grammar';

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}t ${m}m`;
  if (m > 0) return `${m}m`;
  return `${seconds}s`;
}

function StreakCalendar({ studiedDates }: { studiedDates: string[] }) {
  const today = new Date();
  const days: { date: string; label: string; studied: boolean; isToday: boolean }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    days.push({
      date: dateStr,
      label: d.getDate().toString(),
      studied: studiedDates.includes(dateStr),
      isToday: i === 0,
    });
  }

  return (
    <div>
      <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-3">
        Streak-kalender (30 dagar)
      </h2>
      <div className="grid grid-cols-10 gap-1.5">
        {days.map(d => (
          <motion.div
            key={d.date}
            title={d.date}
            className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
              d.studied
                ? 'bg-emerald-400 text-white'
                : d.isToday
                ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 border-2 border-violet-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
            }`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: (29 - days.indexOf(d)) * 0.01 }}
          >
            {d.label}
          </motion.div>
        ))}
      </div>
      <div className="flex gap-4 mt-2">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <div className="w-3 h-3 rounded bg-emerald-400" /> Pluggat
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <div className="w-3 h-3 rounded bg-gray-200 dark:bg-gray-700" /> Inte pluggat
        </div>
      </div>
    </div>
  );
}

function ClassBar({ name, correct, total, color, emoji }: {
  name: string; correct: number; total: number; color: string; emoji: string;
}) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-base w-7 text-center">{emoji}</span>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{name}</span>
          <span className="text-xs text-gray-400">{correct}/{total} ({pct}%)</span>
        </div>
        <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: color }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}

export function Progress() {
  const { progress, totalQuestions, totalCorrect, accuracy, resetProgress } = useProgress();

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto pb-24 md:pb-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">📊 Framsteg</h1>
        <p className="text-gray-400 text-sm mt-1">Din prestanda och aktivitet</p>
      </motion.div>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { icon: Flame, value: progress.streak, label: 'Streak (dagar)', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
          { icon: Zap, value: progress.xp, label: 'Totalt XP', color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/20' },
          { icon: Target, value: `${accuracy}%`, label: 'Träffsäkerhet', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { icon: Clock, value: formatTime(progress.totalTime), label: 'Pluggtid', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        ].map(({ icon: Icon, value, label, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`${bg} rounded-2xl p-4 flex flex-col items-center gap-1`}
          >
            <Icon size={20} className={color} />
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center leading-tight">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* High scores */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3">
          <div className="bg-violet-100 dark:bg-violet-900/30 rounded-xl p-2.5">
            <Trophy size={18} className="text-violet-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Jakten – rekord</p>
            <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{progress.huntHighScore} p</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-xl p-2.5">
            <Trophy size={18} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Böj rätt – rekord</p>
            <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{progress.conjugateHighScore} p</p>
          </div>
        </div>
      </div>

      {/* Per-class bar chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-6"
      >
        <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-4">Träffsäkerhet per ordklass</h2>
        {totalQuestions === 0 ? (
          <p className="text-center text-sm text-gray-400 py-4">
            Inga frågor besvarade ännu. Börja öva! 🚀
          </p>
        ) : (
          <div className="space-y-3.5">
            {GRAMMAR_DATA.map(g => {
              const stats = progress.classStats[g.id] ?? { correct: 0, total: 0 };
              return (
                <ClassBar
                  key={g.id}
                  name={g.name}
                  correct={stats.correct}
                  total={stats.total}
                  color={WORD_CLASS_COLORS[g.id]}
                  emoji={WORD_CLASS_EMOJIS[g.id]}
                />
              );
            })}
          </div>
        )}
        {totalQuestions > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between text-sm">
            <span className="text-gray-500">Totalt: {totalQuestions} frågor</span>
            <span className="text-emerald-600 font-semibold">{totalCorrect} rätt</span>
          </div>
        )}
      </motion.div>

      {/* Streak calendar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-6"
      >
        <StreakCalendar studiedDates={progress.studiedDates} />
      </motion.div>

      {/* Reset */}
      <button
        onClick={() => {
          if (window.confirm('Är du säker? All progress raderas.')) {
            resetProgress();
          }
        }}
        className="w-full py-3 rounded-2xl border-2 border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
      >
        🗑️ Nollställ all progress
      </button>
    </div>
  );
}
