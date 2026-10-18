import React, { useState, useRef, useCallback, useEffect } from 'react'
import './WindowFrame.css'

// Starting positions per window so they don't perfectly overlap
const START_POS = {
  about:      { x: 24,  y: 24  },
  lullaby:    { x: 60,  y: 60  },
  nightlight: { x: 96,  y: 36  },
  delivery:   { x: 44,  y: 90  },
  story:      { x: 80,  y: 52  },
}

export default function WindowFrame({ id, title, onClose, onFocus, zIndex, children }) {
  const [minimized, setMinimized] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const [position,  setPosition]  = useState(() => START_POS[id] || { x: 40, y: 40 })
  const [dragging,  setDragging]  = useState(false)

  const dragStart = useRef(null)
  const windowRef = useRef(null)
  const bodyRef   = useRef(null)

  // Focus the window body when it opens so keyboard users can immediately Tab inside
  useEffect(() => {
    if (bodyRef.current && !minimized) {
      bodyRef.current.focus({ preventScroll: true })
    }
  }, [minimized])

  // Escape key closes the window
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && document.activeElement &&
          windowRef.current?.contains(document.activeElement)) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleTitleMouseDown = useCallback((e) => {
    if (e.target.closest('button')) return
    if (maximized) return // don't drag when maximized
    onFocus()
    setDragging(true)
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: position.x,
      posY: position.y,
    }
    e.preventDefault()
  }, [onFocus, position, maximized])

  useEffect(() => {
    if (!dragging) return
    const onMove = (e) => {
      const cx = e.touches ? e.touches[0].clientX : e.clientX
      const cy = e.touches ? e.touches[0].clientY : e.clientY
      setPosition({
        x: Math.max(0, dragStart.current.posX + cx - dragStart.current.mouseX),
        y: Math.max(0, dragStart.current.posY + cy - dragStart.current.mouseY),
      })
    }
    const onUp = () => setDragging(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [dragging])

  const windowStyle = maximized
    ? { left: 0, top: 0, width: '100%', height: 'calc(100vh - 54px)', zIndex }
    : { left: position.x, top: position.y, zIndex }

  return (
    <div
      ref={windowRef}
      className={[
        'window-frame',
        minimized  ? 'window-minimized'  : '',
        maximized  ? 'window-maximized'  : '',
        dragging   ? 'window-dragging'   : '',
      ].join(' ').trim()}
      style={windowStyle}
      onMouseDown={onFocus}
      role="region"
      aria-label={title}
    >
      {/* ── Title bar ── */}
      <div
        className="window-titlebar"
        onMouseDown={handleTitleMouseDown}
        onTouchStart={(e) => {
          if (maximized) return
          onFocus()
          setDragging(true)
          dragStart.current = {
            mouseX: e.touches[0].clientX,
            mouseY: e.touches[0].clientY,
            posX: position.x,
            posY: position.y,
          }
        }}
      >
        {/* Traffic-light controls */}
        <div className="window-controls" role="group" aria-label="Window controls">
          <button
            className="window-btn window-close"
            onClick={(e) => { e.stopPropagation(); onClose() }}
            aria-label="Close window"
            title="Close (Escape)"
          />
          <button
            className="window-btn window-minimize"
            onClick={(e) => { e.stopPropagation(); setMinimized(m => !m) }}
            aria-label={minimized ? 'Restore window' : 'Minimise window'}
            aria-pressed={minimized}
            title={minimized ? 'Restore' : 'Minimise'}
          />
          <button
            className="window-btn window-maximize"
            onClick={(e) => { e.stopPropagation(); setMaximized(m => !m); setMinimized(false) }}
            aria-label={maximized ? 'Restore window size' : 'Maximise window'}
            aria-pressed={maximized}
            title={maximized ? 'Restore' : 'Maximise'}
          />
        </div>

        <span className="window-title">{title}</span>
        <span className="window-title-star" aria-hidden="true">⭐</span>
      </div>

      {/* ── Window body ── */}
      {!minimized && (
        <div
          className="window-body"
          ref={bodyRef}
          tabIndex={-1}
          aria-label={`${title} content`}
        >
          {children}
        </div>
      )}
    </div>
  )
}
