/**
 * HubMap.jsx — Central navigation hub.
 *
 * UPGRADED:
 *  · Animated radar sweep SVG behind portals
 *  · Typewriter cycling role text in hero
 *  · Portal cards: persistent soft ambient glow (not just on hover)
 *  · Portal pulse rings that emanate periodically (idle)
 *  · Hex grid SVG overlay on the background
 *  · Bottom status bar: live clock + fake coords
 *  · Mobile: 2-column grid
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Rocket, Wrench, BookOpen, BrainCircuit, Trophy, Radio, User } from 'lucide-react';
import IronManHUD from './IronManHUD';

/* Row 1: Hangar, Engine Room, Library */
/* Row 2: AI Lab, Hall of Fame, Control Room, About */
const PORTALS_ROW1 = [
  { id: 'hangar',      path: '/hangar',      icon: Rocket,       label: 'Hangar',      desc: 'Major Projects',    tooltip: 'Full-stack & ML systems shipped to production.', colorVar: '--accent-amber',  rgbVar: '--rgb-amber'  },
  { id: 'engine-room', path: '/engine-room', icon: Wrench,       label: 'Engine Room', desc: 'Skills & Tech Stack', tooltip: 'Proficiency bars, language breakdowns, and tools.', colorVar: '--accent-blue',   rgbVar: '--rgb-blue'   },
  { id: 'hall-of-fame', path: '/hall-of-fame', icon: Trophy,       label: 'Hall of Fame', desc: 'Achievements',     tooltip: 'Competitions won, papers published, awards earned.', colorVar: '--accent-purple', rgbVar: '--rgb-purple' },
];

const PORTALS_ROW2 = [
  { id: 'library',     path: '/library',     icon: BookOpen,     label: 'Library',     desc: 'Books & Learnings', tooltip: 'Books that rewired my thinking, with key takeaways.', colorVar: '--accent-gold',   rgbVar: '--rgb-gold'   },
  { id: 'ai-lab',       path: '/ai-lab',       icon: BrainCircuit, label: 'Experiments',       desc: 'Labs & Activities',   tooltip: 'Live ML experiments, models, and research notes.', colorVar: '--accent-teal',   rgbVar: '--rgb-teal'   },
  { id: 'about',        path: '/about',        icon: User,         label: 'About',        desc: 'The Person',       tooltip: 'The story behind the builder.', colorVar: '--accent-blue',   rgbVar: '--rgb-blue'   },
  { id: 'control-room', path: '/control-room', icon: Radio,        label: 'Control Room', desc: 'Contact & Résumé',  tooltip: 'Links, channels, and the mission briefing.', colorVar: '--accent-green',  rgbVar: '--rgb-green'  },
];

const PORTALS = [...PORTALS_ROW1, ...PORTALS_ROW2];

const ROLES = [
  'Software Engineer',
  'Full Stack Developer',
  'Frontend Specialist',
  'Backend Developer',
  'Problem Solver',
];

