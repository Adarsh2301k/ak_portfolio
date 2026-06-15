/**
 * EngineRoom.jsx  —  /engine-room
 *
 * Features:
 *  · Dark mechanical grid background with SVG gear decorations in corners
 *  · Skill categories as tabs (Languages / ML-AI / Infrastructure / Frontend / Data)
 *  · Animated skill bars that fill sequentially on tab open
 *  · Stats row (years, projects, PRs, coffee)
 *  · Entry animation handled by ZoneTransition (iris open overlay)
 *  · Fully responsive — tabs collapse to horizontal scroll on mobile
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Code2, Layout, Server, Database, Wrench, Star, Layers, Activity, Crosshair } from 'lucide-react';
import ZoneHeader from '../components/ZoneHeader';
import { skillCategories, stats } from '../data/skills';

const ACCENT = 'var(--accent-blue)';
const RGB    = 'var(--rgb-blue)';

/* ─── Category mapping (colors & icons) ────────────────────────────────── */
const CAT_META = {
  languages: { color: 'var(--accent-teal)',   rgb: 'var(--rgb-teal)',   icon: Code2 },
  frontend:  { color: 'var(--accent-amber)',  rgb: 'var(--rgb-amber)',  icon: Layout },
  backend:   { color: 'var(--accent-blue)',   rgb: 'var(--rgb-blue)',   icon: Server },
  databases: { color: 'var(--accent-green)',  rgb: 'var(--rgb-green)',  icon: Database },
  tools:     { color: 'var(--accent-purple)', rgb: 'var(--rgb-purple)', icon: Wrench },
};

function getCatMeta(id) {
  return CAT_META[id] ?? { color: ACCENT, rgb: RGB, icon: Layers };
}

/* ─── Corner gear SVG ────────────────────────────────────────────────────── */
function GearSVG({ size = 120, style = {} }) {
  const teeth = 12, r1 = 42, r2 = 50, inner = 22;
  const pts = [];
  for (let i = 0; i < teeth * 2; i++) {
    const angle = (i * Math.PI) / teeth;
    const r = i % 2 === 0 ? r2 : r1;
    pts.push(`${50 + r * Math.cos(angle)},${50 + r * Math.sin(angle)}`);
  }
  return (
    <svg
      width={size} height={size} viewBox="0 0 100 100"
      style={{ ...style, pointerEvents: 'none', overflow: 'visible' }}
      aria-hidden
    >
      <polygon points={pts.join(' ')} fill="none" stroke="rgba(96,165,250,0.07)" strokeWidth="1" />
      <circle cx="50" cy="50" r={inner} fill="none" stroke="rgba(96,165,250,0.07)" strokeWidth="1" />
      <circle cx="50" cy="50" r="6" fill="rgba(96,165,250,0.05)" />
    </svg>
  );
}

/* ─── Skill Chip ──────────────────────────────────────────────────────────── */
function SkillChip({ skill, color, rgb, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '1rem 1.4rem',
        background: hovered ? `rgba(${rgb}, 0.15)` : 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(0,0,0,0.2))',
        backdropFilter: 'blur(12px)',
        border: `1px solid rgba(${rgb}, ${hovered ? '0.6' : '0.2'})`,
        borderRadius: 'var(--radius-md)',
        cursor: 'default',
        display: 'flex', alignItems: 'center', gap: '12px',
        boxShadow: hovered ? `0 0 24px rgba(${rgb}, 0.25), inset 0 0 12px rgba(${rgb}, 0.15)` : '0 6px 16px rgba(0,0,0,0.3)',
        transition: 'all 0.25s ease',
      }}
    >
      {/* Active dot indicator */}
      <span style={{ 
        width: '6px', height: '6px', borderRadius: '50%', 
        background: hovered ? color : `rgba(${rgb}, 0.3)`,
        boxShadow: hovered ? `0 0 10px ${color}` : 'none',
        transition: 'all 0.25s ease'
      }} />
      <span style={{ 
        fontFamily: 'var(--font-mono)', fontSize: '0.85rem', 
        color: hovered ? '#FFF' : 'var(--text-primary)',
        letterSpacing: '0.04em',
        transition: 'color 0.25s ease'
      }}>
        {skill.name}
      </span>
    </motion.div>
  );
}



