/**
 * ControlRoom.jsx  —  /control-room
 *
 * Features:
 *  · Glitch/static entry effect (0.5s) that resolves into phosphor-green terminal UI
 *  · Blinking cursor "> ESTABLISHING CONNECTION..." header sequence
 *  · "Transmission line" contact info rows (email, LinkedIn, GitHub)
 *  · Terminal-style contact form with phosphor inputs
 *  · "TRANSMISSION SENT ✓" success animation on submit
 *  · Glowing green resume download button
 *  · Drifting phosphor scanline overlay for CRT feel
 *  · Mobile responsive
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Github, Linkedin, Mail, FileDown, Radio, Send, Terminal, Code2 } from 'lucide-react';
import ZoneHeader from '../components/ZoneHeader';

/* ─── Design constants ───────────────────────────────────────────────────── */
const PH       = 'var(--phosphor)';          // #00FF41
const PH_DIM   = 'var(--phosphor-dim)';      // #00C832
const BG_TERM  = '#020D02';                  // near-black with green tint
const BG_PANE  = 'rgba(2, 20, 2, 0.85)';

/* ─── (GlitchEntry removed — handled by ZoneTransition) ─────────────── */

/* ─── Blinking cursor ────────────────────────────────────────────────────── */
function Cursor() {
  return (
    <span
      className="animate-term-cursor"
      aria-hidden
      style={{
        display: 'inline-block',
        width: '9px', height: '1.1em',
        background: PH,
        boxShadow: `0 0 6px ${PH}`,
        verticalAlign: 'text-bottom',
        marginLeft: '2px',
      }}
    />
  );
}

/* ─── Typewriter hook ─────────────────────────────────────────────────────── */
function useTypewriter(text, { delay = 0, speed = 38 } = {}) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone]           = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayed('');
    setDone(false);
    const start = setTimeout(() => {
      const id = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(id); setDone(true); }
      }, speed);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(start);
  }, [text, delay, speed]);

  return { displayed, done };
}

/* ─── Boot sequence header ───────────────────────────────────────────────── */
const BOOT_LINES = [
  { text: '> CONTROL ROOM v2.4.1 — initialising…',       delay: 200,  speed: 22 },
  { text: '> ESTABLISHING SECURE CONNECTION…',            delay: 900,  speed: 28 },
  { text: '> TRANSMISSION CHANNELS ONLINE — READY.',      delay: 1800, speed: 24 },
];

function BootLine({ text, delay, speed, isLast }) {
  const { displayed, done } = useTypewriter(text, { delay, speed });

  return (
    <div style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 'clamp(0.72rem, 1.8vw, 0.85rem)',
      color: PH,
      letterSpacing: '0.06em',
      marginBottom: isLast ? 0 : '0.35rem',
      textShadow: `0 0 8px ${PH}`,
      minHeight: '1.4em',
    }}>
      {displayed}{!done && <Cursor />}
    </div>
  );
}

function BootHeader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        background: BG_PANE,
        border: `1px solid rgba(0,255,65,0.2)`,
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* CRT scanline sweep */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
      }} />
      {BOOT_LINES.map((line, i) => (
        <BootLine key={i} {...line} isLast={i === BOOT_LINES.length - 1} />
      ))}
    </motion.div>
  );
}

/* ─── Transmission info rows ─────────────────────────────────────────────── */
const TX_LINES = [
  {
    id: 'tx-email',
    icon: Mail,
    label: 'EMAIL',
    value: 'adarsh2301k@gmail.com',
    href: 'mailto:adarsh2301k@gmail.com',
  },
  {
    id: 'tx-linkedin',
    icon: Linkedin,
    label: 'LINKEDIN',
    value: '/in/adarshkesh23',
    href: 'https://www.linkedin.com/in/adarshkesh23/',
  },
  {
    id: 'tx-github',
    icon: Github,
    label: 'GITHUB',
    value: '@adarsh2301k',
    href: 'https://github.com/adarsh2301k',
  },
  {
    id: 'tx-leetcode',
    icon: Code2,
    label: 'LEETCODE',
    value: 'leetcode.com/u/adarsh2301k',
    href: 'https://leetcode.com/u/adarsh2301k/',
  },
];

