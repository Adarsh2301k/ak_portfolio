/**
 * LoadingScreen.jsx
 *
 * First-visit only: shown for ~2s, then fades out into HubMap.
 * localStorage key: "portfolio_v1_loaded"
 *
 * Displays:
 *  · Name + tagline
 *  · "INITIALIZING SYSTEMS…" progress log
 *  · Animated progress bar (eased fill over 1.8s)
 *  · Fade out → triggers onComplete
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'portfolio_v1_loaded';

const LOG_ENTRIES = [
  { t: 0,    msg: 'Mounting core subsystems…'       },
  { t: 420,  msg: 'Loading zone configurations…'    },
  { t: 820,  msg: 'Hydrating neural interfaces…'    },
  { t: 1200, msg: 'Calibrating warp drives…'        },
  { t: 1540, msg: 'All systems nominal. Welcome ✓'  },
];

export function shouldShowLoading() {
  try {
    return !localStorage.getItem(STORAGE_KEY);
  } catch {
    return false;
  }
}

export function markLoaded() {
  try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
}

/* ─── Internal components ────────────────────────────────────────────────── */
function ProgressBar({ progress }) {
  return (
    <div style={{
      width: '100%', maxWidth: '340px',
      height: '3px',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '2px', overflow: 'hidden',
    }}>
      <motion.div
        style={{
          height: '100%',
          background: 'linear-gradient(90deg, var(--accent-teal), var(--accent-amber))',
          borderRadius: '2px',
          boxShadow: '0 0 12px rgba(0,255,209,0.5)',
        }}
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      />
    </div>
  );
}

/* ─── LoadingScreen ──────────────────────────────────────────────────────── */
export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress]  = useState(0);
  const [log, setLog]            = useState([]);
  const [exiting, setExiting]    = useState(false);
  const startRef                 = useRef(Date.now());

  useEffect(() => {
    // Eased progress ramp from 0 → 100 over ~1.85s
    const DURATION = 1850;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const t = Math.min(elapsed / DURATION, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t >= 1) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // Log entries
  useEffect(() => {
    const timers = LOG_ENTRIES.map(({ t, msg }) =>
      setTimeout(() => setLog((prev) => [...prev, msg]), t)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // Trigger exit after total duration
  useEffect(() => {
    const t = setTimeout(() => {
      setExiting(true);
      markLoaded();
      setTimeout(onComplete, 600); // wait for fade out
    }, 2100);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 500,
            background: 'var(--bg-deep)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0',
            overflow: 'hidden',
          }}
        >
          {/* Background pulse ring */}
          <motion.div
            aria-hidden
            style={{
              position: 'absolute',
              width: '600px', height: '600px',
              borderRadius: '50%',
              border: '1px solid rgba(0,255,209,0.06)',
            }}
            animate={{ scale: [0.8, 1.4], opacity: [0.4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.div
            aria-hidden
            style={{
              position: 'absolute',
              width: '400px', height: '400px',
              borderRadius: '50%',
              border: '1px solid rgba(0,255,209,0.1)',
            }}
            animate={{ scale: [0.9, 1.3], opacity: [0.5, 0] }}
            transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, ease: 'easeOut' }}
          />

          {/* Content */}
          <div style={{
            position: 'relative', zIndex: 1,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '0.85rem',
            width: '100%', maxWidth: '400px',
            padding: '0 2rem',
          }}>
            {/* Teal dot */}
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: 'var(--accent-teal)',
                boxShadow: '0 0 16px var(--accent-teal)',
                marginBottom: '0.5rem',
              }}
            />

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 8vw, 3.2rem)',
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, var(--text-primary) 40%, var(--accent-teal))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textAlign: 'center',
                lineHeight: 1.1,
                marginBottom: '0.2rem',
              }}
            >
              Alex Mercer
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.14em',
                marginBottom: '1.5rem',
              }}
            >
              ML Engineer · Full-Stack · Open Source
            </motion.p>

            {/* Progress bar */}
            <ProgressBar progress={progress} />

            {/* Percentage */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              width: '100%', maxWidth: '340px',
              marginTop: '6px',
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                INITIALIZING SYSTEMS
              </span>
              <motion.span
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--accent-teal)', letterSpacing: '0.06em' }}
              >
                {progress}%
              </motion.span>
            </div>

            {/* Log */}
            <div style={{
              width: '100%', maxWidth: '340px',
              marginTop: '1rem',
              display: 'flex', flexDirection: 'column', gap: '4px',
              minHeight: '88px',
            }}>
              {log.map((entry, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: i === log.length - 1 ? 0.9 : 0.4, x: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.62rem',
                    color: i === log.length - 1 ? 'var(--accent-teal)' : 'var(--text-muted)',
                    letterSpacing: '0.06em',
                  }}
                >
                  {'>'} {entry}
                </motion.p>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
