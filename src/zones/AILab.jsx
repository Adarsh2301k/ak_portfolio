/**
 * AILab.jsx  —  /ai-lab
 *
 * Features:
 *  · Animated SVG neural-net background: nodes appear → edges draw in one by one
 *  · After net is drawn, experiment cards stagger in
 *  · Asymmetric CSS grid (some cards span 2 rows)
 *  · Per-card status badge (Running / Complete / Failed)
 *  · Insight + What-Failed sections per experiment
 *  · Teal accent throughout
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FlaskConical, Cpu, BarChart3, Brain, Zap, Database, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import ZoneHeader from '../components/ZoneHeader';

/* ─── Experiment data ────────────────────────────────────────────────────── */
const EXPERIMENTS = [
  {
    id: 'sparse-adapters',
    title: 'Sparse Adapter Fine-Tuning',
    type: 'Research',
    status: 'complete',
    model: 'Mistral-7B',
    accuracy: 94.2,
    insight: 'Pruning 60% of LoRA parameters post-training causes <0.5% accuracy loss on MMLU — most adapter weights are redundant by convergence.',
    whatFailed: 'Structured pruning (block-level) destroyed accuracy. Unstructured magnitude pruning was the only approach that held.',
    icon: Brain,
    span: 2,
  },
  {
    id: 'rag-eval',
    title: 'RAG Evaluation Suite',
    type: 'Engineering',
    status: 'running',
    model: 'GPT-4o / Mistral-7B',
    accuracy: null,
    insight: 'BM25 + dense hybrid retrieval consistently beats dense-only by 8–12 pts on faithfulness across 5 corpora tested so far.',
    whatFailed: 'RAGAS context-recall metric is unreliable for long-context docs (>4k tokens) — the judge LLM truncates silently.',
    icon: Database,
    span: 1,
  },
  {
    id: 'multiagent',
    title: 'Multi-Agent Collaboration Benchmark',
    type: 'Research',
    status: 'complete',
    model: 'LLaMA 3.1 70B',
    accuracy: 87.6,
    insight: 'Role specialisation via system-prompt persona injection improved task accuracy by 19% vs. homogeneous agent pools.',
    whatFailed: 'Debate protocols with >4 agents collapsed into groupthink after 3 rounds — diversity injection (temperature scheduling) helped partially.',
    icon: Cpu,
    span: 1,
  },
  {
    id: 'timeseries-anomaly',
    title: 'Time-Series Anomaly Detection',
    type: 'Applied ML',
    status: 'complete',
    model: 'PatchTST + Isolation Forest',
    accuracy: 96.1,
    insight: 'Patch-based tokenisation of time-series (borrowed from ViT) dramatically outperformed classical LSTM baselines on multi-variate sensor streams.',
    whatFailed: 'Pure deep-learning approach failed on sparse anomalies (<1 per 10k steps). Hybrid with IForest was essential for recall.',
    icon: BarChart3,
    span: 1,
  },
  {
    id: 'latent-diffusion',
    title: 'Structured Diffusion Conditioning',
    type: 'Research',
    status: 'running',
    model: 'Stable Diffusion XL',
    accuracy: null,
    insight: 'Injecting tabular feature embeddings at mid-UNet layers (vs. CLIP text space) yields coherent structural changes to scientific visualisations.',
    whatFailed: 'Classifier-free guidance weight >8.0 causes feature bleed — the model ignores tabular conditioning above this threshold.',
    icon: Zap,
    span: 2,
  },
  {
    id: 'speculative-decode',
    title: 'Speculative Decoding Speedup',
    type: 'Engineering',
    status: 'complete',
    model: 'LLaMA 3.1 8B (drafter)',
    accuracy: 98.3,
    insight: '2.8× throughput improvement with a 1B drafter — acceptance rate is the critical metric, and it correlates tightly with perplexity gap.',
    whatFailed: 'Dynamic draft length (adaptive k) was theoretically optimal but added scheduling overhead that wiped out gains below batch-size 4.',
    icon: FlaskConical,
    span: 1,
  },
];

const STATUS_META = {
  complete: { label: 'Complete', color: 'var(--accent-green)',  Icon: CheckCircle2, pulse: false },
  running:  { label: 'Running',  color: 'var(--accent-amber)',  Icon: Loader2,      pulse: true  },
  failed:   { label: 'Failed',   color: 'var(--danger)',        Icon: XCircle,      pulse: false },
};

/* ─── Neural-net background ──────────────────────────────────────────────── */
const VB_W = 1200, VB_H = 500;

