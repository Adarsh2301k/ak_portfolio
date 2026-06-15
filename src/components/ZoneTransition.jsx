/**
 * ZoneTransition.jsx
 *
 * Wraps every route. On mount it shows a ROUTE-SPECIFIC full-screen overlay
 * that plays, then exits — revealing the zone content beneath.
 *
 * Per-route overlay map:
 *  /hangar       → amber scan-line sweep top → bottom
 *  /ai-lab       → teal glitch static bands that resolve
 *  /library      → warm curtain panel wipes right → off-screen left
 *  /engine-room  → mechanical iris clips open from centre
 *  /hall-of-fame → gold spotlight sweeps left → right
 *  /control-room → phosphor terminal boot text
 *  / (hub)       → simple fade (no overlay)
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────────────────────────
   Utility: shared base overlay style
───────────────────────────────────────────────────────────────────────────── */
const BASE = {
  position: 'fixed', inset: 0, zIndex: 300, overflow: 'hidden', pointerEvents: 'none',
};

/* ─────────────────────────────────────────────────────────────────────────────
   1. Hangar — amber scan beam
───────────────────────────────────────────────────────────────────────────── */
function HangarOverlay({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 820); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div
      style={{ ...BASE, background: 'var(--bg-deep)' }}
      initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
    >
      {/* Beam */}
      <motion.div
        style={{
          position: 'absolute', left: 0, right: 0, height: '3px', top: 0,
          background: 'linear-gradient(90deg, transparent 0%, var(--accent-amber) 30%, #fff8 50%, var(--accent-amber) 70%, transparent 100%)',
          boxShadow: '0 0 24px 8px rgba(255,179,71,0.55), 0 0 60px 20px rgba(255,179,71,0.18)',
        }}
        animate={{ top: '102vh' }}
        transition={{ duration: 0.75, ease: 'linear' }}
      />
      {/* Reflected under-glow */}
      <motion.div
        style={{
          position: 'absolute', left: 0, right: 0, height: '80px',
          background: 'linear-gradient(to bottom, rgba(255,179,71,0.06), transparent)',
          top: 0,
        }}
        animate={{ top: '102vh' }}
        transition={{ duration: 0.75, ease: 'linear' }}
      />
      {/* Label */}
      <motion.p
        style={{
          position: 'absolute', bottom: '2rem', left: 0, right: 0, textAlign: 'center',
          fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.22em',
          color: 'var(--accent-amber)', opacity: 0,
        }}
        animate={{ opacity: [0, 0.7, 0.7, 0] }}
        transition={{ duration: 0.8, times: [0, 0.2, 0.8, 1] }}
      >
        🚀 HANGAR · POWERING UP
      </motion.p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   2. AI Lab — teal glitch bands
───────────────────────────────────────────────────────────────────────────── */
const GLITCH_BANDS = [
  { top: '8%',  h: '3px', delay: 0,    offset: 18  },
  { top: '22%', h: '8px', delay: 0.04, offset: -24 },
  { top: '41%', h: '2px', delay: 0.08, offset: 12  },
  { top: '57%', h: '12px',delay: 0.06, offset: -16 },
  { top: '73%', h: '4px', delay: 0.02, offset: 20  },
  { top: '89%', h: '6px', delay: 0.09, offset: -10 },
];

function AILabOverlay({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 640); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div
      style={{ ...BASE, background: '#030D12' }}
      initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
    >
      {GLITCH_BANDS.map((b, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute', left: 0, right: 0, top: b.top, height: b.h,
            background: `rgba(0,255,209,${0.4 + i * 0.06})`,
          }}
          animate={{ x: [0, b.offset, -b.offset * 0.6, b.offset * 0.3, 0], opacity: [0.8, 0.5, 0.9, 0.3, 0] }}
          transition={{ duration: 0.55, delay: b.delay, ease: 'linear' }}
        />
      ))}
      <motion.p
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
          color: 'var(--accent-teal)', letterSpacing: '0.18em',
          textShadow: '0 0 12px var(--accent-teal)', whiteSpace: 'nowrap',
        }}
        animate={{ x: [0, -6, 5, -3, 0], opacity: [1, 0.5, 1, 0.7, 0] }}
        transition={{ duration: 0.55 }}
      >
        🧠 AI LAB :: SIGNAL LOCK
      </motion.p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   3. Library — warm curtain wipe
