import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { GRAMMAR_DATA, WORD_CLASS_COLORS, WORD_CLASS_EMOJIS } from '../data/grammar';
import type { GrammarSection } from '../data/grammar';
import { FlashcardDeck } from '../components/Flashcard';

export function Learn() {
  const [selected, setSelected] = useState<GrammarSection>(GRAMMAR_DATA[0]);
  const [tab, setTab] = useState<'teori' | 'flashcards'>('teori');

  const color = WORD_CLASS_COLORS[selected.id];

  return (
    <div className="flex flex-col md:flex-row gap-0 h-[calc(100vh-4rem)] md:h-screen overflow-hidden pb-16 md:pb-0">
      {/* Sidebar list */}
      <div className="md:w-56 flex-none overflow-y-auto bg-white dark:bg-gray-900 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800">
        <div className="p-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
            Ordklasser
          </p>
          {GRAMMAR_DATA.map(g => (
            <button
              key={g.id}
              onClick={() => { setSelected(g); setTab('teori'); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 text-left ${
                selected.id === g.id
                  ? 'text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              style={selected.id === g.id ? { background: color } : undefined}
            >
              <span className="text-base">{WORD_CLASS_EMOJIS[g.id]}</span>
              {g.name}
              {selected.id === g.id && <ChevronRight size={14} className="ml-auto opacity-70" />}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div
              className="rounded-2xl p-6 mb-5"
              style={{ background: color + '18', border: `2px solid ${color}30` }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{WORD_CLASS_EMOJIS[selected.id]}</span>
                <h1 className="text-2xl font-bold" style={{ color }}>
                  {selected.name}
                </h1>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-base">{selected.fullDef}</p>
              <div
                className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
                style={{ background: color + '28', color }}
              >
                💡 Trick: {selected.trick}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-5">
              {(['teori', 'flashcards'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    tab === t
                      ? 'text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  style={tab === t ? { background: color } : undefined}
                >
                  {t === 'teori' ? '📖 Teori' : '🃏 Flashcards'}
                </button>
              ))}
            </div>

            {tab === 'teori' ? (
              <div className="space-y-4">
                {/* Subtypes */}
                {selected.subtypes && (
                  <section className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-3">Typer</h2>
                    <div className="space-y-2">
                      {selected.subtypes.map(st => (
                        <div key={st.name}>
                          <span className="font-semibold text-sm" style={{ color }}>{st.name}: </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {st.examples.join(', ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Rules */}
                {selected.rules?.map(rule => (
                  <section
                    key={rule.title}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700"
                  >
                    <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-1">
                      {rule.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{rule.content}</p>
                    {rule.examples && (
                      <div className="space-y-1">
                        {rule.examples.map((ex, i) => (
                          <div
                            key={i}
                            className="text-sm px-3 py-1.5 rounded-lg font-mono"
                            style={{ background: color + '10' }}
                          >
                            {ex}
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                ))}

                {/* Pitfalls */}
                {selected.pitfalls && selected.pitfalls.length > 0 && (
                  <section className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-5 border border-red-200 dark:border-red-800">
                    <h2 className="text-base font-bold text-red-700 dark:text-red-400 mb-3">
                      ⚠️ Vanliga misstag
                    </h2>
                    <ul className="space-y-2">
                      {selected.pitfalls.map((p, i) => (
                        <li key={i} className="text-sm text-red-700 dark:text-red-300 flex gap-2">
                          <span>•</span>{p}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Example sentences */}
                <section className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-3">Exempel</h2>
                  <div className="flex flex-wrap gap-2">
                    {selected.examples.map((ex, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-xl text-sm font-medium"
                        style={{ background: color + '15', color }}
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </section>
              </div>
            ) : (
              <div className="max-w-lg">
                <FlashcardDeck cards={selected.flashcards} color={color} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
