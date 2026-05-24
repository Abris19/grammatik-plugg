import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Learn = lazy(() => import('./pages/Learn').then(m => ({ default: m.Learn })));
const HuntMode = lazy(() => import('./pages/HuntMode').then(m => ({ default: m.HuntMode })));
const ConjugateMode = lazy(() => import('./pages/ConjugateMode').then(m => ({ default: m.ConjugateMode })));
const Progress = lazy(() => import('./pages/Progress').then(m => ({ default: m.Progress })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-2 border-violet-200 border-t-violet-600 animate-spin" />
    </div>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [muted, setMuted] = useState(() => {
    return localStorage.getItem('muted') === 'true';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('muted', String(muted));
  }, [muted]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <BrowserRouter>
        <Navigation
          darkMode={darkMode}
          onToggleDark={() => setDarkMode(d => !d)}
          muted={muted}
          onToggleMute={() => setMuted(m => !m)}
        />
        <main className="md:ml-60" style={{ minHeight: '100dvh' }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/lar-dig" element={<Learn />} />
              <Route path="/ordklass-jakten" element={<HuntMode muted={muted} />} />
              <Route path="/boj-ratt" element={<ConjugateMode muted={muted} />} />
              <Route path="/framsteg" element={<Progress />} />
            </Routes>
          </Suspense>
        </main>
      </BrowserRouter>
    </div>
  );
}