───────────────────────────────────────────────────────────────────────────── */
function LibraryOverlay({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 750); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div
      style={{ ...BASE }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Main curtain */}
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #1a0d02 0%, #0e0804 50%, #100a03 100%)',
          borderRight: '3px solid rgba(255,179,71,0.4)',
          boxShadow: '4px 0 32px rgba(255,179,71,0.15)',
        }}
        initial={{ x: 0 }}
        animate={{ x: '-101%' }}
        transition={{ duration: 0.62, delay: 0.22, ease: [0.76, 0, 0.24, 1] }}
        onAnimationComplete={() => {}} // noop — timeout controls onDone
      />
      {/* Book emoji flying across */}
      <motion.span
        style={{ position: 'absolute', top: '50%', fontSize: '2.5rem' }}
        initial={{ left: '-5%', y: '-50%', rotate: -15 }}
        animate={{ left: '105%', rotate: 10 }}
        transition={{ duration: 0.62, delay: 0.22, ease: [0.4, 0, 0.2, 1] }}
      >
        📚
      </motion.span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   4. Engine Room — mechanical iris open (clip-path circle shrink)
───────────────────────────────────────────────────────────────────────────── */
function EngineRoomOverlay({ onDone }) {
  return (
    <motion.div
      style={{ ...BASE, background: 'var(--bg-deep)' }}
      initial={{ clipPath: 'circle(71% at 50% 50%)' }}
      animate={{ clipPath: 'circle(0% at 50% 50%)' }}
      transition={{ duration: 0.68, delay: 0.25, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={onDone}
      exit={{ opacity: 0 }}
    >
      {/* Concentric gear rings */}
      {[120, 80, 44].map((r, i) => (
        <motion.div
          key={r}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            width: `${r * 2}px`, height: `${r * 2}px`,
            borderRadius: '50%',
            border: `1px solid rgba(96,165,250,${0.15 + i * 0.1})`,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 1.5, ease: 'linear', repeat: Infinity }}
        />
      ))}
      <motion.p
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
          color: 'var(--accent-blue)', letterSpacing: '0.2em', whiteSpace: 'nowrap',
        }}
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{ duration: 0.65, delay: 0.2 }}
      >
        ⚙ ENGINE ROOM · ONLINE
      </motion.p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   5. Hall of Fame — gold spotlight sweep
───────────────────────────────────────────────────────────────────────────── */
function HallOfFameOverlay({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1000); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div
      style={{ ...BASE, background: 'rgba(6,2,18,0.97)' }}
      initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
    >
      {/* Spotlight cone */}
      <motion.div
        style={{
          position: 'absolute', top: '-30%',
          width: '55%', height: '160%',
          background: 'radial-gradient(ellipse at 50% 40%, rgba(255,215,0,0.11) 0%, rgba(255,215,0,0.03) 40%, transparent 70%)',
          filter: 'blur(2px)',
        }}
        initial={{ left: '-40%' }}
        animate={{ left: '140%' }}
        transition={{ duration: 0.85, delay: 0.1, ease: [0.4, 0, 0.6, 1] }}
      />
      {/* Second narrower beam */}
      <motion.div
        style={{
          position: 'absolute', top: '-10%',
          width: '20%', height: '120%',
          background: 'radial-gradient(ellipse at 50% 30%, rgba(255,215,0,0.06) 0%, transparent 65%)',
        }}
        initial={{ left: '-20%' }}
        animate={{ left: '130%' }}
        transition={{ duration: 0.75, delay: 0.22, ease: [0.4, 0, 0.6, 1] }}
      />
      <motion.p
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
          color: '#FFD700', letterSpacing: '0.2em', whiteSpace: 'nowrap',
          textShadow: '0 0 16px rgba(255,215,0,0.6)',
        }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 0.9, times: [0, 0.2, 0.75, 1] }}
      >
        🏆 HALL OF FAME · ENTERING
      </motion.p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   6. Control Room — terminal boot lines
