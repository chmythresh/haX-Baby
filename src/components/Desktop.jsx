import React, { useState, useRef, useCallback, useEffect } from 'react'
import { PipFace } from './BootScreen.jsx'
import Taskbar from './Taskbar.jsx'
import Wallpaper from './Wallpaper.jsx'
import WindowFrame from './WindowFrame.jsx'
import AboutPipWindow from './windows/AboutPipWindow.jsx'
import LullabyLabWindow from './windows/LullabyLabWindow.jsx'
import NightlightWindow from './windows/NightlightWindow.jsx'
import DreamDeliveryWindow from './windows/DreamDeliveryWindow.jsx'
import StoryWindow from './windows/StoryWindow.jsx'
import EasterEgg from './EasterEgg.jsx'
import SparkleTrail from './SparkleTrail.jsx'
import VisitorCounter from './VisitorCounter.jsx'
import './Desktop.css'

const DESKTOP_ICONS = [
  { id: 'about',     label: 'ABOUT_PIP.exe',    icon: '👾', desc: 'Meet Pip' },
  { id: 'lullaby',   label: 'LullabyLab.exe',   icon: '🎵', desc: 'Music Box' },
  { id: 'nightlight',label: 'Nightlights.exe',  icon: '🏮', desc: 'Dream Lanterns' },
  { id: 'delivery',  label: 'DreamRoutes.exe',  icon: '🗺️', desc: 'Delivery Map' },
  { id: 'story',     label: 'MyStory.exe',      icon: '📖', desc: 'Origin Story' },
]

const WINDOW_COMPONENTS = {
  about:      AboutPipWindow,
  lullaby:    LullabyLabWindow,
  nightlight: NightlightWindow,
  delivery:   DreamDeliveryWindow,
  story:      StoryWindow,
}

const WINDOW_TITLES = {
  about:      'ABOUT_PIP.exe',
  lullaby:    'Lullaby Lab — Music Box',
  nightlight: 'Nightlight Collection',
  delivery:   'Dream Delivery Routes',
  story:      'How I Became a Dream Engineer',
}

// Soft click sound — one shared AudioContext per component lifetime
let sharedAudioCtx = null
function getSharedCtx() {
  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (sharedAudioCtx.state === 'suspended') sharedAudioCtx.resume()
  return sharedAudioCtx
}

function playClickSound() {
  try {
    const ctx = getSharedCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.value = 820
    gain.gain.setValueAtTime(0.07, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.09)
  } catch {}
}

