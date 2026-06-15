/**
 * Hangar.jsx  —  /hangar
 *
 * Entry animation handled by ZoneTransition (amber scan beam overlay).
 * Zone renders its content directly with staggered card animations.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, AlertCircle, Lightbulb, Calendar, Star } from 'lucide-react';
import ZoneHeader from '../components/ZoneHeader';
import { projects } from '../data/projects';

/* ─── Constants ──────────────────────────────────────────────────────────── */
const ACCENT   = 'var(--accent-amber)';
const RGB      = 'var(--rgb-amber)';

const STATUS_META = {
  shipped:  { label: 'Shipped',  color: 'var(--accent-green)',  rgb: 'var(--rgb-green)'  },
  beta:     { label: 'Beta',     color: 'var(--accent-blue)',   rgb: 'var(--rgb-blue)'   },
  research: { label: 'Research', color: 'var(--accent-purple)', rgb: 'var(--rgb-purple)' },
};

const CATEGORIES = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

/* ─── (ScanEntry removed — handled by ZoneTransition) ─────────────────── */
/* (entry overlay removed — ZoneTransition handles it) */

/* ─── Project Card ───────────────────────────────────────────────────────── */
const CARD_VARIANTS = {
  hidden:  { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 180, damping: 22 },
  },
};

function ProjectCard({ project }) {
  const [hovered, setHovered]   = useState(false);
  const [expanded, setExpanded] = useState(false);
  const sm = STATUS_META[project.status] ?? STATUS_META.shipped;

  return (
    <motion.article
      id={`card-${project.id}`}
      variants={CARD_VARIANTS}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: hovered
          ? `rgba(${RGB}, 0.04)`
          : 'rgba(15, 22, 38, 0.7)',
        backdropFilter: 'blur(16px)',
        border: `1px solid rgba(${RGB}, ${hovered ? '0.4' : '0.1'})`,
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        cursor: 'default',
        overflow: 'hidden',
        transition: 'background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 16px 48px rgba(${RGB}, 0.18), 0 0 0 1px rgba(${RGB}, 0.2), inset 0 1px 0 rgba(${RGB}, 0.08)`
          : '0 4px 16px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
      }}
    >
      {/* Corner gradient */}
      <span aria-hidden style={{
        position: 'absolute', top: 0, right: 0,
        width: '160px', height: '160px',
        borderRadius: '0 var(--radius-lg) 0 100%',
        background: `radial-gradient(ellipse at 90% 10%, rgba(${RGB}, ${hovered ? '0.14' : '0.05'}), transparent 65%)`,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
      }} />

      {/* Highlight badge */}
      {project.highlight && (
        <span style={{
          position: 'absolute', top: '1rem', right: '1rem',
          display: 'flex', alignItems: 'center', gap: '4px',
          fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
          color: ACCENT, letterSpacing: '0.1em',
        }}>
          <Star size={10} fill="currentColor" /> FEATURED
        </span>
      )}

      {/* ── Header ── */}
      <div style={{ marginBottom: '0.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
          {/* Status pill */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
            color: sm.color, letterSpacing: '0.1em',
            background: `rgba(${sm.rgb}, 0.08)`,
            border: `1px solid rgba(${sm.rgb}, 0.25)`,
            borderRadius: '100px', padding: '2px 10px',
          }}>
            <span style={{
              width: '5px', height: '5px', borderRadius: '50%',
              background: sm.color, display: 'inline-block',
              boxShadow: hovered ? `0 0 6px ${sm.color}` : 'none',
            }} />
            {sm.label}
          </span>
          {/* Year */}
          <span style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)',
          }}>
            <Calendar size={10} /> {project.year}
          </span>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.2rem, 2.5vw, 1.45rem)',
          color: hovered ? ACCENT : 'var(--text-primary)',
          marginBottom: '0.3rem',
          transition: 'color 0.25s ease',
          lineHeight: 1.2,
        }}>
          {project.title}
        </h2>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
          color: ACCENT, opacity: 0.75, letterSpacing: '0.04em',
        }}>
          {project.tagline}
        </p>
      </div>

      {/* ── Divider ── */}
      <div style={{
        height: '1px', margin: '1rem 0',
        background: `linear-gradient(90deg, rgba(${RGB}, ${hovered ? '0.3' : '0.1'}), transparent)`,
        transition: 'opacity 0.3s ease',
      }} />

      {/* ── Problem → Solution ── */}
      <div style={{ marginBottom: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
            color: 'var(--danger)', letterSpacing: '0.12em', marginBottom: '0.3rem',
          }}>
            <AlertCircle size={10} /> PROBLEM
          </div>
          <p style={{ fontSize: '0.845rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {project.problem}
          </p>
        </div>
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
            color: 'var(--accent-teal)', letterSpacing: '0.12em', marginBottom: '0.3rem',
          }}>
            <Lightbulb size={10} /> SOLUTION
          </div>
          <p style={{ fontSize: '0.845rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
            {project.solution}
          </p>
        </div>
      </div>

      {/* ── Tech stack ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.4rem' }}>
        {project.stack.map((tech) => (
          <span key={tech} style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            padding: '3px 10px', borderRadius: '100px',
            border: `1px solid rgba(${RGB}, ${hovered ? '0.4' : '0.18'})`,
            color: ACCENT,
            background: `rgba(${RGB}, ${hovered ? '0.07' : '0.03'})`,
            letterSpacing: '0.04em',
            transition: 'border-color 0.25s ease, background 0.25s ease',
          }}>
            {tech}
          </span>
        ))}
      </div>

      {/* ── Action links ── */}
      <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', flexWrap: 'wrap' }}>
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            id={`github-${project.id}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
              padding: '7px 16px', borderRadius: '100px',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'var(--text-muted)',
              background: 'rgba(255,255,255,0.04)',
              transition: 'all 0.2s ease', letterSpacing: '0.06em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            }}
          >
            <Github size={13} /> GitHub
          </a>
        )}
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noreferrer"
            id={`demo-${project.id}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
              padding: '7px 16px', borderRadius: '100px',
              border: `1px solid rgba(${RGB}, 0.4)`,
              color: ACCENT,
              background: `rgba(${RGB}, 0.08)`,
              transition: 'all 0.2s ease', letterSpacing: '0.06em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `rgba(${RGB}, 0.15)`;
              e.currentTarget.style.boxShadow = `0 0 16px rgba(${RGB}, 0.25)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `rgba(${RGB}, 0.08)`;
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <ExternalLink size={13} /> Live Demo
          </a>
        )}
      </div>
    </motion.article>
  );
}

/* ─── Filter tabs ────────────────────────────────────────────────────────── */
function FilterTabs({ active, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Filter by category"
      style={{
        display: 'flex', flexWrap: 'wrap', gap: '8px',
        marginBottom: '2.5rem',
      }}
    >
      {CATEGORIES.map((cat) => {
        const isActive = cat === active;
        return (
          <motion.button
            key={cat}
            role="tab"
            id={`filter-tab-${cat.toLowerCase().replace(/[^a-z]/g, '-')}`}
            aria-selected={isActive}
            onClick={() => onChange(cat)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              padding: '6px 16px',
              borderRadius: '100px',
              border: `1px solid rgba(${RGB}, ${isActive ? '0.5' : '0.15'})`,
              background: isActive ? `rgba(${RGB}, 0.12)` : 'transparent',
              color: isActive ? ACCENT : 'var(--text-muted)',
              cursor: 'pointer',
              letterSpacing: '0.06em',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {isActive && (
              <motion.span
                layoutId="filter-active-pill"
                style={{
                  position: 'absolute', inset: 0,
                  borderRadius: '100px',
                  background: `rgba(${RGB}, 0.1)`,
                  zIndex: 0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 1 }}>{cat}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ─── Hangar Page ────────────────────────────────────────────────────────── */
const GRID_VARIANTS = {
  hidden:  {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

export default function Hangar() {
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All'
    ? projects
    : projects.filter((p) => p.category === filter);

  return (
    <>
      {/* Main content */}
      <main
        className="zone-page"
        style={{
          background: 'var(--bg-deep)',
          backgroundImage: `
            linear-gradient(rgba(${RGB}, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(${RGB}, 0.025) 1px, transparent 1px)
          `,
          backgroundSize: '52px 52px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient glow */}
        <div aria-hidden style={{
          position: 'fixed', bottom: '-10%', right: '-5%',
          width: '50vw', height: '50vw', maxWidth: '600px', maxHeight: '600px',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${RGB}, 0.05) 0%, transparent 65%)`,
          filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <ZoneHeader
            zone="🚀  ZONE · HANGAR"
            title="Project Hangar"
            subtitle="Systems built, shipped, and running in production. Every card is a problem that needed solving."
            accentColor={ACCENT}
          />



          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.35 }}
          >
            <FilterTabs active={filter} onChange={setFilter} />
          </motion.div>

          {/* Card grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              variants={GRID_VARIANTS}
              initial="hidden"
              animate="visible"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))',
                gap: '1.35rem',
              }}
            >
              {filtered.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4rem' }}
            >
              No projects in this category yet.
            </motion.p>
          )}
        </div>
      </main>
    </>
  );
}