───────────────────────────────────────────────────────────────────────────── */
const BOOT_LINES_TR = [
  { text: '> CTRL_ROOM v2.4 — BOOTING…',   delay: 0    },
  { text: '> KERNEL LOAD: OK',              delay: 0.14 },
  { text: '> SECURE CHANNEL: ESTABLISHED', delay: 0.26 },
  { text: '> READY.',                       delay: 0.38 },
];

function ControlRoomOverlay({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 750); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div
      style={{ ...BASE, background: '#020D02', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
    >
      {/* Static bands */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute', left: 0, right: 0,
            height: `${Math.random() * 5 + 1}px`,
            top: `${i * 10 + Math.random() * 5}%`,
            background: `rgba(0,255,65,${Math.random() * 0.15 + 0.03})`,
          }}
          animate={{ opacity: [0.8, 0, 0.6, 0], x: [0, Math.random() * 10 - 5, 0] }}
          transition={{ duration: 0.6, ease: 'linear' }}
        />
      ))}
      {/* Boot text */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', position: 'relative', zIndex: 1 }}>
        {BOOT_LINES_TR.map((line, i) => (
          <motion.p
            key={i}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
              color: 'var(--phosphor)', letterSpacing: '0.1em',
              textShadow: '0 0 8px var(--phosphor)',
            }}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: line.delay, duration: 0.18 }}
          >
            {line.text}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Overlay registry
───────────────────────────────────────────────────────────────────────────── */
const OVERLAYS = {
  '/hangar':       HangarOverlay,
  '/ai-lab':       AILabOverlay,
  '/library':      LibraryOverlay,
  '/engine-room':  EngineRoomOverlay,
  '/hall-of-fame': HallOfFameOverlay,
  '/control-room': ControlRoomOverlay,
};

/* ─────────────────────────────────────────────────────────────────────────────
   ZoneTransition — root wrapper
───────────────────────────────────────────────────────────────────────────── */
const PAGE_VARIANTS = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.35 } },
  exit:    { opacity: 0, y: -12, filter: 'blur(4px)', transition: { duration: 0.22 } },
};

export default function ZoneTransition({ children }) {
  const location = useLocation();
  // Freeze the pathname on mount so it doesn't mutate while this tree is exiting.
  // Because App.jsx uses <Routes key={location.pathname}>, a new instance of 
  // ZoneTransition is created for every route anyway.
  const [frozenPathname] = useState(location.pathname);
  const prefersReduced = useReducedMotion();

  // showOverlay: true on mount, false after overlay calls onDone
  const [showOverlay, setShowOverlay] = useState(true);

  const onDone = useCallback(() => setShowOverlay(false), []);

  const OverlayComponent = OVERLAYS[frozenPathname];

  // Reduced-motion: skip overlay entirely, just fade in
  if (prefersReduced) {
    return (
      <motion.div variants={PAGE_VARIANTS} initial="initial" animate="animate" exit="exit">
        {children}
      </motion.div>
    );
  }

  return (
    <>
      {/* Zone content fades in after overlay lifts */}
      <motion.div
        variants={PAGE_VARIANTS}
        initial="initial"
        animate={showOverlay && OverlayComponent ? 'initial' : 'animate'}
        exit="exit"
        style={{ minHeight: '100vh' }}
      >
        {children}
      </motion.div>

      {/* Route-specific overlay */}
      <AnimatePresence>
        {showOverlay && OverlayComponent && (
          <OverlayComponent key={`overlay-${frozenPathname}`} onDone={onDone} />
        )}
      </AnimatePresence>
    </>
  );
}
