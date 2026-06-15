// ─── App.jsx ──────────────────────────────────────────────────────────────────
// Root routing setup — 7 routes + persistent overlays + loading screen + ESC nav.

import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import HubMap        from './components/HubMap';
import MiniMap       from './components/MiniMap';
import ZoneTransition from './components/ZoneTransition';
import LoadingScreen, { shouldShowLoading } from './components/LoadingScreen';

import Hangar       from './zones/Hangar';
import AILab        from './zones/AILab';
import Library      from './zones/Library';
import EngineRoom   from './zones/EngineRoom';
import HallOfFame   from './zones/HallOfFame';
import ControlRoom  from './zones/ControlRoom';
import Now          from './zones/Now';
import About        from './zones/About';

/* ─── 404 fallback ───────────────────────────────────────────────────────── */
function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '1.25rem',
      background: 'var(--bg-deep)',
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)', fontSize: '5rem', fontWeight: 700, lineHeight: 1 }}>
        404
      </div>
      <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
        Zone not found. Return to Mission Control.
      </p>
      <button
        onClick={() => navigate('/')}
        style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
          color: 'var(--accent-teal)', border: '1px solid rgba(0,255,209,0.3)',
          background: 'rgba(0,255,209,0.06)', borderRadius: '100px',
          padding: '8px 24px', cursor: 'pointer', letterSpacing: '0.1em',
        }}
      >
        ← Mission Control
      </button>
    </div>
  );
}

/* ─── Main app shell ─────────────────────────────────────────────────────── */
function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const onZone   = location.pathname !== '/';

  /* ── ESC key → return to hub ── */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && location.pathname !== '/') {
        navigate('/');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [location.pathname, navigate]);

  return (
    <>
      {/* MiniMap: only visible when inside a zone */}
      <AnimatePresence>
        {onZone && <MiniMap key="minimap" />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <ZoneTransition><HubMap /></ZoneTransition>
          } />
          <Route path="/hangar" element={
            <ZoneTransition><Hangar /></ZoneTransition>
          } />
          <Route path="/ai-lab" element={
            <ZoneTransition><AILab /></ZoneTransition>
          } />
          <Route path="/library" element={
            <ZoneTransition><Library /></ZoneTransition>
          } />
          <Route path="/engine-room" element={
            <ZoneTransition><EngineRoom /></ZoneTransition>
          } />
          <Route path="/hall-of-fame" element={
            <ZoneTransition><HallOfFame /></ZoneTransition>
          } />
          <Route path="/control-room" element={
            <ZoneTransition><ControlRoom /></ZoneTransition>
          } />
          <Route path="/now" element={<Now />} />
          <Route path="/about" element={
            <ZoneTransition><About /></ZoneTransition>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

/* ─── Root with loading gate ─────────────────────────────────────────────── */
export default function App() {
  const [loading, setLoading] = useState(() => shouldShowLoading());

  // Allow ?skip-loading in URL to bypass (useful during development)
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('skip-loading')) {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <LoadingScreen key="loading" onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>
      {!loading && <AppShell />}
    </>
  );
}
