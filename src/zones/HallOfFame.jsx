/**
 * HallOfFame.jsx  —  /hall-of-fame
 *
 * Features:
 *  · Canvas gold-particle shimmer background
 *  · Trophy shelf: top 3 gold-tier achievements in elevated feature cards
 *  · Full vertical timeline of all milestones below
 *  · Entry animation handled by ZoneTransition (gold spotlight sweep)
 *  · Fully mobile responsive
 */

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ZoneHeader from '../components/ZoneHeader';
import { achievements, tierColors } from '../data/achievements';

const GOLD = '#FFD700';

/* ─── Gold particle canvas ───────────────────────────────────────────────── */
function GoldParticles() {
  const ref = useRef(null);
  const raf = useRef(null);
  const pts = useRef([]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      initPts();
    };

    const initPts = () => {
      const n = Math.max(Math.floor((canvas.width * canvas.height) / 18000), 20);
      pts.current = Array.from({ length: n }, () => ({
        x:     Math.random() * canvas.width,
        y:     Math.random() * canvas.height,
        r:     Math.random() * 1.8 + 0.4,
        speed: Math.random() * 0.28 + 0.06,
        drift: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.5 + 0.08,
        flick: Math.random() * Math.PI * 2,
        flickSpeed: Math.random() * 0.018 + 0.006,
        // Occasional diamond shapes
        diamond: Math.random() < 0.15,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.current.forEach((p) => {
        p.flick += p.flickSpeed;
        const a = p.alpha * (0.5 + 0.5 * Math.sin(p.flick));

        if (p.diamond) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(Math.PI / 4);
          ctx.fillStyle = `rgba(255,215,0,${a * 0.7})`;
          const s = p.r * 1.8;
          ctx.fillRect(-s / 2, -s / 2, s, s);
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,215,0,${a})`;
          ctx.fill();
        }

        p.y -= p.speed;
        p.x += p.drift;
        if (p.y + p.r < 0) { p.y = canvas.height + p.r; p.x = Math.random() * canvas.width; }
      });
      raf.current = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize, { passive: true });
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas ref={ref} aria-hidden style={{
      position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', display: 'block',
    }} />
  );
}

/* ─── Trophy shelf card (gold tier) ─────────────────────────────────────── */
const TROPHY_V = {
  hidden:  { opacity: 0, y: 32, scale: 0.94 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 180, damping: 20, delay: i * 0.12 },
  }),
};

function TrophyCard({ ach, index }) {
  const [hovered, setHovered] = useState(false);
  const tc = tierColors.gold;
  // Centre card is elevated
  const isCentre = index === 1;

  return (
    <motion.article
      id={`trophy-${ach.id}`}
      custom={index}
      variants={TROPHY_V}
      whileHover={{ y: isCentre ? -10 : -6 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: hovered
          ? 'rgba(255,215,0,0.06)'
          : 'rgba(12,10,4,0.85)',
        backdropFilter: 'blur(16px)',
        border: `1px solid rgba(255,215,0,${hovered ? '0.4' : '0.18'})`,
        borderRadius: 'var(--radius-lg)',
        padding: isCentre ? '2.25rem 1.75rem' : '1.75rem 1.5rem',
        overflow: 'hidden',
        transform: isCentre ? 'translateY(-12px)' : 'none',
        boxShadow: hovered
          ? '0 16px 60px rgba(255,215,0,0.22), 0 0 0 1px rgba(255,215,0,0.22), inset 0 1px 0 rgba(255,215,0,0.1)'
          : isCentre
          ? '0 8px 40px rgba(255,215,0,0.14), inset 0 1px 0 rgba(255,215,0,0.06)'
          : '0 4px 20px rgba(0,0,0,0.4)',
        transition: 'background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
      }}
    >
      {/* Gold corner glow */}
      <span aria-hidden style={{
        position: 'absolute', top: 0, right: 0, width: '140px', height: '140px',
        borderRadius: '0 var(--radius-lg) 0 100%',
        background: `radial-gradient(ellipse at 85% 15%, rgba(255,215,0,${hovered ? '0.16' : '0.08'}), transparent 65%)`,
        pointerEvents: 'none',
        transition: 'opacity 0.3s ease',
      }} />

      {/* Background emoji watermark */}
      <span aria-hidden style={{
        position: 'absolute', bottom: '-10px', right: '-5px',
        fontSize: '5rem', opacity: 0.06, lineHeight: 1, pointerEvents: 'none',
      }}>
        {ach.icon}
      </span>

      <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>{ach.icon}</div>

      {/* Category tag */}
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
        color: GOLD, letterSpacing: '0.1em',
        background: 'rgba(255,215,0,0.08)',
        border: '1px solid rgba(255,215,0,0.25)',
        borderRadius: '100px', padding: '2px 10px',
        marginBottom: '0.75rem',
      }}>
        🥇 {ach.category}
      </span>

      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: isCentre ? '1.15rem' : '1rem',
        color: hovered ? GOLD : 'var(--text-primary)',
        marginBottom: '0.3rem', lineHeight: 1.2,
        transition: 'color 0.25s ease',
      }}>
        {ach.title}
      </h3>
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
        color: GOLD, opacity: 0.75, letterSpacing: '0.04em',
        marginBottom: '0.85rem',
      }}>
        {ach.subtitle}
      </p>
      <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
        {ach.description}
      </p>

      {/* Year */}
      <div style={{
        marginTop: '1rem',
        fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
        color: 'var(--text-muted)', letterSpacing: '0.1em',
      }}>
        {ach.year}
      </div>
    </motion.article>
  );
}

/* ─── Timeline item ──────────────────────────────────────────────────────── */
const TL_V = {
  hidden:  { opacity: 0, x: -24 },
  visible: (i) => ({
    opacity: 1, x: 0,
    transition: { type: 'spring', stiffness: 150, damping: 22, delay: i * 0.09 },
  }),
};

function TimelineItem({ ach, index }) {
  const [hovered, setHovered] = useState(false);
  const tc = tierColors[ach.tier];

  return (
    <motion.div
      id={`timeline-${ach.id}`}
      custom={index}
      variants={TL_V}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '80px 1px 1fr',
        gap: '0 1.5rem',
        alignItems: 'start',
        position: 'relative',
      }}
    >
      {/* Year */}
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
        color: tc.text, letterSpacing: '0.08em', paddingTop: '6px',
        textAlign: 'right', opacity: 0.85,
      }}>
        {ach.year}
      </div>

      {/* Vertical line + dot */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: '50%',
          width: '1px', background: 'rgba(255,255,255,0.06)',
          transform: 'translateX(-50%)',
        }} />
        <motion.div
          animate={{
            boxShadow: hovered ? `0 0 12px ${tc.text}, 0 0 24px ${tc.text}60` : 'none',
            scale: hovered ? 1.4 : 1,
          }}
          transition={{ duration: 0.2 }}
          style={{
            width: '11px', height: '11px', borderRadius: '50%',
            background: tc.text, zIndex: 1, marginTop: '5px', flexShrink: 0,
            border: `2px solid rgba(0,0,0,0.5)`,
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        animate={{
          borderColor: hovered ? `${tc.text}35` : 'rgba(255,255,255,0.05)',
          background: hovered ? `${tc.glow}` : 'rgba(12,10,20,0.6)',
        }}
        transition={{ duration: 0.22 }}
        style={{
          background: 'rgba(12,10,20,0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          marginBottom: '1.25rem',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{ach.icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '4px' }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: tc.text,
                letterSpacing: '0.1em',
                background: `${tc.glow}`,
                border: `1px solid ${tc.border}`,
                borderRadius: '100px', padding: '1px 8px',
              }}>
                {ach.tier.toUpperCase()} · {ach.category}
              </span>
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontSize: '0.95rem',
              color: hovered ? tc.text : 'var(--text-primary)',
              marginBottom: '2px', transition: 'color 0.22s ease',
            }}>
              {ach.title}
            </h3>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: tc.text, opacity: 0.7, marginBottom: '6px' }}>
              {ach.subtitle}
            </p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.58 }}>
              {ach.description}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── HallOfFame page ────────────────────────────────────────────────────── */
export default function HallOfFame() {
  const goldAchs = achievements.filter((a) => a.tier === 'gold');
  const allSorted = [...achievements].sort((a, b) => {
    const tierOrder = { gold: 0, silver: 1, bronze: 2 };
    return tierOrder[a.tier] - tierOrder[b.tier] || b.year - a.year;
  });

  return (
    <>
      <GoldParticles />

      <main
        className="zone-page"
        style={{
          background: 'linear-gradient(160deg, #080418 0%, #0A0612 40%, var(--bg-deep) 100%)',
          position: 'relative', minHeight: '100vh', overflow: 'hidden',
        }}
      >
        {/* Ambient gold bloom */}
        <div aria-hidden style={{
          position: 'fixed', top: '-10%', left: '50%', transform: 'translateX(-50%)',
          width: '70vw', height: '50vw', maxWidth: '900px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255,215,0,0.065) 0%, transparent 60%)',
          filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <ZoneHeader
            zone="🏆  ZONE · HALL OF FAME"
            title="Hall of Fame"
            subtitle="Wins, recognitions, and milestones — every one earned."
            accentColor={GOLD}
          />

          {/* ── Trophy Shelf ── */}
          <section aria-label="Featured achievements" style={{ marginBottom: '3.5rem' }}>
            <motion.div
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                color: GOLD, letterSpacing: '0.18em', opacity: 0.65,
                marginBottom: '1.5rem',
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.65, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              ══ TROPHY SHELF ══
            </motion.div>

            <motion.div
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
              initial="hidden"
              animate="visible"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'clamp(0.75rem, 2vw, 1.5rem)',
                alignItems: 'end',
              }}
            >
              {goldAchs.map((a, i) => (
                <TrophyCard key={a.id} ach={a} index={i} />
              ))}
            </motion.div>

            {/* Shelf plank */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
              style={{
                height: '8px',
                background: 'linear-gradient(90deg, rgba(255,215,0,0.02), rgba(255,215,0,0.18), rgba(255,215,0,0.06), rgba(255,215,0,0.02))',
                borderRadius: '0 0 3px 3px',
                boxShadow: '0 4px 24px rgba(255,215,0,0.14)',
                transformOrigin: 'left',
                marginTop: '0',
              }}
            />
          </section>

          {/* ── Full Timeline ── */}
          <section aria-label="All achievements timeline">
            <motion.div
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                color: GOLD, letterSpacing: '0.18em', opacity: 0.65,
                marginBottom: '2rem',
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.65, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              ══ FULL TIMELINE ══
            </motion.div>

            <motion.div
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}
              initial="hidden"
              animate="visible"
            >
              {allSorted.map((a, i) => (
                <TimelineItem key={a.id} ach={a} index={i} />
              ))}
            </motion.div>
          </section>
        </div>
      </main>
    </>
  );
}
