// ─── ZoneHeader ───────────────────────────────────────────────────────────────
// Consistent header block used at the top of every zone page.

import { motion } from 'framer-motion';
import BackToHub from './BackToHub';

export default function ZoneHeader({ zone, title, subtitle, accentColor = 'var(--accent-teal)' }) {
  return (
    <header style={{ marginBottom: '3rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <BackToHub />
      </div>

      {/* Zone label */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: accentColor,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{
          display: 'inline-block',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: accentColor,
          boxShadow: `0 0 8px ${accentColor}`,
        }} />
        {zone}
      </motion.div>

      {/* Main title */}
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.45 }}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          color: 'var(--text-primary)',
          marginBottom: '0.6rem',
          lineHeight: 1.1,
        }}
      >
        {title}
      </motion.h1>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28, duration: 0.45 }}
          style={{
            fontSize: '1.05rem',
            color: 'var(--text-muted)',
            maxWidth: '560px',
          }}
        >
          {subtitle}
        </motion.p>
      )}

      {/* Decorative separator */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.38, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{
          transformOrigin: 'left',
          height: '1px',
          marginTop: '1.5rem',
          background: `linear-gradient(90deg, ${accentColor}40, transparent)`,
          maxWidth: '400px',
        }}
      />
    </header>
  );
}
