import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Learn } from './pages/Learn';
import { HuntMode } from './pages/HuntMode';
import { ConjugateMode } from './pages/ConjugateMode';
import { Progress } from './pages/Progress';

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
        <main className="md:ml-60 min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lar-dig" element={<Learn />} />
            <Route path="/ordklass-jakten" element={<HuntMode muted={muted} />} />
            <Route path="/boj-ratt" element={<ConjugateMode muted={muted} />} />
            <Route path="/framsteg" element={<Progress />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}
