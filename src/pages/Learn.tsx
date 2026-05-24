import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { GRAMMAR_DATA, WORD_CLASS_COLORS, WORD_CLASS_EMOJIS } from '../data/grammar';
import type { GrammarSection } from '../data/grammar';
import { FlashcardDeck } from '../components/Flashcard';

export function Learn() {
  const [selected, setSelected] = useState<GrammarSection>(GRAMMAR_DATA[0]);
  const [tab, setTab] = useState<'teori' | 'flashcards'>('teori');
  const [mobilePickerOpen, setMobilePickerOpen] = useState(false);
  const chipScrollRef = useRef<HTMLDivElement>(null);

  const color = WORD_CLASS_COLORS[selected.id];

  const selectClass = (g: GrammarSection) => {
    setSelected(g);
    setTab('teori');
    setMobilePickerOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row" style={{ minHeight: '100dvh' }}>

      {/* ── Desktop sidebar ─────────────────────────────────── */}
      <div className="hidden md:block w-56 flex-none overflow-y-auto bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 sticky top-0 h-screen">
        <div className="p-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">Ordklasser</p>
          {GRAMMAR_DATA.map(g => (
            <button
              key={g.id}
              onClick={() => selectClass(g)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 text-left ${
                selected.id === g.id ? 'text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
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

      {/* ── Mobile: horizontal chip row + dropdown ──────────── */}
      <div className="md:hidden sticky top-0 z-30 header-glass border-b border-gray-200/60 dark:border-gray-800/60"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        {/* Horizontal scroll chips */}
        <div
          ref={chipScrollRef}
          className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {GRAMMAR_DATA.map(g => {
            const c = WORD_CLASS_COLORS[g.id];
            const isActive = selected.id === g.id;
            return (
              <button
                key={g.id}
                onClick={() => selectClass(g)}
                className="flex-none flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap border-2 transition-all min-h-[36px]"
                style={{
                  background: isActive ? c : c + '12',
                  borderColor: isActive ? c : c + '40',
                  color: isActive ? 'white' : c,
                }}
              >
                <span>{WORD_CLASS_EMOJIS[g.id]}</span>
                {g.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content area ────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-nav md:pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.18 }}
          >
            {/* Header card */}
            <div
              className="rounded-2xl p-5 mb-5"
              style={{ background: color + '15', border: `2px solid ${color}30` }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{WORD_CLASS_EMOJIS[selected.id]}</span>
                <h1 className="text-2xl font-bold" style={{ color }}>{selected.name}</h1>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{selected.fullDef}</p>
              <div
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: color + '25', color }}
              >
                💡 {selected.trick}
              </div>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-2 mb-5">
              {(['teori', 'flashcards'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
                    tab === t ? 'text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
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
                    <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-3">Typer</h2>
                    <div className="space-y-2.5">
                      {selected.subtypes.map(st => (
                        <div key={st.name}>
                          <span className="font-semibold text-sm" style={{ color }}>{st.name}: </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{st.examples.join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Rules */}
                {selected.rules?.map(rule => (
                  <section key={rule.title} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1">{rule.title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{rule.content}</p>
                    {rule.examples && (
                      <div className="space-y-1.5">
                        {rule.examples.map((ex, i) => (
                          <div
                            key={i}
                            className="text-sm px-3 py-2 rounded-xl font-mono break-words"
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
                    <h2 className="text-sm font-bold text-red-700 dark:text-red-400 mb-3">⚠️ Vanliga misstag</h2>
                    <ul className="space-y-2">
                      {selected.pitfalls.map((p, i) => (
                        <li key={i} className="text-sm text-red-700 dark:text-red-300 flex gap-2 leading-snug">
                          <span className="flex-none">•</span>{p}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Examples */}
                <section className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-3">Exempel</h2>
                  <div className="flex flex-wrap gap-2">
                    {selected.examples.map((ex, i) => (
                      <span
                        key={i}
                        className="px-3 py-2 rounded-xl text-sm font-medium"
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

      {/* Mobile bottom sheet overlay (unused but kept for future) */}
      <AnimatePresence>
        {mobilePickerOpen && (
          <>
            <motion.div
              className="bottom-sheet-overlay md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobilePickerOpen(false)}
            />
            <motion.div
              className="bottom-sheet md:hidden bg-white dark:bg-gray-900 max-h-[70dvh] overflow-y-auto"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            >
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mt-3 mb-4" />
              <div className="px-4 pb-4 grid grid-cols-3 gap-2">
                {GRAMMAR_DATA.map(g => {
                  const c = WORD_CLASS_COLORS[g.id];
                  return (
                    <button
                      key={g.id}
                      onClick={() => selectClass(g)}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 min-h-[80px] justify-center"
                      style={{
                        background: selected.id === g.id ? c + '20' : 'transparent',
                        borderColor: selected.id === g.id ? c : '#e5e7eb',
                        color: c,
                      }}
                    >
                      <span className="text-2xl">{WORD_CLASS_EMOJIS[g.id]}</span>
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center leading-tight">{g.name}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Suppress unused variable warning
void ChevronDown;
