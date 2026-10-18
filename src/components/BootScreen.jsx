import React, { useState, useEffect } from 'react'
import './BootScreen.css'

const BOOT_STEPS = [
  { text: 'PIP.EXE', delay: 0, type: 'title' },
  { text: 'Midnight Nursery OS v1.0', delay: 600, type: 'subtitle' },
  { text: '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%', delay: 1200, type: 'progress' },
  { text: 'Loading dream modules...', delay: 1800, type: 'log' },
  { text: 'Calibrating lullaby engine...', delay: 2200, type: 'log' },
  { text: 'Charging nightlights...', delay: 2600, type: 'log' },
  { text: 'Sprinkling stardust...', delay: 3000, type: 'log' },
  { text: 'Preparing your dreams...', delay: 3400, type: 'status' },
  { text: 'Welcome, little dreamer! ✨', delay: 4000, type: 'welcome' },
]

// Pre-generate stable positions so they don't jump on every state update
const BOOT_STARS = Array.from({ length: 40 }, (_, i) => ({
  left:  `${(i * 31 + 7)  % 100}%`,
  top:   `${(i * 47 + 13) % 100}%`,
  delay: `${(i * 0.19)    % 3}s`,
  size:  2 + (i % 3),
}))

export default function BootScreen({ onComplete }) {
  const [visibleSteps, setVisibleSteps] = useState([])
  const [done, setDone] = useState(false)
  const [skipped, setSkipped] = useState(false)

  useEffect(() => {
    const timers = BOOT_STEPS.map((step, i) =>
      setTimeout(() => {
        setVisibleSteps(prev => [...prev, i])
      }, step.delay)
    )
    // Auto-complete after last step + brief pause
    const autoTimer = setTimeout(() => {
      setDone(true)
    }, 4800)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(autoTimer)
    }
  }, [])

  useEffect(() => {
    if (done || skipped) {
      const t = setTimeout(onComplete, skipped ? 0 : 500)
      return () => clearTimeout(t)
    }
  }, [done, skipped, onComplete])

  const handleSkip = () => setSkipped(true)

  if (skipped) return null

  return (
    <div className={`boot-screen ${done ? 'boot-fade-out' : ''}`} role="status" aria-live="polite">
      {/* Stars background */}
      <div className="boot-stars" aria-hidden="true">
        {BOOT_STARS.map((s, i) => (
          <div
            key={i}
            className="boot-star"
            style={{
              left: s.left,
              top: s.top,
              animationDelay: s.delay,
              width: `${s.size}px`,
              height: `${s.size}px`,
            }}
          />
        ))}
      </div>

      {/* Pip Character */}
      <div className="boot-pip" aria-hidden="true">
        <PipFace size={100} glowing />
      </div>

      {/* Terminal window */}
      <div className="boot-terminal" role="log">
        <div className="boot-terminal-header">
          <span className="terminal-dot" style={{ background: '#ff6b6b' }} />
          <span className="terminal-dot" style={{ background: '#ffd93d' }} />
          <span className="terminal-dot" style={{ background: '#6bcb77' }} />
          <span className="terminal-title">pip_boot.exe</span>
        </div>
        <div className="boot-terminal-body">
          {BOOT_STEPS.map((step, i) => (
            visibleSteps.includes(i) && (
              <div
                key={i}
                className={`boot-line boot-line-${step.type}`}
                style={{ animationDelay: '0ms' }}
              >
                {step.type === 'log' && <span className="boot-prompt">{'>'} </span>}
                {step.text}
                {i === visibleSteps[visibleSteps.length - 1] && step.type !== 'welcome' && (
                  <span className="boot-cursor">▌</span>
                )}
              </div>
            )
          ))}
        </div>
      </div>

      <button className="boot-skip" onClick={handleSkip} aria-label="Skip boot screen">
        Skip →
      </button>
    </div>
  )
}

// Inline Pip SVG for boot screen
export function PipFace({
  size = 80,
  glowing = false,
  playing = false,
  blink = false,
  smile = true,
  lightOn = true,
}) {
  const eyeY = 52
  const eyeScaleY = blink ? 0.18 : 1
  const smilePath = smile ? 'M43 70 Q50 76 57 70' : 'M43 73 Q50 68 57 73'
  const bodyGlow = lightOn ? '#f8dda9' : '#f4d0b4'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Pip the Skull Baby"
      role="img"
      style={{
        transform: playing ? 'translateY(-2px) rotate(-2deg)' : 'translateY(0) rotate(0deg)',
        transformOrigin: 'center',
        transition: 'transform 0.25s ease',
      }}
    >
      {glowing && (
        <defs>
          <radialGradient id={`eyeGlow-${size}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffcc88" stopOpacity="1" />
            <stop offset="100%" stopColor="#e8943a" stopOpacity="0.6" />
          </radialGradient>
        </defs>
      )}

      <g opacity={playing ? 1 : 0.96}>
        {/* Skull head */}
        <ellipse cx="50" cy="56" rx="26" ry="24" fill="#fff8f1" />
        <ellipse cx="50" cy="72" rx="14" ry="10" fill="#fff8f1" />

        {/* Eye sockets */}
        <ellipse cx="38" cy={eyeY} rx="9" ry="9" fill="#3a2820" />
        <ellipse cx="62" cy={eyeY} rx="9" ry="9" fill="#3a2820" />

        {/* eyes with blink animation */}
        <g transform={`translate(0 0) scale(1 ${eyeScaleY})`} style={{ transformOrigin: `${38}px ${eyeY}px` }}>
          <ellipse cx="38" cy={eyeY} rx="6" ry="6" fill={glowing ? `url(#eyeGlow-${size})` : '#e8943a'} />
        </g>
        <g transform={`translate(0 0) scale(1 ${eyeScaleY})`} style={{ transformOrigin: `${62}px ${eyeY}px` }}>
          <ellipse cx="62" cy={eyeY} rx="6" ry="6" fill={glowing ? `url(#eyeGlow-${size})` : '#e8943a'} />
        </g>

        <circle cx="40" cy="50" r="1.5" fill="white" opacity="0.9" />
        <circle cx="64" cy="50" r="1.5" fill="white" opacity="0.9" />

        <ellipse cx="28" cy="62" rx="5" ry="3" fill="#f4a7b9" opacity="0.5" />
        <ellipse cx="72" cy="62" rx="5" ry="3" fill="#f4a7b9" opacity="0.5" />

        {/* smile toggles with cute expression */}
        <path d={smilePath} stroke="#a34063" strokeWidth="2" fill="none" strokeLinecap="round" />
        <rect x="46" y="72" width="5" height="3" rx="1" fill="#e8ddd0" opacity="0.6" />
        <rect x="51" y="72" width="5" height="3" rx="1" fill="#e8ddd0" opacity="0.6" />
        <path d="M46 62 Q50 65 54 62" stroke="#c4a090" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  )
}
