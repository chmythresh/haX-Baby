import React, { useState, useEffect, useCallback } from 'react'
import BootScreen from './components/BootScreen.jsx'
import Desktop from './components/Desktop.jsx'
import './App.css'

export default function App() {
  const [bootDone, setBootDone] = useState(false)
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('pip-theme') || 'day' } catch { return 'day' }
  })
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [activeWindows, setActiveWindows] = useState([])
  const [chaosMode, setChaosMode] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'night' ? 'night' : '')
    try { localStorage.setItem('pip-theme', theme) } catch {}
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'day' ? 'night' : 'day')
  }, [])

  const openWindow = useCallback((id) => {
    setActiveWindows(prev => prev.includes(id) ? prev : [...prev, id])
  }, [])

  const closeWindow = useCallback((id) => {
    setActiveWindows(prev => prev.filter(w => w !== id))
  }, [])

  return (
    <div className={`app-root ${chaosMode ? 'chaos-mode' : ''}`} data-theme={theme === 'night' ? 'night' : ''}>
      {!bootDone ? (
        <BootScreen onComplete={() => setBootDone(true)} />
      ) : (
        <Desktop
          theme={theme}
          onToggleTheme={toggleTheme}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(s => !s)}
          activeWindows={activeWindows}
          onOpenWindow={openWindow}
          onCloseWindow={closeWindow}
          chaosMode={chaosMode}
          onToggleChaos={() => setChaosMode(c => !c)}
        />
      )}
    </div>
  )
}
