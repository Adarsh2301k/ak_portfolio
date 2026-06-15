/**
 * Now.jsx  —  /now
 *
 * A personal "what I'm doing right now" page.
 * Inspired by nownownow.com — a living document, not a resume.
 *
 * Update this page whenever life changes. Keep it honest.
 * Replace all the [bracketed] placeholders with your real content.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, RefreshCw } from 'lucide-react';

/* ─── Last updated date — change this when you update the page ─────────── */
const LAST_UPDATED = 'June 2025';
const LOCATION     = 'Bangalore, India';

/* ─── Page sections — all deeply personal, replace with YOUR stuff ──────── */
const SECTIONS = [
  {
    id: 'building',
    emoji: '🔨',
    heading: 'Building',
    color: '#00FFD1',
    content: [
      {
        type: 'text',
        body: `A sparse fine-tuning framework for LLMs that cuts adapter size by 60% with almost no accuracy loss. I've been obsessing over it for three months and it's finally doing the thing it was supposed to do on week one.`,
      },
      {
        type: 'text',
        body: `Also slowly turning this portfolio into something that actually feels like me — starting by removing all the corporate jargon I put in when I first built it.`,
      },
    ],
  },
  {
    id: 'thinking',
    emoji: '🌀',
    heading: 'Thinking About',
    color: '#A78BFA',
    content: [
      {
        type: 'text',
        body: `Whether "agentic AI" is genuinely new or just old planning algorithms with better prose. The more I read, the more I think we're mostly rebranding constraint satisfaction problems with cooler names.`,
      },
      {
        type: 'quote',
        body: `"The purpose of computing is insight, not numbers."`,
        author: 'Richard Hamming',
      },
    ],
  },
  {
    id: 'reading',
    emoji: '📖',
    heading: 'Reading',
    color: '#FFB347',
    content: [
      {
        type: 'book',
        title: 'Category Theory for Programmers',
        author: 'Bartosz Milewski',
        note: 'Slowly. Very slowly. But I think it\'s making me a better programmer even though I still can\'t explain what a monad is at a dinner party.',
      },
      {
        type: 'book',
        title: 'Gödel, Escher, Bach',
        author: 'Douglas Hofstadter',
        note: 'Re-reading. The strange loops chapter hits differently now that I work on self-referential AI systems for a living.',
      },
    ],
  },
  {
    id: 'listening',
    emoji: '🎧',
    heading: 'Listening To',
    color: '#F87171',
    content: [
      {
        type: 'text',
        body: `A lot of Ólafur Arnalds when coding. Something about piano + ambient electronics makes my brain produce fewer bugs. I have no scientific explanation for this.`,
      },
      {
        type: 'text',
        body: `Also the Lex Fridman podcast when walking — specifically the John Carmack episode, which I've listened to three times now.`,
      },
    ],
  },
  {
    id: 'obsessed',
    emoji: '🔭',
    heading: 'Obsessed With',
    color: '#34D399',
    content: [
      {
        type: 'text',
        body: `Mechanistic interpretability. The idea that we can literally reverse-engineer what a neural network "thinks" is one of the wildest things happening in AI right now and barely anyone outside the field is talking about it.`,
      },
    ],
  },
  {
    id: 'not-doing',
    emoji: '🚫',
    heading: 'Deliberately Not Doing',
    color: '#60A5FA',
    content: [
      {
        type: 'text',
        body: `Starting new side projects for the sake of having something to put on a resume. I have enough unfinished GitHub repos. I'm finishing things this year.`,
      },
      {
        type: 'text',
        body: `Chasing every new model release. GPT-5 will come out. I'll read the paper. Then I'll go back to whatever I was building.`,
      },
    ],
  },
  {
    id: 'random',
    emoji: '🎲',
    heading: 'Something I Learned This Week',
    color: '#FBBF24',
    content: [
      {
        type: 'text',
        body: `Octopuses have three hearts and blue blood. Two hearts pump blood to the gills; one pumps it to the body. The body heart stops when they swim, which is why they prefer crawling. I have no idea why I find this deeply relatable.`,
      },
    ],
  },
];

/* ─── Content block renderers ────────────────────────────────────────────── */
function TextBlock({ body }) {
  return (
    <p style={{
      fontSize: '0.96rem',
      color: 'var(--text-primary)',
      lineHeight: 1.8,
      fontFamily: 'var(--font-body)',
    }}>
      {body}
    </p>
  );
}

function QuoteBlock({ body, author }) {
  return (
    <blockquote style={{
      borderLeft: '3px solid rgba(167,139,250,0.5)',
      paddingLeft: '1.25rem',
      margin: '0.5rem 0',
    }}>
      <p style={{
        fontSize: '1.05rem', fontStyle: 'italic',
        color: 'var(--text-primary)', lineHeight: 1.7,
        marginBottom: '0.4rem',
      }}>
        {body}
      </p>
      {author && (
        <footer style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
          color: 'var(--text-muted)', letterSpacing: '0.08em',
        }}>
          — {author}
        </footer>
      )}
    </blockquote>
  );
}