export default function Desktop({
  theme, onToggleTheme, soundEnabled, onToggleSound,
  activeWindows, onOpenWindow, onCloseWindow,
  chaosMode, onToggleChaos,
}) {
  const [pipReaction, setPipReaction] = useState(null)
  const [windowOrder, setWindowOrder] = useState([])
  const [babyPulse, setBabyPulse] = useState(false)
  // Track single-click timing for icons (distinguish single vs double click)
  const clickTimerRef = useRef({})

  const handleOpenWindow = useCallback((id) => {
    if (soundEnabled) playClickSound()
    onOpenWindow(id)
    setWindowOrder(prev => [...prev.filter(w => w !== id), id])
  }, [soundEnabled, onOpenWindow])

  const handleCloseWindow = useCallback((id) => {
    if (soundEnabled) playClickSound()
    onCloseWindow(id)
  }, [soundEnabled, onCloseWindow])

  const bringToFront = useCallback((id) => {
    setWindowOrder(prev => [...prev.filter(w => w !== id), id])
  }, [])

  const getZIndex = useCallback((id) => {
    const idx = windowOrder.indexOf(id)
    return 100 + idx * 10
  }, [windowOrder])

  // Icon interaction: single click opens too (for accessibility and touch)
  // Double-click also works; we debounce to avoid double-firing
  const handleIconClick = useCallback((id) => {
    if (clickTimerRef.current[id]) return // double-click already fired
    clickTimerRef.current[id] = setTimeout(() => {
      delete clickTimerRef.current[id]
      handleOpenWindow(id)
    }, 200)
  }, [handleOpenWindow])

  const handleIconDoubleClick = useCallback((id) => {
    // Clear the pending single-click timer so we don't fire twice
    if (clickTimerRef.current[id]) {
      clearTimeout(clickTimerRef.current[id])
      delete clickTimerRef.current[id]
    }
    handleOpenWindow(id)
  }, [handleOpenWindow])

  // Pip hover reaction
  const handlePipHover = () => {
    const reactions = ['zzz...', '✨', '♪', '💤', '⭐', '🌙']
    setPipReaction(reactions[Math.floor(Math.random() * reactions.length)])
    setTimeout(() => setPipReaction(null), 2000)
  }

  useEffect(() => {
    if (!activeWindows.some(id => ['lullaby', 'story', 'nightlight'].includes(id))) {
      setBabyPulse(false)
      return
    }

    const timer = setInterval(() => {
      setBabyPulse(prev => !prev)
    }, 500)

    return () => clearInterval(timer)
  }, [activeWindows])

  const playingMood = activeWindows.some(id => ['lullaby', 'story', 'nightlight'].includes(id))

  return (
    <div className={`desktop ${chaosMode ? 'chaos' : ''}`}>
      <Wallpaper theme={theme} chaosMode={chaosMode} />
      <SparkleTrail />

      {/* Desktop content area */}
      <div className="desktop-content">
        <div className={`dream-baby-stage ${playingMood ? 'is-live' : ''}`} aria-live="polite">
          <div className={`dream-baby ${playingMood ? 'is-dancing' : ''}`}>
            <PipFace
              size={180}
              glowing={theme === 'night'}
              playing={playingMood}
              blink={playingMood && babyPulse}
              smile={playingMood}
              lightOn={playingMood && babyPulse}
            />
          </div>
        </div>

        {/* Character welcome area */}
        <div className="welcome-area">
          <div
            className="pip-welcome-figure"
            onMouseEnter={handlePipHover}
            aria-label="Pip the Skull Baby, Junior Dream Engineer"
            role="img"
          >
            <PipFace size={120} glowing={theme === 'night'} />
            {pipReaction && (
              <div className="pip-reaction" aria-live="polite" aria-atomic="true">
                {pipReaction}
              </div>
            )}
          </div>
          <div className="welcome-text">
            <h1 className="welcome-title">Pip's Dream OS</h1>
            <p className="welcome-subtitle">Junior Dream Engineer · Midnight Nursery</p>
            <p className="welcome-hint">Click an icon to open a window ✨</p>
          </div>
        </div>

        {/* Desktop icons grid */}
        <nav className="desktop-icons" aria-label="Desktop applications">
          {DESKTOP_ICONS.map(icon => (
            <button
              key={icon.id}
              className="desktop-icon"
              onClick={() => handleIconClick(icon.id)}
              onDoubleClick={() => handleIconDoubleClick(icon.id)}
              aria-label={`Open ${icon.desc}`}
              title={`${icon.label} — ${icon.desc}`}
            >
              <div className="icon-graphic" aria-hidden="true">{icon.icon}</div>
              <span className="icon-label">{icon.label}</span>
            </button>
          ))}
        </nav>

        {/* Open windows */}
        {activeWindows.map(id => {
          const WindowComp = WINDOW_COMPONENTS[id]
          if (!WindowComp) return null
          return (
            <WindowFrame
              key={id}
              id={id}
              title={WINDOW_TITLES[id]}
              onClose={() => handleCloseWindow(id)}
              onFocus={() => bringToFront(id)}
              zIndex={getZIndex(id)}
            >
              <WindowComp theme={theme} soundEnabled={soundEnabled} />
            </WindowFrame>
          )
        })}

        {/* Footer row */}
        <div className="desktop-footer">
          <VisitorCounter />
          <div className="desktop-status" aria-label="OS version">
            Midnight Nursery OS v1.0 · {chaosMode ? '🌀 Chaos Mode' : '✨ Sweet Dreams'}
          </div>
        </div>

      </div>

      {/* Easter egg star */}
      <EasterEgg soundEnabled={soundEnabled} />

      {/* Taskbar */}
      <Taskbar
        theme={theme}
        onToggleTheme={onToggleTheme}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        activeWindows={activeWindows}
        onOpenWindow={handleOpenWindow}
        onCloseWindow={handleCloseWindow}
        chaosMode={chaosMode}
        onToggleChaos={onToggleChaos}
      />
    </div>
  )
}
