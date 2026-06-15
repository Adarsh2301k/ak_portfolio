/**
 * About.jsx  —  /about
 * Personal story zone — who you are, not what you've built.
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ZoneHeader from '../components/ZoneHeader';

const ACCENT = 'var(--accent-teal)';

const STORY = [
  {
    year: '2026',
    title: 'Capgemini Analyst',
    body: `Selected through campus recruitment for an Analyst role at Capgemini. Completed intensive enterprise training covering Java, SQL, Spring Boot, REST APIs, and full-stack backend development.`,
  },
  {
    year: '2022 – 2026',
    title: 'B.Tech in Computer Science',
    body: `Studying at ABES Engineering College, Ghaziabad. Deep dived into Data Structures & Algorithms, OOPs, DBMS, and Software Engineering. Maintained a 7.76 CGPA while leading technical workshops.`,
  },
  {
    year: '2021',
    title: 'Intermediate',
    body: `Completed 12th grade at Vishnu Bhagwan Public School, Prayagraj, scoring 83.0%. Built a strong foundation in core sciences that naturally transitioned into computer science.`,
  },
  {
    year: '2019',
    title: 'Matriculation',
    body: `Completed 10th grade at Vishnu Bhagwan Public School, Prayagraj, scoring 85.16%.`,
  },
];

const ABOUT_TEXT = [
  `I'm Adarsh Kesharwani, a software engineer passionate about building products that solve real problems.`,
  `My journey started with curiosity—wanting to understand how technology works—and gradually evolved into creating full-stack applications using modern web technologies.`,
  `I enjoy turning ideas into working software, learning through projects, and continuously improving my craft. Whether it's exploring AI, backend systems, or frontend experiences, I believe the best way to learn is by building.`,
  `Outside of coding, I'm interested in books, self-improvement, and documenting what I learn. I'm always looking for opportunities to grow as an engineer and as a person.`,
  `Still learning. Still building.`
];



const ITEM_V = {
  hidden:  { opacity: 0, x: -20 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.1, type: 'spring', stiffness: 150, damping: 20 } }),
};

export default function About() {
  const navigate = useNavigate();

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') navigate('/'); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [navigate]);

  return (
    <main
      className="zone-page"
      style={{
        background: 'linear-gradient(160deg, #050D0F 0%, #070C14 50%, var(--bg-deep) 100%)',
        minHeight: '100vh', position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div aria-hidden style={{
        position: 'fixed', top: '-10%', left: '30%',
        width: '60vw', height: '60vw', maxWidth: '800px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,255,209,0.04) 0%, transparent 65%)',
        filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Holographic Security Profile (User Image) */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 0.15, x: 0 }}
        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        aria-hidden
        style={{
          position: 'fixed', bottom: '8%', right: '-8%',
          width: '65vw', maxWidth: '750px', height: '100vh',
          pointerEvents: 'none', zIndex: 0,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
        }}
      >
        <img
          src="/profile.png"
          alt=""
          style={{
            width: '100%', maxHeight: '95vh', objectFit: 'contain', objectPosition: 'bottom right',
            filter: 'grayscale(100%) sepia(1) hue-rotate(130deg) saturate(300%) brightness(0.9) contrast(1.4)',
            maskImage: 'linear-gradient(to top, transparent 0%, black 15%)',
            WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 15%)',
            mixBlendMode: 'screen',
          }}
        />
        {/* CRT Scanline mask over the image */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.6) 2px, rgba(0,0,0,0.6) 4px)',
        }} />
      </motion.div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <ZoneHeader
          zone="👤  ZONE · ABOUT"
          title="The Journey"
          subtitle="Education, experience, and the path so far."
          accentColor={ACCENT}
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))',
          gap: '3rem',
          alignItems: 'start',
        }}>

          {/* ── Left: Timeline ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: ACCENT, letterSpacing: '0.18em', opacity: 0.7, marginBottom: '1.5rem' }}
            >
              ══ TIMELINE ══
            </motion.div>

            <motion.div
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
              initial="hidden" animate="visible"
              style={{ display: 'flex', flexDirection: 'column', gap: 0 }}
            >
              {STORY.map((s, i) => (
                <motion.div
                  key={s.year}
                  custom={i}
                  variants={ITEM_V}
                  style={{ display: 'grid', gridTemplateColumns: '80px 1px 1fr', gap: '0 1.25rem', alignItems: 'start' }}
                >
                  {/* Year */}
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                    color: ACCENT, opacity: 0.75, paddingTop: '6px',
                    textAlign: 'right', letterSpacing: '0.06em',
                  }}>
                    {s.year}
                  </div>

                  {/* Line + dot */}
                  <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                      position: 'absolute', top: 0, bottom: 0,
                      width: '1px', background: 'rgba(0,255,209,0.12)',
                    }} />
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: ACCENT, zIndex: 1, marginTop: '7px', flexShrink: 0,
                      boxShadow: `0 0 8px var(--accent-teal)`,
                    }} />
                  </div>

                  {/* Content */}
                  <div style={{ paddingBottom: '1.75rem' }}>
                    <div style={{
                      fontFamily: 'var(--font-display)', fontSize: '0.95rem',
                      color: 'var(--text-primary)', marginBottom: '0.4rem',
                    }}>
                      {s.title}
                    </div>
                    <p style={{
                      fontSize: '0.86rem', color: 'var(--text-muted)',
                      lineHeight: 1.7,
                    }}>
                      {s.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Beliefs + Fun facts ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

            {/* Narrative */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: ACCENT, letterSpacing: '0.18em', opacity: 0.7, marginBottom: '1.25rem' }}>
                ══ THE NARRATIVE ══
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', position: 'relative', paddingLeft: '1.5rem' }}>
                {/* Decorative left border line */}
                <div style={{
                  position: 'absolute', left: 0, top: '4px', bottom: '4px', width: '2px',
                  background: 'linear-gradient(to bottom, var(--accent-teal), transparent)',
                  opacity: 0.3, borderRadius: '4px'
                }} />

                {ABOUT_TEXT.map((p, i) => {
                  const isFirst = i === 0;
                  const isLast = i === ABOUT_TEXT.length - 1;
                  
                  return (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      style={{
                        fontSize: isFirst ? '1.05rem' : isLast ? '1rem' : '0.92rem',
                        color: isFirst ? 'var(--text-primary)' : isLast ? ACCENT : 'var(--text-muted)',
                        lineHeight: 1.7,
                        fontWeight: isLast ? 600 : 400,
                        fontStyle: isLast ? 'italic' : 'normal',
                      }}
                    >
                      {p}
                    </motion.p>
                  );
                })}
              </div>
            </motion.div>



          </div>
        </div>
      </div>
    </main>
  );
}