const NET_NODES = [
  { id: 0,  cx:  60,  cy: 80  }, { id: 1,  cx: 180, cy: 30  }, { id: 2,  cx: 150, cy: 180 },
  { id: 3,  cx: 290, cy: 100 }, { id: 4,  cx: 330, cy: 220 }, { id: 5,  cx: 460, cy: 50  },
  { id: 6,  cx: 440, cy: 170 }, { id: 7,  cx: 580, cy: 120 }, { id: 8,  cx: 560, cy: 270 },
  { id: 9,  cx: 700, cy: 60  }, { id: 10, cx: 720, cy: 200 }, { id: 11, cx: 840, cy: 130 },
  { id: 12, cx: 820, cy: 290 }, { id: 13, cx: 960, cy: 80  }, { id: 14, cx: 940, cy: 220 },
  { id: 15, cx:1100, cy: 140 }, { id: 16, cx: 280, cy: 340 }, { id: 17, cx: 640, cy: 380 },
  { id: 18, cx: 900, cy: 380 },
];

const NET_EDGES = [
  [0,1],[0,2],[1,3],[2,3],[2,4],[3,5],[3,6],[4,6],[4,16],[5,7],[6,7],[6,8],
  [7,9],[7,10],[8,10],[8,17],[9,11],[10,11],[10,12],[11,13],[12,14],[12,18],
  [13,15],[14,15],[16,8],[17,12],[18,15],[1,5],[3,7],[9,13],
];

function edgeLen([a, b]) {
  const n1 = NET_NODES[a], n2 = NET_NODES[b];
  return Math.sqrt((n2.cx - n1.cx) ** 2 + (n2.cy - n1.cy) ** 2);
}

function NeuralNet({ phase }) {
  // phase 0 = hidden, 1 = nodes appearing, 2 = edges drawing, 3 = complete
  const visibleNodes = phase >= 1 ? NET_NODES.length : 0;
  const visibleEdges = phase >= 2 ? NET_EDGES.length : 0;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none', opacity: 0.55,
      }}
      aria-hidden
    >
      <defs>
        <filter id="nn-glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Edges */}
      {NET_EDGES.map(([a, b], i) => {
        const n1 = NET_NODES[a], n2 = NET_NODES[b];
        const len = edgeLen([a, b]);
        const visible = i < visibleEdges;
        return (
          <motion.line
            key={`e-${i}`}
            x1={n1.cx} y1={n1.cy} x2={n2.cx} y2={n2.cy}
            stroke="rgba(0,255,209,0.45)"
            strokeWidth="1"
            strokeDasharray={len}
            initial={{ strokeDashoffset: len, opacity: 0 }}
            animate={visible
              ? { strokeDashoffset: 0, opacity: 1 }
              : { strokeDashoffset: len, opacity: 0 }}
            transition={{ duration: 0.35, delay: visible ? i * 0.06 : 0, ease: 'easeOut' }}
          />
        );
      })}

      {/* Nodes */}
      {NET_NODES.map((n, i) => (
        <motion.g key={`n-${n.id}`} filter="url(#nn-glow)">
          {/* Pulse ring */}
          <motion.circle
            cx={n.cx} cy={n.cy} r={8} fill="none"
            stroke="rgba(0,255,209,0.25)" strokeWidth="1"
            initial={{ scale: 0, opacity: 0 }}
            animate={i < visibleNodes
              ? { scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }
              : { scale: 0, opacity: 0 }}
            transition={{ duration: 2.4, delay: i * 0.08, repeat: Infinity, ease: 'easeOut' }}
          />
          {/* Core dot */}
          <motion.circle
            cx={n.cx} cy={n.cy} r={4} fill="var(--accent-teal)"
            initial={{ scale: 0, opacity: 0 }}
            animate={i < visibleNodes ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18, delay: i * 0.08 }}
          />
        </motion.g>
      ))}
    </svg>
  );
}

/* ─── Experiment card ────────────────────────────────────────────────────── */
const CARD_V = {
  hidden:  { opacity: 0, y: 32, scale: 0.95 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { type: 'spring', stiffness: 200, damping: 22 } },
};

