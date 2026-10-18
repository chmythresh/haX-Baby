import React, { useState, useEffect } from 'react'
import './VisitorCounter.css'

export default function VisitorCounter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    try {
      const stored = parseInt(localStorage.getItem('pip-visitor-count') || '0', 10)
      const newCount = stored + 1
      localStorage.setItem('pip-visitor-count', newCount.toString())
      // Animate count up
      let start = stored
      const end = newCount
      const step = () => {
        start++
        setCount(start)
        if (start < end) requestAnimationFrame(step)
      }
      setCount(stored)
      requestAnimationFrame(step)
    } catch {
      setCount(1)
    }
  }, [])

  return (
    <div className="visitor-counter" aria-label={`Local session visitor count: ${count}`} title="Local demo counter — session only">
      <span className="counter-icon" aria-hidden="true">👁️</span>
      <span className="counter-label">
        Visitor <span className="counter-num">#{count.toString().padStart(4, '0')}</span>
      </span>
      <span className="counter-note">(local demo)</span>
    </div>
  )
}
