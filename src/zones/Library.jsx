import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ZoneHeader from '../components/ZoneHeader';
import BackToHub from '../components/BackToHub';
import { books } from '../data/books';

const ACCENT = 'var(--accent-teal)';

/* ─── Star rating ────────────────────────────────────────────────────────── */
function Stars({ rating, color = '#FFD700' }) {
  return (
    <span style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14}
          color={i < rating ? color : 'rgba(255,255,255,0.1)'}
          fill={i < rating ? color : 'none'}
        />
      ))}
    </span>
  );
}

/* ─── Single book spine (on the shelf) ───────────────────────────────────── */
function BookSpine({ book, isActive, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      layoutId={`book-container-${book.id}`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: `${book.spineWidth * 1.3}px`,
        height: 'clamp(220px, 30vh, 280px)',
        position: 'relative',
        background: `linear-gradient(180deg, ${book.color}ee 0%, ${book.color}aa 40%, ${book.color}dd 100%)`,
        borderRadius: '3px 8px 8px 3px',
        border: isActive ? `2px solid #FFF` : `1px solid ${book.color}80`,
        boxShadow: isActive
          ? `0 0 25px ${book.color}90, 0 10px 20px rgba(0,0,0,0.8), inset 2px 0 5px rgba(255,255,255,0.2)`
          : hovered
          ? `0 -5px 25px ${book.color}60, 0 15px 30px rgba(0,0,0,0.8), inset 2px 0 5px rgba(255,255,255,0.2)`
          : `inset 2px 0 5px rgba(255,255,255,0.1), 0 5px 15px rgba(0,0,0,0.6)`,
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transformOrigin: 'bottom',
        zIndex: isActive ? 10 : hovered ? 5 : 1,
      }}
      initial={{ y: 0, scale: 1 }}
      animate={{ y: isActive ? -25 : hovered ? -15 : 0, scale: isActive ? 1.05 : hovered ? 1.02 : 1 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
    >
      {/* Spine Crease */}
      <span aria-hidden style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '6px', background: 'linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0))' }} />
      <span aria-hidden style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.2)' }} />
      <span aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'rgba(255,255,255,0.3)', borderRadius: '0 4px 0 0' }} />
      <span aria-hidden style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'rgba(0,0,0,0.4)' }} />

      <span style={{
        writingMode: 'vertical-rl',
        transform: 'rotate(180deg)',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)',
        color: 'rgba(0,0,0,0.75)',
        letterSpacing: '0.05em',
        padding: '15px 0',
      }}>
        {book.shortTitle}
      </span>
      {book.rating === 5 && (
        <span style={{ position: 'absolute', bottom: '12px', fontSize: '0.55rem', color: 'rgba(0,0,0,0.5)' }}>★★★★★</span>
      )}
    </motion.button>
  );
}