function BookBlock({ title, author, note }) {
  return (
    <div style={{
      background: 'rgba(255,179,71,0.04)',
      border: '1px solid rgba(255,179,71,0.12)',
      borderRadius: '10px',
      padding: '0.9rem 1.1rem',
    }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
        {title}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent-amber)', marginBottom: '0.6rem' }}>
        {author}
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
        {note}
      </p>
    </div>
  );
}

function ContentBlock({ block }) {
  if (block.type === 'quote') return <QuoteBlock {...block} />;
  if (block.type === 'book')  return <BookBlock {...block} />;
  return <TextBlock {...block} />;
}

/* ─── Section card ───────────────────────────────────────────────────────── */
const CARD_V = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 160, damping: 22, delay: i * 0.08 },
  }),
};

function NowSection({ section, index }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.section
      id={`now-${section.id}`}
      custom={index}
      variants={CARD_V}
      style={{
        background: 'rgba(10,14,26,0.55)',
        border: `1px solid rgba(255,255,255,0.07)`,
        borderTop: `2px solid ${section.color}50`,
        borderRadius: '14px',
        overflow: 'hidden',
      }}
    >
      {/* Section header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          width: '100%', textAlign: 'left',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.1rem 1.4rem',
          background: 'none', border: 'none', cursor: 'pointer',
          borderBottom: expanded ? '1px solid rgba(255,255,255,0.05)' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.3rem' }}>{section.emoji}</span>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '1.05rem',
            color: 'var(--text-primary)',
          }}>
            {section.heading}
          </span>
        </div>
        <motion.span
          animate={{ rotate: expanded ? 0 : -90 }}
          transition={{ duration: 0.2 }}
          style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}
        >
          ▾
        </motion.span>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '1.1rem 1.4rem 1.4rem',
              display: 'flex', flexDirection: 'column', gap: '1rem',
            }}>
              {section.content.map((block, i) => (
                <ContentBlock key={i} block={block} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

/* ─── Now page ───────────────────────────────────────────────────────────── */
export default function Now() {
  const navigate = useNavigate();

  // ESC → hub
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') navigate('/'); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [navigate]);

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0A0E1A 0%, #080C18 100%)',
      padding: 'clamp(2rem, 5vw, 4rem) clamp(1.25rem, 5vw, 3rem)',
      maxWidth: '720px',
      margin: '0 auto',
    }}>
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        onClick={() => navigate('/')}
        id="now-back-hub"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '7px',
          fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
          color: 'var(--text-muted)', letterSpacing: '0.08em',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '100px', padding: '7px 16px',
          cursor: 'pointer', marginBottom: '3rem',
        }}
      >
        <ArrowLeft size={13} /> Hub
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.5 }}
        style={{ marginBottom: '2.5rem' }}
      >
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 6vw, 3rem)',
          color: 'var(--text-primary)',
          letterSpacing: '-0.03em',
          marginBottom: '0.6rem',
          lineHeight: 1.1,
        }}>
          What I'm doing <span style={{ color: 'var(--accent-teal)' }}>now</span>
        </h1>

        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.95rem',
          color: 'var(--text-muted)', lineHeight: 1.7,
          marginBottom: '1rem',
        }}>
          This is a <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--accent-teal)', textDecoration: 'none' }}
          >now page</a> — a snapshot of what's actually going on in my life, not a polished resume bullet. Updated roughly monthly. Ruthlessly honest.
        </p>

        {/* Meta */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
            color: 'var(--text-muted)', letterSpacing: '0.1em',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            📍 {LOCATION}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
            color: 'var(--text-muted)', letterSpacing: '0.1em',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <RefreshCw size={11} /> Updated {LAST_UPDATED}
          </span>
        </div>
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.5, ease: [0.4,0,0.2,1] }}
        style={{
          height: '1px',
          background: 'linear-gradient(90deg, var(--accent-teal), rgba(0,255,209,0.1), transparent)',
          marginBottom: '2rem',
          transformOrigin: 'left',
        }}
      />

      {/* Sections */}
      <motion.div
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}
        initial="hidden"
        animate="visible"
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        {SECTIONS.map((s, i) => (
          <NowSection key={s.id} section={s} index={i} />
        ))}
      </motion.div>

      {/* Footer note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{
          marginTop: '3rem', paddingTop: '2rem',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', flexDirection: 'column', gap: '0.75rem',
        }}
      >
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.88rem',
          color: 'var(--text-muted)', lineHeight: 1.7,
          fontStyle: 'italic',
        }}>
          If you're reading this and have thoughts on anything above — I genuinely want to hear them. Not just "great work" pleasantries. Actual pushback, questions, or weird ideas welcome.
        </p>
        <button
          onClick={() => navigate('/control-room')}
          id="now-contact-cta"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
            color: 'var(--accent-teal)', letterSpacing: '0.08em',
            background: 'rgba(0,255,209,0.06)',
            border: '1px solid rgba(0,255,209,0.2)',
            borderRadius: '100px', padding: '8px 18px',
            cursor: 'pointer', width: 'fit-content',
          }}
        >
          Say hello <ArrowUpRight size={13} />
        </button>
      </motion.div>
    </main>
  );
}
