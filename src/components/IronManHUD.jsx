import { useState } from 'react';
import { Github, Linkedin, Mail, Code2 } from 'lucide-react';

const LINKS = [
  {
    id: 'github',
    icon: Github,
    href: 'https://github.com/Adarsh2301k?tab=repositories',
    ring: 1,      // 0 for inner, 1 for outer
    angle: 45,
    color: '#FFF',
  },
  {
    id: 'linkedin',
    icon: Linkedin,
    href: 'https://www.linkedin.com/in/adarshkesh23/',
    ring: 1,
    angle: 225,
    color: '#0A66C2',
  },
  {
    id: 'leetcode',
    icon: Code2,
    href: 'https://leetcode.com/u/adarsh2301k/',
    ring: 0,
    angle: 135,
    color: '#FFA116',
  },
  {
    id: 'email',
    icon: Mail,
    href: 'mailto:adarsh2301k@gmail.com',
    ring: 0,
    angle: 315,
    color: 'var(--accent-teal)',
  },
];

// Ring sizes — Pushed out to be absolutely massive
const RINGS = [
  { size: 1150, speed: 25,  dash: '4 12',     opacity: 0.15 },  // Inner
  { size: 1550, speed: -35, dash: '16 16 2',  opacity: 0.12 }, // Outer
];

const TILT = 60; // 3D Perspective tilt

export default function IronManHUD() {
  const [hoveredLink, setHoveredLink] = useState(null);

  return (
    <>
      <style>
        {`
          @keyframes hud-spin-cw {
            from { transform: rotateZ(0deg); }
            to { transform: rotateZ(360deg); }
          }
          @keyframes hud-spin-ccw {
            from { transform: rotateZ(0deg); }
            to { transform: rotateZ(-360deg); }
          }
        `}
      </style>

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) rotateX(${TILT}deg)`,
          transformStyle: 'preserve-3d',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {RINGS.map((ring, rIdx) => {
          const ringLinks = LINKS.filter((l) => l.ring === rIdx);
          const isHovered = ringLinks.some((l) => l.id === hoveredLink);

          // Determine animation direction for the ring and the inverse for the icons
          const ringAnim = ring.speed > 0 ? 'hud-spin-cw' : 'hud-spin-ccw';
          const iconAnim = ring.speed > 0 ? 'hud-spin-ccw' : 'hud-spin-cw';
          const dur = Math.abs(ring.speed);

          return (
            <div
              key={rIdx}
              style={{
                position: 'absolute',
                width: `${ring.size}px`,
                height: `${ring.size}px`,
                transformStyle: 'preserve-3d',
                animation: `${ringAnim} ${dur}s linear infinite`,
                animationPlayState: isHovered ? 'paused' : 'running',
              }}
            >
              {/* SVG Ring Background */}
              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${ring.size} ${ring.size}`}
                style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
              >
                <circle
                  cx={ring.size / 2}
                  cy={ring.size / 2}
                  r={(ring.size / 2) - 2}
                  fill="none"
                  stroke="var(--accent-teal)"
                  strokeWidth="1.5"
                  strokeDasharray={ring.dash}
                  opacity={ring.opacity}
                />
                <circle cx={ring.size / 2} cy={2} r={4} fill="var(--accent-teal)" opacity={0.6} />
                <circle cx={ring.size / 2} cy={ring.size - 2} r={4} fill="var(--accent-teal)" opacity={0.6} />
              </svg>

              {/* Orbiting Icons */}
              {ringLinks.map((link) => {
                const radius = ring.size / 2;
                const rad = (link.angle * Math.PI) / 180;
                const x = radius + radius * Math.cos(rad);
                const y = radius + radius * Math.sin(rad);
                const isActive = hoveredLink === link.id;

                return (
                  <div
                    key={link.id}
                    style={{
                      position: 'absolute',
                      left: `${x}px`,
                      top: `${y}px`,
                      transform: 'translate(-50%, -50%)',
                      transformStyle: 'preserve-3d',
                      pointerEvents: 'auto',
                    }}
                    onMouseEnter={() => setHoveredLink(link.id)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {/* Inverse rotation so local axes stay static relative to world */}
                    <div
                      style={{
                        transformStyle: 'preserve-3d',
                        animation: `${iconAnim} ${dur}s linear infinite`,
                        animationPlayState: isHovered ? 'paused' : 'running',
                        width: '52px', height: '52px',
                      }}
                    >
                      {/* Inverse X tilt so the icon stands straight up */}
                      <div style={{
                        transform: `rotateX(${-TILT}deg)`,
                        transformStyle: 'preserve-3d',
                        width: '100%', height: '100%',
                      }}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '100%', height: '100%',
                            borderRadius: '50%',
                            // Dark solid background so it pops cleanly as a circle
                            background: isActive ? 'rgba(5, 13, 15, 1)' : 'rgba(5, 13, 15, 0.8)',
                            border: `2px solid ${isActive ? link.color : 'var(--accent-teal)'}`,
                            color: isActive ? link.color : 'var(--accent-teal)',
                            boxShadow: isActive ? `0 0 30px ${link.color}90, inset 0 0 15px ${link.color}40` : '0 0 15px rgba(0,255,209,0.3)',
                            backdropFilter: 'blur(8px)',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                          }}
                        >
                          <link.icon size={22} />
                        </a>

                        {/* Tooltip */}
                        {isActive && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '65px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.75rem',
                              color: link.color,
                              letterSpacing: '0.1em',
                              background: 'rgba(5,13,15,0.95)',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              border: `1px solid ${link.color}60`,
                              whiteSpace: 'nowrap',
                              boxShadow: `0 4px 12px rgba(0,0,0,0.5)`,
                            }}
                          >
                            {link.id.toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
