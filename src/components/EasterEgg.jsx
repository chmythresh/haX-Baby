import React, { useState, useCallback, useRef, useEffect } from 'react'
import './EasterEgg.css'

const REQUIRED_CLICKS = 7

async function launchConfetti() {
  try {
    const confetti = (await import('canvas-confetti')).default
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { x: 0.5, y: 0.6 },
      colors: ['#a34063', '#ffd700', '#f4a7b9', '#d8b4f8', '#ffcba4', '#e878a0'],
      shapes: ['star', 'circle'],
      scalar: 0.85,
      ticks: 90,
    })
  } catch {}
}

export default function EasterEgg({ soundEnabled }) {
  const [clicks,    setClicks]    = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [shimmer,   setShimmer]   = useState(false)
  const closeBtnRef = useRef(null)
  const starBtnRef  = useRef(null)
  const reduced = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  // Move focus to close button when modal opens
  useEffect(() => {
    if (showModal && closeBtnRef.current) {
      closeBtnRef.current.focus()
    }
  }, [showModal])

  // Trap focus inside modal; return focus to star on close
  useEffect(() => {
    if (!showModal) return
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setShowModal(false)
        starBtnRef.current?.focus()
      }
      if (e.key === 'Tab') {
        // Only one focusable element (close button), so just keep focus there
        e.preventDefault()
        closeBtnRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [showModal])

  const handleStarClick = useCallback(() => {
    setShimmer(true)
    setTimeout(() => setShimmer(false), 400)

    setClicks(c => {
      const next = c + 1
      if (next >= REQUIRED_CLICKS) {
        setShowModal(true)
        if (!reduced.current) launchConfetti()
        return 0
      }
      return next
    })
  }, [])

  const handleClose = useCallback(() => {
    setShowModal(false)
    starBtnRef.current?.focus()
  }, [])

  const remaining = REQUIRED_CLICKS - clicks

  return (
    <>
      {/* The tiny discoverable star */}
      <button
        ref={starBtnRef}
        className={`easter-star ${shimmer ? 'shimmer' : ''}`}
        onClick={handleStarClick}
        aria-label={
          clicks > 0
            ? `Secret star — ${remaining} more click${remaining !== 1 ? 's' : ''} to reveal a message`
            : 'A tiny star...'
        }
        title={clicks > 0 ? `${remaining} more...` : '✨'}
      >
        <span aria-hidden="true">
          {clicks === 0 ? '⭐' : clicks < 4 ? '✨' : '🌟'}
        </span>
        {clicks > 0 && (
          <span className="click-count" aria-hidden="true">{clicks}/{REQUIRED_CLICKS}</span>
        )}
      </button>

      {/* Secret modal */}
      {showModal && (
        <div
          className="easter-overlay"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="easter-title"
          aria-describedby="easter-msg"
        >
          <div
            className="easter-modal"
            onClick={e => e.stopPropagation()}
          >
            <div className="easter-pip" aria-hidden="true">🌟</div>

            <h3 className="easter-title" id="easter-title">
              You found my little secret!
            </h3>
            <p className="easter-msg" id="easter-msg">
              Every dream begins with a tiny star. Thank you for visiting my little world.
            </p>
            <p className="easter-sig">♡ — Pip</p>

            {/* Decorative floating stars */}
            <div className="easter-stars" aria-hidden="true">
              {['⭐', '✨', '💫', '🌟', '✦'].map((s, i) => (
                <span
                  key={i}
                  className="easter-float-star"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  {s}
                </span>
              ))}
            </div>

            <button
              ref={closeBtnRef}
              className="easter-close"
              onClick={handleClose}
              aria-label="Close secret message"
            >
              Close ✕
            </button>
          </div>
        </div>
      )}
    </>
  )
}