/* ─── EngineRoom page ────────────────────────────────────────────────────── */
export default function EngineRoom() {
  const [activeId, setActiveId] = useState(skillCategories[0].id);
  const [animKey, setAnimKey]   = useState(0);
  const active = skillCategories.find((c) => c.id === activeId);
  const { color, rgb, icon: ActiveIcon } = getCatMeta(activeId);

  const selectCat = (id) => {
    setActiveId(id);
    setAnimKey((k) => k + 1); // re-trigger bar animations
  };

  return (
    <main
      className="zone-page"
      style={{
        background: 'var(--bg-deep)',
        backgroundImage: `
          linear-gradient(rgba(96,165,250,0.022) 1px, transparent 1px),
          linear-gradient(90deg, rgba(96,165,250,0.022) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
        position: 'relative', overflow: 'hidden', minHeight: '100vh',
      }}
    >
      {/* Gear decorations */}
      <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <motion.div
          style={{ position: 'absolute', top: '-30px', right: '-30px' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        >
          <GearSVG size={200} />
        </motion.div>
        <motion.div
          style={{ position: 'absolute', bottom: '-40px', left: '-40px' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
        >
          <GearSVG size={260} />
        </motion.div>
        <motion.div
          style={{ position: 'absolute', top: '40%', right: '8%' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        >
          <GearSVG size={80} />
        </motion.div>
        {/* Blue ambient glow */}
        <div style={{
          position: 'absolute', top: '-5%', left: '20%',
          width: '60vw', height: '40vw', maxWidth: '700px',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${RGB},0.045) 0%, transparent 65%)`,
          filter: 'blur(60px)',
        }} />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <ZoneHeader
          zone="🛠️  ZONE · ENGINE ROOM"
          title="Engine Room"
          subtitle="The tools, languages, and systems currently active and powering the machine."
          accentColor={ACCENT}
        />

        {/* System Terminal Readout (Fills the Void) */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: color,
            letterSpacing: '0.15em', marginBottom: '2.5rem', display: 'flex', gap: '2rem',
            opacity: 0.6,
          }}
        >
          <span>&gt; SYS_BOOT // SECURE</span>
          <span>&gt; UPLINK: ESTABLISHED</span>
          <span>&gt; PROTOCOLS: ACTIVE</span>
        </motion.div>

        {/* Main layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'clamp(170px, 22%, 240px) 1fr',
          gap: '1.25rem',
          alignItems: 'start',
        }}>
          {/* ── Category sidebar ── */}
          <nav
            aria-label="Skill categories"
            style={{
              background: 'rgba(10,14,26,0.8)',
              backdropFilter: 'blur(14px)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 'var(--radius-md)',
              padding: '0.5rem',
              position: 'sticky', top: '1.5rem',
            }}
          >
            {skillCategories.map((cat) => {
              const isAct = cat.id === activeId;
              const cc = getCatMeta(cat.id);
              return (
                <motion.button
                  key={cat.id}
                  id={`cat-${cat.id}`}
                  onClick={() => selectCat(cat.id)}
                  whileHover={{ x: 2 }}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none', cursor: 'pointer',
                    background: isAct ? `rgba(${cc.rgb},0.1)` : 'transparent',
                    color: isAct ? cc.color : 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                    letterSpacing: '0.04em',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    transition: 'background 0.2s ease, color 0.2s ease',
                    borderLeft: isAct ? `2px solid ${cc.color}` : '2px solid transparent',
                    marginBottom: '2px',
                    position: 'relative',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <cc.icon size={16} />
                  </span>
                  {cat.label}
                  {isAct && (
                    <motion.span
                      layoutId="cat-active"
                      style={{
                        position: 'absolute', left: 0, top: 0, bottom: 0,
                        width: '100%', borderRadius: 'var(--radius-sm)',
                        background: `rgba(${cc.rgb},0.07)`,
                        zIndex: -1,
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* ── Skill bars panel ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeId}-${animKey}`}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.28 }}
              style={{
                background: 'rgba(10,14,26,0.8)',
                backdropFilter: 'blur(14px)',
                border: `1px solid rgba(${getCatMeta(activeId).rgb},0.12)`,
                borderRadius: 'var(--radius-md)',
                padding: 'clamp(1.25rem, 3vw, 2rem)',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Vertical Scanning Laser */}
              <motion.div
                initial={{ left: '-10%', opacity: 0 }}
                animate={{ left: '110%', opacity: [0, 1, 1, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                style={{
                  position: 'absolute', top: 0, bottom: 0, width: '2px',
                  background: `linear-gradient(180deg, transparent, ${color}, transparent)`,
                  boxShadow: `0 0 20px ${color}`,
                  zIndex: 10, pointerEvents: 'none',
                }}
              />

              {/* Decorative Hex Dump (Fills right side) */}
              <div style={{
                position: 'absolute', right: '1.5rem', top: '1.5rem', bottom: '1.5rem',
                width: '140px', overflow: 'hidden', pointerEvents: 'none',
                fontFamily: 'var(--font-mono)', fontSize: '0.5rem', lineHeight: 1.6,
                color: `rgba(${getCatMeta(activeId).rgb}, 0.15)`, textAlign: 'right',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
              }}>
                {Array.from({length: 20}).map((_, i) => (
                  <div key={i}>{Math.random().toString(16).substring(2, 10).toUpperCase()} {Math.random().toString(16).substring(2, 6).toUpperCase()}</div>
                ))}
              </div>

              {/* Panel header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.75rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', color: color }}>
                  <ActiveIcon size={24} />
                </span>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color }}>
                    {active.label}
                  </h2>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                    {active.skills.length} ACTIVE PROTOCOLS
                  </p>
                </div>
              </div>

              {/* Chips Grid */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 20 }}>
                {active.skills.map((skill, i) => (
                  <SkillChip
                    key={skill.name}
                    skill={skill}
                    color={color}
                    rgb={getCatMeta(activeId).rgb}
                    index={i}
                  />
                ))}
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile: horizontal tab scroll override */}
        <style>{`
          @media (max-width: 640px) {
            .zone-page > div > div:last-child {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </main>
  );
}
