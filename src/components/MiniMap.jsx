/**
 * MiniMap.jsx
 *
 * Persistent navigation overlay always visible on zone pages.
 *
 * Desktop (≥ 640px):
 *   Fixed bottom-right corner, vertical column of dots.
 *   Each dot: shows zone name tooltip on hover, glows when active.
 *   Active indicator bar slides smoothly between zones.
 *
 * Mobile (< 640px):
 *   Fixed bottom centre, horizontal pill navigation bar.
 *   Shows emoji + short label for each zone.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const ZONES = [
  { path: '/hangar',       label: 'Hangar',       emoji: '🚀', color: 'var(--accent-amber)',  rgb: 'var(--rgb-amber)'  },
  { path: '/ai-lab',       label: 'AI Lab',        emoji: '🧠', color: 'var(--accent-teal)',   rgb: 'var(--rgb-teal)'   },
  { path: '/library',      label: 'Library',       emoji: '📚', color: 'var(--accent-gold)',   rgb: 'var(--rgb-gold)'   },
  { path: '/engine-room',  label: 'Engine Room',   emoji: '🛠️', color: 'var(--accent-blue)',   rgb: 'var(--rgb-blue)'   },
  { path: '/hall-of-fame', label: 'Hall of Fame',  emoji: '🏆', color: 'var(--accent-purple)', rgb: 'var(--rgb-purple)' },
  { path: '/control-room', label: 'Control Room',  emoji: '📡', color: 'var(--accent-green)',  rgb: 'var(--rgb-green)'  },
];

/* ─── Hook: detect mobile breakpoint ────────────────────────────────────── */
function useIsMobile() {
  const [mobile, setMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 640);
    window.addEventListener('resize', h, { passive: true });
    return () => window.removeEventListener('resize', h);
  }, []);
  return mobile;
}

/* ─── Desktop MiniMap ────────────────────────────────────────────────────── */
function DesktopMiniMap({ pathname, navigate }) {
  const [hovered, setHovered] = useState(null);

  return (
    <motion.nav
      id="mini-map"
      aria-label="Zone navigation"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.4, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '1.75rem',
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        alignItems: 'flex-end',
      }}
    >
      {/* Background track */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0,
        width: '1px',
        background: 'rgba(255,255,255,0.06)',
        borderRadius: '1px',
        pointerEvents: 'none',
      }} />

      {ZONES.map((zone, i) => {
        const isActive  = pathname === zone.path;
        const isHovered = hovered === zone.path;

        return (
          <div
            key={zone.path}
            style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px' }}
            onMouseEnter={() => setHovered(zone.path)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Tooltip */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: 8, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 6, scale: 0.92 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute', right: '22px',
                    background: 'rgba(10,14,26,0.95)',
                    border: `1px solid ${zone.color}30`,
                    borderRadius: 'var(--radius-sm)',
                    padding: '4px 12px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    color: zone.color,
                    letterSpacing: '0.08em',
                    whiteSpace: 'nowrap',
                    boxShadow: `0 4px 20px rgba(0,0,0,0.4)`,
                    pointerEvents: 'none',
                  }}
                >
                  {zone.emoji} {zone.label}
                  {/* Arrow */}
                  <span style={{
                    position: 'absolute', right: '-5px', top: '50%',
                    transform: 'translateY(-50%) rotate(45deg)',
                    width: '8px', height: '8px',
                    background: 'rgba(10,14,26,0.95)',
                    borderTop: `1px solid ${zone.color}30`,
                    borderRight: `1px solid ${zone.color}30`,
                  }} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dot */}
            <motion.button
              id={`minimap-dot-${zone.path.replace('/', '').replace('/', '-')}`}
              onClick={() => navigate(zone.path)}
              title={zone.label}
              aria-label={`Go to ${zone.label}`}
              aria-current={isActive ? 'page' : undefined}
              animate={{
                width:     isActive ? '12px' : isHovered ? '10px' : '7px',
                height:    isActive ? '12px' : isHovered ? '10px' : '7px',
                opacity:   isActive ? 1 : isHovered ? 0.85 : 0.35,
                boxShadow: isActive
                  ? `0 0 10px ${zone.color}, 0 0 22px ${zone.color}60, 0 0 40px ${zone.color}20`
                  : isHovered
                  ? `0 0 8px ${zone.color}80`
                  : 'none',
              }}
              transition={{ duration: 0.22 }}
              style={{
                borderRadius: '50%',
                background: zone.color,
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                flexShrink: 0,
              }}
            />
          </div>
        );
      })}

      {/* Subtle "ZONES" label at bottom */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.28 }}
        transition={{ delay: 1.2 }}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.48rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.18em',
          marginTop: '4px',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transform: 'rotate(180deg)',
        }}
      >
        ZONES
      </motion.span>
    </motion.nav>
  );
}

/* ─── Mobile bottom nav bar ──────────────────────────────────────────────── */
function MobileMiniMap({ pathname, navigate }) {
  return (
    <motion.nav
      id="mini-map-mobile"
      aria-label="Zone navigation"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.35 }}
      style={{
        position: 'fixed',
        bottom: 'max(1rem, env(safe-area-inset-bottom))',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 90,
        display: 'flex',
        gap: '4px',
        alignItems: 'center',
        background: 'rgba(8, 12, 24, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '100px',
        padding: '8px 12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      {ZONES.map((zone) => {
        const isActive = pathname === zone.path;
        return (
          <motion.button
            key={zone.path}
            id={`minimap-mobile-${zone.path.replace('/', '').replace('/', '-')}`}
            onClick={() => navigate(zone.path)}
            aria-label={zone.label}
            aria-current={isActive ? 'page' : undefined}
            animate={{
              scale:      isActive ? 1.15 : 1,
              background: isActive ? `${zone.color}18` : 'transparent',
            }}
            transition={{ duration: 0.2 }}
            style={{
              border: isActive ? `1px solid ${zone.color}40` : '1px solid transparent',
              borderRadius: '100px',
              padding: '5px 9px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'border-color 0.2s ease',
            }}
          >
            <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>{zone.emoji}</span>
            {isActive && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.55rem',
                  color: zone.color,
                  letterSpacing: '0.06em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                {zone.label.split(' ')[0].toUpperCase()}
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </motion.nav>
  );
}

/* ─── Root MiniMap ───────────────────────────────────────────────────────── */
export default function MiniMap() {
  const navigate     = useNavigate();
  const { pathname } = useLocation();
  const isMobile     = useIsMobile();

  return isMobile
    ? <MobileMiniMap pathname={pathname} navigate={navigate} />
    : <DesktopMiniMap pathname={pathname} navigate={navigate} />;
}
