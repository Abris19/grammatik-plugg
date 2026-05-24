import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, BookOpen, Flame, Zap, Trophy, ChevronRight } from 'lucide-react';
import { ProgressRing } from '../components/ProgressRing';
import { useProgress } from '../hooks/useProgress';
import { GRAMMAR_DATA, WORD_CLASS_COLORS, WORD_CLASS_EMOJIS } from '../data/grammar';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export function Home() {
  const navigate = useNavigate();
  const { progress, totalQuestions, accuracy } = useProgress();

  const today = new Date().toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto pb-24 md:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <p className="text-sm text-gray-400 capitalize">{today}</p>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">
          Dags att plugga! 📚
        </h1>
      </motion.div>

      {/* Stats row */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-3 gap-3 mb-6"
      >
        <motion.div variants={item} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-1">
          <div className="flex items-center gap-1 text-orange-500">
            <Flame size={18} />
            <span className="text-2xl font-bold">{progress.streak}</span>
          </div>
          <p className="text-xs text-gray-400 text-center">dagars streak</p>
        </motion.div>

        <motion.div variants={item} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-1">
          <div className="flex items-center gap-1 text-violet-500">
            <Zap size={18} />
            <span className="text-2xl font-bold">{progress.xp}</span>
          </div>
          <p className="text-xs text-gray-400 text-center">totalt XP</p>
        </motion.div>

        <motion.div variants={item} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-1">
          <div className="flex items-center gap-1 text-emerald-500">
            <Trophy size={18} />
            <span className="text-2xl font-bold">{accuracy}%</span>
          </div>
          <p className="text-xs text-gray-400 text-center">träffsäkerhet</p>
        </motion.div>
      </motion.div>

      {/* Action cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-3 mb-6"
      >
        <motion.button
          variants={item}
          onClick={() => navigate('/ordklass-jakten')}
          className="bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-violet-200 dark:shadow-violet-900/30 hover:shadow-xl hover:-translate-y-0.5 transition-all text-left"
          whileTap={{ scale: 0.98 }}
        >
          <div className="bg-white/20 rounded-xl p-3">
            <Target size={24} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-lg leading-tight">Ordklass-jakten ⭐</p>
            <p className="text-violet-200 text-sm mt-0.5">Identifiera ordklasser i meningar</p>
          </div>
          <ChevronRight size={20} className="opacity-70" />
        </motion.button>

        <motion.button
          variants={item}
          onClick={() => navigate('/boj-ratt')}
          className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 hover:shadow-xl hover:-translate-y-0.5 transition-all text-left"
          whileTap={{ scale: 0.98 }}
        >
          <div className="bg-white/20 rounded-xl p-3">
            <BookOpen size={24} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-lg leading-tight">Böj rätt</p>
            <p className="text-emerald-200 text-sm mt-0.5">Lucktext, tempus och vanliga fällor</p>
          </div>
          <ChevronRight size={20} className="opacity-70" />
        </motion.button>

        <motion.button
          variants={item}
          onClick={() => navigate('/lar-dig')}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left"
          whileTap={{ scale: 0.98 }}
        >
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-3">
            <BookOpen size={24} className="text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-lg leading-tight text-gray-800 dark:text-gray-100">Lär dig teorin</p>
            <p className="text-gray-400 text-sm mt-0.5">Alla 9 ordklasser med minnesflaskkort</p>
          </div>
          <ChevronRight size={20} className="text-gray-300" />
        </motion.button>
      </motion.div>

      {/* Progress rings per ordklass */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-4">Din behärskning</h2>
        <div className="grid grid-cols-3 gap-4">
          {GRAMMAR_DATA.map(g => {
            const stats = progress.classStats[g.id] ?? { correct: 0, total: 0 };
            const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
            return (
              <div key={g.id} className="flex flex-col items-center gap-2">
                <ProgressRing
                  percent={pct}
                  size={64}
                  strokeWidth={5}
                  color={WORD_CLASS_COLORS[g.id]}
                  label={`${pct}%`}
                />
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 leading-tight">
                    {WORD_CLASS_EMOJIS[g.id]} {g.name}
                  </p>
                  <p className="text-[10px] text-gray-400">{stats.total} frågor</p>
                </div>
              </div>
            );
          })}
        </div>
        {totalQuestions === 0 && (
          <p className="text-center text-sm text-gray-400 mt-4">
            Börja öva för att se din framsteg! 🚀
          </p>
        )}
      </motion.div>
    </div>
  );
}