const TX_VARIANTS = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 2.4 } },
};
const TX_ITEM = {
  hidden:  { opacity: 0, x: -18 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

function TransmissionPanel() {
  return (
    <div style={{
      background: BG_PANE,
      border: `1px solid rgba(0,255,65,0.15)`,
      borderRadius: 'var(--radius-md)',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
      height: '100%',
    }}>
      {/* CRT lines */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)',
      }} />

      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
        color: PH_DIM, letterSpacing: '0.18em',
        marginBottom: '1.1rem', opacity: 0.7,
      }}>
        ╔══ OPEN CHANNELS ══
      </div>

      <motion.div
        variants={TX_VARIANTS}
        initial="hidden"
        animate="visible"
        style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
      >
        {TX_LINES.map(({ id, icon: Icon, label, value, href }) => (
          <motion.div
            key={id}
            id={id}
            variants={TX_ITEM}
            className="animate-tx-flicker"
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '0.6rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: `1px solid rgba(0,255,65,0.08)`,
              background: 'rgba(0,255,65,0.03)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <Icon size={14} color={PH} style={{ flexShrink: 0, opacity: 0.8 }} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
              color: PH_DIM, letterSpacing: '0.12em', minWidth: '80px',
              opacity: 0.7,
            }}>
              {label}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
              letterSpacing: '0.04em',
            }}>
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: PH,
                    textDecoration: 'none',
                    textShadow: `0 0 8px ${PH}`,
                    transition: 'text-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.textShadow = `0 0 16px ${PH}, 0 0 32px ${PH}`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.textShadow = `0 0 8px ${PH}`; }}
                >
                  {value}
                </a>
              ) : (
                <span style={{ color: PH, textShadow: `0 0 8px ${PH}` }}>{value}</span>
              )}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Resume download button ─────────────────────────────────────────────── */
function ResumeButton() {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    // In a real deployment, replace '#' with the actual resume PDF URL
    setTimeout(() => setClicked(false), 2200);
  };

  return (
    <motion.a
      href="/resume.pdf"
      download="Adarsh_Kesharwani_Resume.pdf"
      id="resume-download-btn"
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
        width: '100%', textDecoration: 'none',
        fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
        letterSpacing: '0.14em',
        padding: '0.9rem 2rem',
        borderRadius: 'var(--radius-md)',
        border: `1px solid rgba(0,255,65, 0.5)`,
        background: clicked ? 'rgba(0,255,65,0.18)' : 'rgba(0,255,65,0.07)',
        color: PH,
        cursor: 'pointer',
        boxShadow: `0 0 20px rgba(0,255,65,0.12), inset 0 0 20px rgba(0,255,65,0.04)`,
        transition: 'background 0.25s ease, box-shadow 0.25s ease',
        textShadow: `0 0 8px ${PH}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 32px rgba(0,255,65,0.28), 0 0 60px rgba(0,255,65,0.1), inset 0 0 20px rgba(0,255,65,0.06)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 0 20px rgba(0,255,65,0.12), inset 0 0 20px rgba(0,255,65,0.04)`;
      }}
    >
      <FileDown size={16} />
      {clicked ? '// DOWNLOADING RESUME.PDF…' : '> DOWNLOAD RESUME.PDF'}
    </motion.a>
  );
}

