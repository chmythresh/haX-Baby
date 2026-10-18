import React, { useEffect, useRef, useState } from 'react'
import './SparkleTrail.css'

const SPARKLE_EMOJIS = ['✨', '⭐', '💫', '✦', '·']
const MAX_SPARKLES = 18
const THROTTLE_MS = 60 // ~16fps max

export default function SparkleTrail() {
  const [sparkles, setSparkles] = useState([])
  const lastEmit = useRef(0)
  const idRef    = useRef(0)
  const reduced  = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    if (reduced.current) return

    const handleMove = (e) => {
      const now = Date.now()
      if (now - lastEmit.current < THROTTLE_MS) return
      lastEmit.current = now

      // Don't create sparkles on mobile touch (performance)
      if (e.touches && window.innerWidth < 768) return

      const x = e.touches ? e.touches[0].clientX : e.clientX
      const y = e.touches ? e.touches[0].clientY : e.clientY

      const id = ++idRef.current
      const emoji = SPARKLE_EMOJIS[Math.floor(Math.random() * SPARKLE_EMOJIS.length)]
      const size = 10 + Math.random() * 10

      setSparkles(prev => {
        const next = [...prev, { id, x, y, emoji, size }]
        return next.slice(-MAX_SPARKLES)
      })

      // Remove after animation
      setTimeout(() => {
        setSparkles(prev => prev.filter(s => s.id !== id))
      }, 800)
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  if (reduced.current) return null

  return (
    <div className="sparkle-container" aria-hidden="true">
      {sparkles.map(s => (
        <span
          key={s.id}
          className="sparkle-particle"
          style={{
            left: s.x,
            top: s.y,
            fontSize: `${s.size}px`,
          }}
        >
          {s.emoji}
        </span>
      ))}
    </div>
  )
}
