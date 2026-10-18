import React, { useState, useEffect } from 'react'
import { PipFace } from './BootScreen.jsx'
import './Taskbar.css'

const WINDOW_META = {
  about:      { icon: '👾', label: 'About Pip'   },
  lullaby:    { icon: '🎵', label: 'Lullaby Lab'  },
  nightlight: { icon: '🏮', label: 'Nightlights'  },
  delivery:   { icon: '🗺️', label: 'Dream Routes' },
  story:      { icon: '📖', label: "Pip's Story"  },
}

function Clock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="taskbar-clock" aria-label={`Current time: ${time.toLocaleTimeString()}`}>
      <div className="clock-time">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="clock-date">
        {time.toLocaleDateString([], { month: 'short', day: 'numeric' })}
      </div>
    </div>
  )
}

export default function Taskbar({
  theme, onToggleTheme, soundEnabled, onToggleSound,
  activeWindows, onOpenWindow, onCloseWindow,
  chaosMode, onToggleChaos
}) {
  const [startMenuOpen, setStartMenuOpen] = useState(false)
  const isNight = theme === 'night'

  const menuItems = [
    { id: 'about', label: 'About Pip', icon: '👾' },
    { id: 'lullaby', label: 'Lullaby Lab', icon: '🎵' },
    { id: 'nightlight', label: 'Nightlights', icon: '🏮' },
    { id: 'delivery', label: 'Dream Routes', icon: '🗺️' },
    { id: 'story', label: "Pip's Story", icon: '📖' },
  ]

  return (
    <>
      {/* Start menu */}
      {startMenuOpen && (
        <div className="start-menu" role="menu" aria-label="Start menu">
          <div className="start-menu-header">
            <PipFace size={32} glowing={isNight} />
            <div>
              <div className="start-menu-name">Pip</div>
              <div className="start-menu-role">Dream Engineer</div>
            </div>
          </div>
          <div className="start-menu-divider" />
          {menuItems.map(item => (
            <button
              key={item.id}
              className="start-menu-item"
              role="menuitem"
              onClick={() => {
                onOpenWindow(item.id)
                setStartMenuOpen(false)
              }}
            >
              <span className="start-item-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
          <div className="start-menu-divider" />
          <button
            className="start-menu-item start-menu-chaos"
            role="menuitem"
            onClick={() => { onToggleChaos(); setStartMenuOpen(false) }}
          >
            <span className="start-item-icon">🌀</span>
            <span>{chaosMode ? 'Exit Chaos Mode' : 'Chaos Mode!'}</span>
          </button>
        </div>
      )}

      {/* Overlay to close menu */}
      {startMenuOpen && (
        <div
          className="start-menu-overlay"
          onClick={() => setStartMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav className="taskbar" aria-label="Taskbar">
        {/* Start/Logo button */}
        <button
          className={`taskbar-start ${startMenuOpen ? 'active' : ''}`}
          onClick={() => setStartMenuOpen(o => !o)}
          aria-label="Open start menu"
          aria-expanded={startMenuOpen}
          aria-haspopup="menu"
        >
          <PipFace size={24} glowing={isNight} />
          <span className="taskbar-start-label">Pip</span>
        </button>

        {/* Active windows in taskbar — clicking brings to front, not closes */}
        <div className="taskbar-windows" role="list" aria-label="Open windows">
          {activeWindows.map(id => {
            const meta = WINDOW_META[id] || { icon: '🪟', label: id }
            return (
              <button
                key={id}
                className="taskbar-window-btn"
                role="listitem"
                onClick={() => onOpenWindow(id)}
                title={`${meta.label} — click to bring to front`}
                aria-label={`Open window: ${meta.label}`}
              >
                <span aria-hidden="true">{meta.icon}</span>
                <span className="taskbar-window-label">{meta.label}</span>
              </button>
            )
          })}
        </div>

        {/* Right controls */}
        <div className="taskbar-controls">
          {/* Sound toggle */}
          <button
            className="taskbar-btn"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sounds' : 'Unmute sounds'}
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>

          {/* Theme toggle */}
          <button
            className="taskbar-btn theme-toggle"
            onClick={onToggleTheme}
            aria-label={isNight ? 'Switch to Daydream mode' : 'Switch to Sweet Dream mode'}
            title={isNight ? 'Daydream Mode' : 'Sweet Dream Mode'}
          >
            <span className="theme-toggle-icon">{isNight ? '☀️' : '🌙'}</span>
            <span className="theme-toggle-label">{isNight ? 'Day' : 'Night'}</span>
          </button>

          {/* Clock */}
          <Clock />
        </div>
      </nav>
    </>
  )
}