/* ─── Terminal input component ───────────────────────────────────────────── */
function TermInput({ id, label, value, onChange, type = 'text', as = 'input', placeholder }) {
  const [focused, setFocused] = useState(false);

  const sharedStyle = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.82rem',
    color: PH,
    caretColor: PH,
    letterSpacing: '0.03em',
    resize: 'none',
    padding: 0,
  };

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label
        htmlFor={id}
        style={{
          display: 'block',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          color: focused ? PH : PH_DIM,
          letterSpacing: '0.14em',
          marginBottom: '6px',
          textShadow: focused ? `0 0 6px ${PH}` : 'none',
          transition: 'all 0.2s ease',
        }}
      >
        {'>'} {label}:
      </label>
      <div style={{
        borderBottom: `1px solid rgba(0,255,65, ${focused ? '0.6' : '0.2'})`,
        paddingBottom: '6px',
        boxShadow: focused ? `0 2px 0 rgba(0,255,65,0.15)` : 'none',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      }}>
        {as === 'textarea' ? (
          <textarea
            id={id}
            rows={4}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              ...sharedStyle,
              '::placeholder': { color: 'rgba(0,255,65,0.2)' },
            }}
          />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={sharedStyle}
          />
        )}
      </div>
    </div>
  );
}

/* ─── Contact form ───────────────────────────────────────────────────────── */
function ContactForm() {
  const [form, setForm]       = useState({ name: '', email: '', message: '' });
  const [status, setStatus]   = useState('idle'); // idle | sending | sent | error
  const [log, setLog]         = useState([]);
  const logRef                = useRef(null);

  const set = (k) => (e) => setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const appendLog = (msg) =>
    setLog((prev) => [...prev, msg]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      appendLog('// ERR: All fields required before transmission.');
      return;
    }
    setStatus('sending');
    appendLog('// ENCODING payload…');
    await delay(400);
    appendLog('// COMPRESSING message…');
    await delay(400);
    appendLog('// TRANSMITTING via secure uplink…');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: '52a540e6-fd05-4f59-9276-f13a0c064d7c',
          name: form.name,
          email: form.email,
          message: form.message,
          subject: `Incoming Transmission from ${form.name}`,
          from_name: 'Mission Control',
        }),
      });

      const result = await response.json();

      if (result.success) {
        appendLog(`// TRANSMISSION COMPLETE — signal confirmed ✓`);
        setStatus('sent');
        setForm({ name: '', email: '', message: '' });
      } else {
        appendLog(`// ERR: Transmission rejected by server.`);
        setStatus('idle');
      }
    } catch (error) {
      appendLog(`// ERR: Connection lost. Ensure uplink is active.`);
      setStatus('idle');
    }
  };

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  return (
    <div style={{
      background: BG_PANE,
      border: `1px solid rgba(0,255,65,0.15)`,
      borderRadius: 'var(--radius-md)',
      padding: '1.75rem',
      position: 'relative', overflow: 'hidden',
      height: '100%', display: 'flex', flexDirection: 'column',
    }}>
      {/* CRT texture */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)',
      }} />

      {/* Phosphor scanline */}
      <div aria-hidden style={{
        position: 'absolute', left: 0, right: 0, height: '80px',
        background: `linear-gradient(to bottom, transparent, rgba(0,255,65,0.03), transparent)`,
        animation: 'phosphor-scanline 5s linear infinite',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
          color: PH_DIM, letterSpacing: '0.18em', marginBottom: '1.5rem',
        }}>
          <Terminal size={12} color={PH} />
          COMPOSE TRANSMISSION
        </div>

        <AnimatePresence mode="wait">
          {status === 'sent' ? (
            /* ── Success state ── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              style={{ textAlign: 'center', padding: '2rem 1rem' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ duration: 0.5, times: [0, 0.6, 1] }}
                style={{ fontSize: '2.5rem', marginBottom: '1rem' }}
              >
                ✓
              </motion.div>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.9rem',
                color: PH, letterSpacing: '0.1em',
                textShadow: `0 0 12px ${PH}`,
              }}>
                TRANSMISSION SENT ✓
              </p>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                color: PH_DIM, marginTop: '0.5rem', opacity: 0.7,
              }}>
                Signal received. Expect a reply within 24h.
              </p>
              <button
                onClick={() => { setStatus('idle'); setLog([]); }}
                style={{
                  marginTop: '1.5rem',
                  fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                  color: PH_DIM, background: 'transparent',
                  border: `1px solid rgba(0,255,65,0.2)`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 16px', cursor: 'pointer',
                  letterSpacing: '0.08em',
                }}
              >
                COMPOSE NEW
              </button>
            </motion.div>
          ) : (
            /* ── Form state ── */
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              noValidate
            >
              <TermInput
                id="ctrl-name"
                label="CALLSIGN (NAME)"
                value={form.name}
                onChange={set('name')}
                placeholder="Your name…"
              />
              <TermInput
                id="ctrl-email"
                label="RETURN ADDRESS (EMAIL)"
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="your@email.dev"
              />
              <TermInput
                id="ctrl-message"
                label="MESSAGE PAYLOAD"
                as="textarea"
                value={form.message}
                onChange={set('message')}
                placeholder="Type your message here…"
              />

              {/* Transmission log */}
              {log.length > 0 && (
                <motion.div
                  ref={logRef}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                    color: PH_DIM, lineHeight: 1.8,
                    marginBottom: '1rem',
                    maxHeight: '80px', overflowY: 'auto',
                  }}
                >
                  {log.map((l, i) => <div key={i}>{l}</div>)}
                </motion.div>
              )}

              <motion.button
                id="submit-transmission"
                type="submit"
                disabled={status === 'sending'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  width: '100%',
                  fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
                  letterSpacing: '0.12em',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid rgba(0,255,65, 0.4)`,
                  background: status === 'sending' ? 'rgba(0,255,65,0.12)' : 'rgba(0,255,65,0.06)',
                  color: PH,
                  cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                  textShadow: `0 0 6px ${PH}`,
                  transition: 'all 0.2s ease',
                }}
              >
                <Send size={14} />
                {status === 'sending' ? '// TRANSMITTING…' : '> SEND TRANSMISSION'}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* Tiny delay helper */
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/* ─── ControlRoom Page ───────────────────────────────────────────────────── */
export default function ControlRoom() {
  return (
    <>
      {/* Page */}
      <main
        className="zone-page"
        style={{
          background: `linear-gradient(160deg, ${BG_TERM} 0%, #010810 100%)`,
          position: 'relative',
          minHeight: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Ambient phosphor glow */}
        <div aria-hidden style={{
          position: 'fixed', bottom: '-20%', left: '-10%',
          width: '60vw', height: '60vw', maxWidth: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,65,0.04) 0%, transparent 65%)',
          filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0,
        }} />

        {/* Full-height drifting scanline */}
        <div aria-hidden style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', left: 0, right: 0, height: '200px',
            background: `linear-gradient(to bottom, transparent 0%, rgba(0,255,65,0.025) 50%, transparent 100%)`,
            animation: 'phosphor-scanline 8s linear infinite',
          }} />
        </div>

        <motion.div
          style={{ position: 'relative', zIndex: 1 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
        >
          {/* Zone header — repurposed for terminal theme */}
          <header style={{ marginBottom: '2rem' }}>
            <ZoneHeader
              zone="📡  ZONE · CONTROL ROOM"
              title="Control Room"
              subtitle={null}
              accentColor={PH}
            />
          </header>

          {/* Boot sequence */}
          <BootHeader />

          {/* Two-column layout on large screens */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '1.5rem',
            alignItems: 'stretch',
          }}>

            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
              <div style={{ flex: 1 }}>
                <TransmissionPanel />
              </div>
              <ResumeButton />
            </div>

            {/* Right column — contact form */}
            <div style={{ height: '100%' }}>
              <ContactForm />
            </div>
          </div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 0.8 }}
            style={{
              marginTop: '3rem',
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
              color: PH_DIM, letterSpacing: '0.12em', opacity: 0.4,
              textAlign: 'center',
            }}
          >
            // END OF TRANSMISSION · CHANNEL SECURE · ENCRYPTION: AES-256
          </motion.p>
        </motion.div>
      </main>
    </>
  );
}