/* ─────────────────────────────────────────────────────────────────────────────
   Starfield canvas
───────────────────────────────────────────────────────────────────────────── */
function StarField() {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const starsRef  = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      const count = Math.floor((canvas.width * canvas.height) / 4500);
      starsRef.current = Array.from({ length: count }, () => ({
        x:     Math.random() * canvas.width,
        y:     Math.random() * canvas.height,
        r:     Math.random() * 1.5 + 0.2,
        speed: Math.random() * 0.08 + 0.01,
        opacity: Math.random() * 0.65 + 0.1,
        flicker: Math.random() * Math.PI * 2,
        flickerSpeed: Math.random() * 0.012 + 0.004,
        hue: Math.random() < 0.1
          ? ['180deg','200deg','45deg','280deg'][Math.floor(Math.random()*4)]
          : null,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      starsRef.current.forEach((s) => {
        s.flicker += s.flickerSpeed;
        const alpha = s.opacity * (0.55 + 0.45 * Math.sin(s.flicker));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.hue
          ? `hsla(${s.hue}, 90%, 80%, ${alpha})`
          : `rgba(232, 234, 240, ${alpha})`;
        ctx.fill();
        s.y -= s.speed;
        if (s.y + s.r < 0) { s.y = canvas.height + s.r; s.x = Math.random() * canvas.width; }
      });
      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize, { passive: true });
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas ref={canvasRef} aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', display: 'block' }} />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Radar sweep SVG
───────────────────────────────────────────────────────────────────────────── */
function RadarSweep() {
  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        width="900" height="900"
        viewBox="0 0 900 900"
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', maxWidth: '100vw', maxHeight: '100vh' }}
      >
        <defs>
          {/* Sweep gradient */}
          <radialGradient id="sweep-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(0,255,209,0.0)" />
            <stop offset="85%"  stopColor="rgba(0,255,209,0.0)" />
            <stop offset="100%" stopColor="rgba(0,255,209,0.09)" />
          </radialGradient>
          {/* Sector fill */}
          <radialGradient id="sector-fill" cx="0%" cy="0%" r="100%">
            <stop offset="0%"   stopColor="rgba(0,255,209,0.09)" />
            <stop offset="100%" stopColor="rgba(0,255,209,0.0)" />
          </radialGradient>
        </defs>

        {/* Concentric circles */}
        {[120, 230, 340, 450].map((r) => (
          <circle key={r} cx="450" cy="450" r={r} fill="none" stroke="rgba(0,255,209,0.05)" strokeWidth="1" />
        ))}
        {/* Cross hairs */}
        <line x1="450" y1="10" x2="450" y2="890" stroke="rgba(0,255,209,0.04)" strokeWidth="1" />
        <line x1="10" y1="450" x2="890" y2="450" stroke="rgba(0,255,209,0.04)" strokeWidth="1" />

        {/* Rotating sweep arm */}
        <motion.g
          style={{ transformOrigin: '450px 450px' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          {/* Sweep wedge */}
          <path
            d="M450,450 L450,5 A445,445 0 0,1 829,245 Z"
            fill="url(#sector-fill)"
            opacity="0.7"
          />
          {/* Leading edge line */}
          <line x1="450" y1="450" x2="450" y2="5" stroke="rgba(0,255,209,0.35)" strokeWidth="1.5" />
        </motion.g>

        {/* Static blip dots */}
        {[
          { cx: 530, cy: 290, r: 2.5, delay: 1.2 },
          { cx: 340, cy: 380, r: 2, delay: 2.8 },
          { cx: 610, cy: 490, r: 3, delay: 0.4 },
          { cx: 290, cy: 550, r: 2, delay: 3.5 },
          { cx: 580, cy: 600, r: 2.5, delay: 1.8 },
        ].map((b, i) => (
          <motion.circle
            key={i} cx={b.cx} cy={b.cy} r={b.r}
            fill="rgba(0,255,209,0.7)"
            animate={{ opacity: [0, 1, 0.6, 0], scale: [0.5, 1.4, 1, 0.5] }}
            transition={{ duration: 2.5, delay: b.delay, repeat: Infinity, ease: 'easeOut' }}
            style={{ transformOrigin: `${b.cx}px ${b.cy}px` }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Hex grid overlay
───────────────────────────────────────────────────────────────────────────── */
function HexGrid() {
  // Lightweight CSS hex grid via repeating SVG pattern
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34L28 66zM28 100L0 84V50l28-16 28 16v34L28 100z' fill='none' stroke='rgba(0,255,209,0.028)' stroke-width='1'/%3E%3C/svg%3E")`,
        backgroundSize: '56px 100px',
        opacity: 1,
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Portal Card (upgraded)
───────────────────────────────────────────────────────────────────────────── */
const CARD_VARIANTS = {
  hidden:  { opacity: 0, scale: 0.76, y: 28 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
};

function PortalCard({ portal, index }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [pressed,  setPressed]  = useState(false);
  const [pulse,    setPulse]    = useState(false);

  const color  = `var(${portal.colorVar})`;
  const rgbRaw = `var(${portal.rgbVar})`;

  // Idle pulse ring every N seconds
  useEffect(() => {
    const jitter = index * 800 + 1200;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        setPulse(true);
        setTimeout(() => setPulse(false), 1000);
      }, 4000 + index * 600);
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
      return () => clearInterval(iv);
    }, jitter);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <motion.div variants={CARD_VARIANTS} style={{ position: 'relative' }}>
      {/* ── Idle pulse ring ── */}
      <AnimatePresence>
        {pulse && !hovered && (
          <motion.span
            key="pulse"
            aria-hidden
            initial={{ opacity: 0.6, scale: 0.85 }}
            animate={{ opacity: 0, scale: 1.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            style={{
              position: 'absolute', inset: 0,
              borderRadius: 'var(--radius-lg)',
              border: `1px solid ${color}`,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Tooltip ── */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="tip"
            initial={{ opacity: 0, y: 10, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.16 }}
            style={{
              position: 'absolute', bottom: 'calc(100% + 12px)', left: '50%',
              transform: 'translateX(-50%)', zIndex: 20,
              whiteSpace: 'nowrap', maxWidth: '260px',
              background: 'rgba(6,10,22,0.95)',
              border: `1px solid rgba(${rgbRaw}, 0.35)`,
              borderRadius: 'var(--radius-sm)', padding: '7px 14px',
              fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
              color: color, letterSpacing: '0.03em',
              boxShadow: `0 6px 28px rgba(${rgbRaw}, 0.22)`,
              pointerEvents: 'none', textAlign: 'center',
            }}
          >
            {portal.tooltip}
            <span style={{
              position: 'absolute', bottom: '-5px', left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: '9px', height: '9px',
              background: 'rgba(6,10,22,0.95)',
              borderRight: `1px solid rgba(${rgbRaw}, 0.35)`,
              borderBottom: `1px solid rgba(${rgbRaw}, 0.35)`,
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Card button ── */}
      <motion.button
        id={`portal-${portal.id}`}
        onClick={() => navigate(portal.path)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setPressed(false); }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        animate={{
          scale: pressed ? 0.93 : hovered ? 1.055 : 1,
          y: hovered ? -7 : 0,
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        style={{
          position: 'relative', width: '100%',
          background: hovered
            ? `rgba(${rgbRaw}, 0.07)`
            : 'rgba(12, 18, 34, 0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid rgba(${rgbRaw}, ${hovered ? '0.5' : '0.18'})`,
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem 1.5rem 1.5rem',
          cursor: 'pointer', overflow: 'hidden',
          boxShadow: hovered
            ? `0 0 0 1px rgba(${rgbRaw}, 0.28),
               0 12px 48px rgba(${rgbRaw}, 0.26),
               0 0 100px rgba(${rgbRaw}, 0.1),
               inset 0 1px 0 rgba(${rgbRaw}, 0.14)`
            : `0 2px 16px rgba(0,0,0,0.4),
               0 0 0 0px rgba(${rgbRaw}, 0),
               inset 0 1px 0 rgba(255,255,255,0.03)`,
          transition: 'background 0.25s ease, border-color 0.25s ease, box-shadow 0.3s ease',
          textAlign: 'left',
          zIndex: 1,
        }}
      >
        {/* Ambient top-right glow */}
        <span aria-hidden style={{
          position: 'absolute', top: 0, right: 0,
          width: '130px', height: '130px',
          borderRadius: '0 var(--radius-lg) 0 100%',
          background: `radial-gradient(ellipse at 85% 15%, rgba(${rgbRaw}, ${hovered ? '0.22' : '0.1'}), transparent 65%)`,
          transition: 'opacity 0.3s ease', pointerEvents: 'none',
        }} />

        {/* Ambient bottom glow — persistent */}
        <span aria-hidden style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
          background: `radial-gradient(ellipse at 50% 100%, rgba(${rgbRaw}, 0.05), transparent 70%)`,
          pointerEvents: 'none',
        }} />

        {/* Spinning orbit rings */}
        <span aria-hidden style={{
          position: 'absolute', top: '-30px', right: '-30px',
          width: '100px', height: '100px', borderRadius: '50%',
          border: `1px solid rgba(${rgbRaw}, ${hovered ? '0.32' : '0.08'})`,
          animation: hovered ? 'orbit-spin 5s linear infinite' : 'none',
          transition: 'border-color 0.3s ease', pointerEvents: 'none',
        }} />
        <span aria-hidden style={{
          position: 'absolute', top: '-16px', right: '-16px',
          width: '65px', height: '65px', borderRadius: '50%',
          border: `1px dashed rgba(${rgbRaw}, ${hovered ? '0.22' : '0.05'})`,
          animation: hovered ? 'orbit-spin 8s linear infinite reverse' : 'none',
          transition: 'border-color 0.3s ease', pointerEvents: 'none',
        }} />

        {/* Zone index */}
        <span style={{
          position: 'absolute', top: '1rem', right: '1.1rem',
          fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
          color: color, opacity: hovered ? 0.8 : 0.35,
          letterSpacing: '0.12em', transition: 'opacity 0.25s ease',
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Icon */}
        <motion.div
          animate={{ scale: hovered ? 1.15 : 1, rotate: hovered ? [0, -6, 4, 0] : 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 16 }}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '1rem', color: color,
            filter: hovered ? `drop-shadow(0 0 12px rgba(${rgbRaw}, 0.8))` : `drop-shadow(0 0 4px rgba(${rgbRaw}, 0.2))`,
            transition: 'filter 0.25s ease, color 0.25s ease',
          }}
        >
          <portal.icon size={28} strokeWidth={1.5} />
        </motion.div>

        {/* Label */}
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: '1.15rem',
          color: hovered ? color : 'var(--text-primary)',
          marginBottom: '0.3rem', transition: 'color 0.25s ease',
          letterSpacing: '-0.01em',
        }}>
          {portal.label}
        </h2>

        {/* Desc */}
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
          color: hovered ? color : 'var(--text-muted)',
          letterSpacing: '0.06em', opacity: hovered ? 0.9 : 0.65,
          transition: 'color 0.25s ease, opacity 0.25s ease',
          marginBottom: '1.2rem',
        }}>
          {portal.desc}
        </p>

        {/* CTA */}
        <motion.span
          animate={{ x: hovered ? 5 : 0, opacity: hovered ? 1 : 0.4 }}
          transition={{ duration: 0.2 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            color: color, letterSpacing: '0.1em',
          }}
        >
          <span>ENTER ZONE</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5h6M6 3l2 2-2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      </motion.button>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Typewriter role cycler
───────────────────────────────────────────────────────────────────────────── */
function TypewriterRole() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting]   = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const target = ROLES[roleIdx];

    if (!deleting && displayed.length < target.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplayed(target.slice(0, displayed.length + 1));
      }, 55);
    } else if (!deleting && displayed.length === target.length) {
      timeoutRef.current = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeoutRef.current = setTimeout(() => {
        setDisplayed(displayed.slice(0, -1));
      }, 28);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setRoleIdx((i) => (i + 1) % ROLES.length);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [displayed, deleting, roleIdx]);

  return (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
      color: 'var(--accent-teal)',
      letterSpacing: '0.04em',
    }}>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        style={{
          display: 'inline-block', width: '2px', height: '1.1em',
          background: 'var(--accent-teal)', marginLeft: '2px',
          verticalAlign: 'text-bottom',
        }}
      />
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Live status bar (bottom)
───────────────────────────────────────────────────────────────────────────── */
function StatusBar() {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString('en-GB', { hour12: false }));

  useEffect(() => {
    const iv = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 0.6 }}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '1.5rem', flexWrap: 'wrap',
        marginTop: 'clamp(2rem, 4vh, 3.5rem)',
        paddingTop: '1.25rem',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {[
        { label: 'STATUS', value: 'ONLINE', color: 'var(--accent-green)' },
        { label: 'UTC',    value: time,     color: 'var(--accent-teal)'  },
        { label: 'LAT',    value: '12.97°N',color: 'var(--text-muted)'  },
        { label: 'LNG',    value: '77.59°E',color: 'var(--text-muted)'  },
        { label: 'BUILD',  value: 'v1.0.0', color: 'var(--text-muted)'  },
      ].map(({ label, value, color }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--text-muted)', letterSpacing: '0.14em', opacity: 0.55 }}>
            {label}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color, letterSpacing: '0.08em' }}>
            {value}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Hero
───────────────────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
      style={{
        textAlign: 'center', marginBottom: '3rem', position: 'relative', zIndex: 2,
        // Soft dark halo to ensure text readability without breaking background-clip
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(5,13,15,0.7) 0%, transparent 100%)',
        padding: '2rem', borderRadius: '50%',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.12, duration: 0.45 }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(0,255,209,0.06)',
          border: '1px solid rgba(0,255,209,0.2)',
          borderRadius: '100px', padding: '6px 18px',
          marginBottom: '1.4rem',
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
          color: 'var(--accent-teal)', letterSpacing: '0.15em',
        }}
      >
        <motion.span
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-teal)', display: 'inline-block' }}
        />
        Ghaziabad, India · Open to remote
      </motion.div>

      {/* Name */}
      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.2rem, 5vw, 4rem)',
          lineHeight: 1.04, letterSpacing: '-0.03em',
          background: 'linear-gradient(135deg, var(--text-primary) 25%, var(--accent-teal) 75%, var(--accent-amber) 115%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          marginBottom: '0.7rem',
        }}
      >
        Adarsh Kesharwani
      </motion.h1>



      {/* Typewriter role */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        style={{ marginBottom: '0.9rem', minHeight: '1.5rem' }}
      >
        <TypewriterRole />
      </motion.div>

      {/* Scroll hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.65 }}
        transition={{ delay: 0.55, duration: 0.6 }}
        style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
          color: 'var(--text-muted)', letterSpacing: '0.1em', opacity: 0.6,
        }}
      >
        <motion.span
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ display: 'inline-block' }}
        >
          ↓
        </motion.span>
        {' '}Choose a zone to explore
      </motion.p>
    </motion.div>
  );
}



/* ─────────────────────────────────────────────────────────────────────────────
   HubMap Root
───────────────────────────────────────────────────────────────────────────── */
const GRID_VARIANTS = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.48 } },
};

export default function HubMap() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-deep)', position: 'relative', overflowX: 'hidden' }}>
      {/* Layer 0: stars */}
      <StarField />

      {/* Layer 1: hex grid + radar */}
      <HexGrid />
      <RadarSweep />

      {/* Layer 2: ambient colour orbs */}
      <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-10%', left: '-8%',
          width: '60vw', height: '60vw', maxWidth: '700px', maxHeight: '700px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(var(--rgb-teal), 0.06) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-12%', right: '-8%',
          width: '55vw', height: '55vw', maxWidth: '650px', maxHeight: '650px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(var(--rgb-amber), 0.055) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', top: '35%', left: '35%',
          width: '40vw', height: '40vw', maxWidth: '500px', maxHeight: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(var(--rgb-purple), 0.032) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }} />
      </div>

      {/* Layer 3: content */}
      <div style={{
        position: 'relative', zIndex: 2, minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(3rem, 6vh, 5rem) clamp(1.25rem, 4vw, 3rem)',
      }}>
        {/* HUD sits behind the hero text, but its interactive parts stay clickable */}
        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <IronManHUD />
          <Hero />
        </div>

        {/* Portal grid — 3 top, 4 bottom */}
        <motion.div
          variants={GRID_VARIANTS} initial="hidden" animate="visible"
          style={{ width: '100%', maxWidth: '980px' }}
        >
          {/* Row 1 — 3 cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 'clamp(0.85rem, 2vw, 1.4rem)',
            marginBottom: 'clamp(0.85rem, 2vw, 1.4rem)',
          }}>
            {PORTALS_ROW1.map((p, i) => (
              <PortalCard key={p.id} portal={p} index={i} />
            ))}
          </div>

          {/* Row 2 — 4 cards, no offset */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: 'clamp(0.85rem, 2vw, 1.4rem)',
          }}>
            {PORTALS_ROW2.map((p, i) => (
              <PortalCard key={p.id} portal={p} index={i + 3} />
            ))}
          </div>
        </motion.div>

        {/* Status bar */}
        <StatusBar />
      </div>

      {/* Mobile grid override */}
      <style>{`
        @media (max-width: 600px) {
          #hubmap-grid, #hubmap-grid > div > div {
            grid-template-columns: repeat(2, 1fr) !important;
            padding-left: 0 !important;
          }
        }
        @keyframes orbit-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
