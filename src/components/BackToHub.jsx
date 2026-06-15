// ─── BackToHub ────────────────────────────────────────────────────────────────
// A persistent back-button visible on all zone pages.

import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BackToHub() {
  const navigate = useNavigate();

  return (
    <motion.button
      id="back-to-hub-btn"
      onClick={() => navigate('/')}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.35 }}
      whileHover={{ x: -3 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(15, 22, 38, 0.7)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(0, 255, 209, 0.15)',
        borderRadius: '100px',
        color: 'var(--accent-teal)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.8rem',
        padding: '8px 18px',
        cursor: 'pointer',
        letterSpacing: '0.04em',
        transition: 'border-color 250ms ease, box-shadow 250ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0,255,209,0.4)';
        e.currentTarget.style.boxShadow = '0 0 20px rgba(0,255,209,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0,255,209,0.15)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <ArrowLeft size={14} />
      <Home size={14} />
      <span>Hub</span>
    </motion.button>
  );
}