function ExperimentCard({ exp, index }) {
  const [expanded, setExpanded] = useState(false);
  const sm = STATUS_META[exp.status];
  const Icon = exp.icon;

  return (
    <motion.article
      id={`exp-${exp.id}`}
      variants={CARD_V}
      onClick={() => setExpanded((v) => !v)}
      style={{
        gridRow: `span ${exp.span}`,
        background: 'rgba(10, 22, 30, 0.82)',
        backdropFilter: 'blur(14px)',
        border: '1px solid rgba(0,255,209,0.1)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        display: 'flex', flexDirection: 'column', gap: '0.75rem',
      }}
      whileHover={{
        borderColor: 'rgba(0,255,209,0.35)',
        boxShadow: '0 8px 40px rgba(0,255,209,0.12), inset 0 1px 0 rgba(0,255,209,0.06)',
        transition: { duration: 0.2 },
      }}
    >
      {/* Corner accent */}
      <span aria-hidden style={{
        position: 'absolute', top: 0, left: 0,
        width: '120px', height: '120px',
        background: 'radial-gradient(ellipse at 0% 0%, rgba(0,255,209,0.08), transparent 65%)',
        pointerEvents: 'none', borderRadius: 'var(--radius-lg)',
      }} />

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '9px', flexShrink: 0,
            background: 'rgba(0,255,209,0.1)', border: '1px solid rgba(0,255,209,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={16} color="var(--accent-teal)" />
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
              color: 'var(--text-muted)', letterSpacing: '0.1em', display: 'block', marginBottom: '1px',
            }}>
              {exp.type}
            </span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', lineHeight: 1.2 }}>
              {exp.title}
            </h3>
          </div>
        </div>

        {/* Status badge */}
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
          color: sm.color, letterSpacing: '0.08em',
          background: `${sm.color}14`, border: `1px solid ${sm.color}30`,
          borderRadius: '100px', padding: '3px 10px', flexShrink: 0,
        }}>
          <sm.Icon size={10}
            style={{ animation: sm.pulse ? 'spin 1.5s linear infinite' : 'none' }}
          />
          {sm.label}
        </span>
      </div>

      {/* Model tag */}
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.66rem',
        color: 'var(--accent-teal)', opacity: 0.75,
      }}>
        ⟨ {exp.model} ⟩
      </div>

      {/* Accuracy bar */}
      {exp.accuracy !== null && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)' }}>ACCURACY</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--accent-teal)' }}>{exp.accuracy}%</span>
          </div>
          <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${exp.accuracy}%` }}
              transition={{ delay: 0.5 + index * 0.1, duration: 1, ease: 'easeOut' }}
              style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-teal), rgba(0,255,209,0.5))', borderRadius: '2px' }}
            />
          </div>
        </div>
      )}

      {/* Insight */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--accent-teal)', letterSpacing: '0.12em', marginBottom: '4px' }}>
          ✦ KEY INSIGHT
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
          {exp.insight}
        </p>
      </div>

      {/* What failed — revealed on click */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              borderTop: '1px solid rgba(255,76,106,0.2)',
              paddingTop: '0.75rem', marginTop: '0.25rem',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--danger)', letterSpacing: '0.12em', marginBottom: '4px' }}>
                ✕ WHAT FAILED
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {exp.whatFailed}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand hint */}
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.56rem',
        color: 'var(--text-muted)', opacity: 0.5, marginTop: 'auto',
        letterSpacing: '0.08em',
      }}>
        {expanded ? '▲ collapse' : '▼ click to reveal failures'}
      </div>
    </motion.article>
  );
}

/* ─── AILab page ─────────────────────────────────────────────────────────── */
const GRID_V = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

export default function AILab() {
  const prefersReduced = useReducedMotion();
  const [phase, setPhase] = useState(prefersReduced ? 3 : 0);

  useEffect(() => {
    if (prefersReduced) return;
    // Phase 1: nodes appear immediately
    setPhase(1);
    // Phase 2: edges draw after ~200ms
    const t2 = setTimeout(() => setPhase(2), 200);
    // Phase 3: content appears after edges finish (~edges*60ms + buffer)
    const edgeTime = NET_EDGES.length * 60 + 600;
    const t3 = setTimeout(() => setPhase(3), edgeTime);
    return () => { clearTimeout(t2); clearTimeout(t3); };
  }, [prefersReduced]);

  return (
    <main
      className="zone-page"
      style={{
        background: 'linear-gradient(160deg, #030D12 0%, var(--bg-deep) 60%)',
        position: 'relative', overflow: 'hidden', minHeight: '100vh',
      }}
    >
      {/* Neural-net background layer */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden',
        pointerEvents: 'none',
      }}>
        <NeuralNet phase={phase} />
        {/* Ambient teal glow */}
        <div style={{
          position: 'absolute', top: '-5%', left: '30%',
          width: '50vw', height: '40vw', maxWidth: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,209,0.04) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }} />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <ZoneHeader
          zone="🧠  ZONE · EXPERIMENTS"
          title="Experiments"
          subtitle="Live experiments, activities, and research logs."
          accentColor="var(--accent-teal)"
        />

        {/* Status while net draws */}
        <AnimatePresence>
          {phase < 3 && (
            <motion.div
              exit={{ opacity: 0, y: -10 }}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                color: 'var(--accent-teal)', letterSpacing: '0.12em',
                marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '8px',
              }}
            >
              <motion.span
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-teal)', display: 'inline-block' }}
              />
              {phase <= 1 ? 'BOOTING NEURAL SUBSTRATE…' : 'CONNECTING NODES…'}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Under Development Placeholder */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              key="under-dev"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '5rem 2rem',
                background: 'rgba(10, 22, 30, 0.4)',
                backdropFilter: 'blur(10px)',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed rgba(0,255,209,0.3)',
                textAlign: 'center',
                marginTop: '1rem'
              }}
            >
              <Loader2 size={40} color="var(--accent-teal)" style={{ marginBottom: '1.5rem', animation: 'spin 2.5s linear infinite' }} />
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Lab Under Development
              </h2>
              <p style={{ color: 'var(--text-muted)', maxWidth: '400px', fontSize: '0.9rem', lineHeight: 1.6 }}>
                The neural substrate is still forming. I am currently preparing the first batch of live experiments and research logs. Check back soon.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Spin keyframe for loader */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}