/* ─── Open Book View ─────────────────────────────────────────────────────── */
function OpenBookView({ book, onClose }) {
  return (
    <motion.div
      layoutId={`book-container-${book.id}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      style={{
        width: '100%', maxWidth: '850px', 
        height: '100%', maxHeight: '550px', minHeight: '350px',
        background: 'rgba(10,12,16,0.85)',
        backdropFilter: 'blur(20px)',
        borderRadius: '12px',
        border: `1px solid ${book.color}40`,
        boxShadow: `0 20px 50px rgba(0,0,0,0.8), 0 0 40px ${book.color}20`,
        display: 'flex',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: '15px', right: '15px', zIndex: 10,
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
          borderRadius: '50%', width: '32px', height: '32px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)', cursor: 'pointer'
        }}
      >
        <X size={16} />
      </button>

      {/* Left Page */}
      <div className="custom-scroll" style={{
        flex: 1, padding: '2.5rem',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        background: `linear-gradient(to right, transparent, rgba(255,255,255,0.02))`,
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '80px', height: '120px', background: book.color,
            borderRadius: '4px 8px 8px 4px', boxShadow: '5px 5px 15px rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
             <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#000', fontWeight: 'bold' }}>{book.shortTitle}</span>
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#FFF', lineHeight: 1.2, marginBottom: '0.3rem' }}>{book.title}</h2>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: book.color }}>{book.author}</p>
            <div style={{ marginTop: '0.5rem' }}><Stars rating={book.rating} color={book.color} /></div>
            <span style={{
              display: 'inline-block', marginTop: '0.5rem',
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
              padding: '2px 8px', borderRadius: '100px', border: `1px solid ${book.color}40`, color: book.color
            }}>
              {book.category}
            </span>
          </div>
        </div>
        
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: book.color, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>WHY I READ IT</div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>{book.whyIRead}</p>
      </div>

      {/* Right Page */}
      <div className="custom-scroll" style={{
        flex: 1, padding: '2.5rem',
        background: `linear-gradient(to left, transparent, rgba(255,255,255,0.02))`,
        overflowY: 'auto'
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: book.color, letterSpacing: '0.1em', marginBottom: '1rem' }}>WHAT I LEARNED</div>
        <ul style={{ listStyleType: 'square', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
          {book.takeaways.map((t, i) => (
            <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.6, paddingLeft: '0.5rem' }}>{t}</li>
          ))}
        </ul>

        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: `2px solid ${book.color}`, marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>"{book.favoriteQuote}"</p>
        </div>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: book.color, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>MY TAKE</div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: 'auto' }}>{book.recommendation}</p>

        {/* Personal Note */}
        <div style={{
          marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)',
          fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.05em'
        }}>
          Every book in this archive has influenced the way I think, build, or live.
        </div>
      </div>

    </motion.div>
  );
}


/* ─── Library page ───────────────────────────────────────────────────────── */
export default function Library() {
  const [activeId, setActiveId] = useState(null);
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(books.map((b) => b.category)))];
  const filtered = filter === 'All' ? books : books.filter((b) => b.category === filter);
  const activeBook = books.find((b) => b.id === activeId) ?? null;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveId(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="library-layout">

      {/* ─── LEFT PANEL (Stats & Filters) ─── */}
      <div className="library-left hide-scroll">
        <ZoneHeader
          zone="📚  ZONE · LIBRARY"
          title="The Archive"
          subtitle="Books that shaped my thinking."
          accentColor={ACCENT}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: ACCENT, letterSpacing: '0.1em' }}>KNOWLEDGE ARCHIVE</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: '#FFF', lineHeight: 1 }}>{books.filter(b => b.status === 'read').length}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginTop: '4px' }}>BOOKS READ</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#FFF', lineHeight: 1 }}>{books.filter(b => b.status === 'reading').length}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginTop: '4px' }}>CURRENTLY READING</div>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(0,255,209,0.5)', fontStyle: 'italic', marginTop: '0.5rem' }}>
            Library grows with every book.
          </div>
        </div>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: ACCENT, letterSpacing: '0.1em', marginBottom: '1rem' }}>CATEGORIES</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setFilter(cat); setActiveId(null); }}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                padding: '6px 14px', borderRadius: '100px',
                background: filter === cat ? 'rgba(0,255,209,0.1)' : 'transparent',
                border: `1px solid ${filter === cat ? ACCENT : 'rgba(255,255,255,0.1)'}`,
                color: filter === cat ? ACCENT : 'var(--text-muted)',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ─── RIGHT PANEL (Bookshelf & Reader) ─── */}
      <div className="library-right">
        
        {/* Book Display Area */}
        <div className="library-reader-container">
          <AnimatePresence mode="wait">
            {activeBook ? (
              <OpenBookView key="open-book" book={activeBook} onClose={() => setActiveId(null)} />
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}
              >
                [ Every book tells a story. Choose one to explore. ]
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bookshelf Container */}
        <div style={{ width: '100%', marginBottom: '0' }}>
          <div style={{
            display: 'flex', alignItems: 'flex-end', gap: '12px',
            width: '100%', height: 'clamp(260px, 35vh, 320px)',
            borderBottom: '8px solid #111',
            padding: '0 4rem', overflowX: 'auto',
          }} className="custom-scroll">
            <AnimatePresence>
              {filtered.map(book => (
                <BookSpine
                  key={book.id}
                  book={book}
                  isActive={activeId === book.id}
                  onClick={() => setActiveId(activeId === book.id ? null : book.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
