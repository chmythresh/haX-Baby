import React, { useState, useRef, useCallback, useEffect } from 'react'
import './LullabyLabWindow.css'

// Gentle pentatonic lullaby — a real little melody
const MELODY = [
  { freq: 523.25, dur: 0.50, note: 'C5' },
  { freq: 659.25, dur: 0.50, note: 'E5' },
  { freq: 783.99, dur: 0.60, note: 'G5' },
  { freq: 880.00, dur: 0.60, note: 'A5' },
  { freq: 783.99, dur: 0.40, note: 'G5' },
  { freq: 659.25, dur: 0.50, note: 'E5' },
  { freq: 587.33, dur: 0.50, note: 'D5' },
  { freq: 523.25, dur: 0.60, note: 'C5' },
  { freq: 440.00, dur: 0.50, note: 'A4' },
  { freq: 523.25, dur: 0.80, note: 'C5' },
  { freq: 392.00, dur: 0.50, note: 'G4' },
  { freq: 440.00, dur: 0.80, note: 'A4' },
  { freq: 523.25, dur: 1.20, note: 'C5' },
]

const KEYS = [
  { note: 'C', freq: 523.25, color: '#f4a7b9' },
  { note: 'D', freq: 587.33, color: '#ffcba4' },
  { note: 'E', freq: 659.25, color: '#ffd93d' },
  { note: 'F', freq: 698.46, color: '#d8b4f8' },
  { note: 'G', freq: 783.99, color: '#a8d8ea' },
  { note: 'A', freq: 880.00, color: '#b5ead7' },
  { note: 'B', freq: 987.77, color: '#c9b8f0' },
]

export default function LullabyLabWindow({ soundEnabled }) {
  const [playing, setPlaying]           = useState(false)
  const [muted, setMuted]               = useState(false)
  const [volume, setVolume]             = useState(0.6)
  const [currentNote, setCurrentNote]   = useState(null)
  const [activeKey, setActiveKey]       = useState(null)

  const audioCtxRef   = useRef(null)
  const masterGainRef = useRef(null)
  const playbackRef   = useRef(null) // array of setTimeout ids

  // Get or create the shared AudioContext
  const getCtx = useCallback(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      const ctx    = new (window.AudioContext || window.webkitAudioContext)()
      const master = ctx.createGain()
      master.gain.value = muted ? 0 : volume
      master.connect(ctx.destination)
      audioCtxRef.current  = ctx
      masterGainRef.current = master
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
    return { ctx: audioCtxRef.current, master: masterGainRef.current }
  }, [muted, volume])

  // Play a single note with a simple attack/release envelope
  const playNote = useCallback((freq, duration = 0.5) => {
    try {
      const { ctx, master } = getCtx()
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type          = 'sine'
      osc.frequency.value = freq

      const now = ctx.currentTime
      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(0.28, now + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.25)

      osc.connect(gain)
      gain.connect(master)
      osc.start(now)
      osc.stop(now + duration + 0.3)
    } catch (e) {
      console.warn('Audio error:', e)
    }
  }, [getCtx])

  const stopPlayback = useCallback(() => {
    if (playbackRef.current) {
      playbackRef.current.forEach(clearTimeout)
      playbackRef.current = null
    }
    setPlaying(false)
    setCurrentNote(null)
  }, [])

  const startPlayback = useCallback(() => {
    setPlaying(true)
    let elapsed = 0
    const timers = MELODY.map((note, i) => {
      const t = setTimeout(() => {
        setCurrentNote(note.note)
        playNote(note.freq, note.dur)
        if (i === MELODY.length - 1) {
          setTimeout(() => {
            setPlaying(false)
            setCurrentNote(null)
          }, (note.dur + 0.6) * 1000)
        }
      }, elapsed * 1000)
      elapsed += note.dur + 0.06
      return t
    })
    playbackRef.current = timers
  }, [playNote])

  // Keep master gain in sync with volume/mute sliders
  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = muted ? 0 : volume
    }
  }, [volume, muted])

  // Cleanup AudioContext on unmount
  useEffect(() => {
    return () => {
      stopPlayback()
      audioCtxRef.current?.close().catch(() => {})
    }
  }, [stopPlayback])

  const handlePlayStop = () => {
    if (playing) stopPlayback()
    else startPlayback()
  }

  const playKeyNote = (freq, noteName) => {
    if (!soundEnabled) return
    setActiveKey(noteName)
    playNote(freq, 0.5)
    setTimeout(() => setActiveKey(k => k === noteName ? null : k), 300)
  }

  const audioDisabled = !soundEnabled || muted

  return (
    <div className="lullaby-window">
      <div className="lullaby-header">
        <div className="music-box-icon" aria-hidden="true">🎵</div>
        <div>
          <h3 className="lullaby-title">Pip's Lullaby Lab</h3>
          <p className="lullaby-desc">A magical music box that weaves soft bedtime melodies ✨</p>
        </div>
      </div>

      {/* Animated music box */}
      <div className="music-box" aria-label={playing ? 'Music box playing' : 'Music box idle'} role="img">
        <div className={`music-box-lid ${playing ? 'open' : ''}`} aria-hidden="true">
          <div className="music-box-face">{playing ? '♪' : '🎶'}</div>
        </div>
        <div className="music-box-body" aria-hidden="true">
          <div className="music-box-notes">
            {playing && ['♩', '♪', '♫', '♬'].map((n, i) => (
              <span key={i} className="floating-note" style={{ animationDelay: `${i * 0.3}s` }}>
                {n}
              </span>
            ))}
          </div>
          {currentNote && (
            <div className="current-note-display" aria-live="polite" aria-atomic="true">
              {currentNote}
            </div>
          )}
        </div>
      </div>

      {/* Play / stop */}
      <div className="lullaby-controls">
        <button
          className={`play-btn ${playing ? 'playing' : ''}`}
          onClick={handlePlayStop}
          aria-label={playing ? 'Stop lullaby' : 'Play lullaby'}
          disabled={!soundEnabled}
        >
          {playing
            ? <><span aria-hidden="true">⏹</span> Stop</>
            : <><span aria-hidden="true">▶</span> Play Lullaby</>
          }
        </button>

        <div className="volume-control">
          <label htmlFor="lullaby-vol" className="volume-label">
            <span aria-hidden="true">{muted ? '🔇' : '🔊'}</span>
            Volume
          </label>
          <input
            id="lullaby-vol"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            disabled={muted}
            className="volume-slider"
            aria-label={`Volume: ${Math.round(volume * 100)}%`}
          />
          <span className="volume-value" aria-hidden="true">{Math.round(volume * 100)}%</span>
        </div>

        <button
          className={`mute-btn ${muted ? 'muted' : ''}`}
          onClick={() => setMuted(m => !m)}
          aria-label={muted ? 'Unmute music box' : 'Mute music box'}
          aria-pressed={muted}
        >
          {muted ? '🔇 Unmute' : '🔊 Mute'}
        </button>
      </div>

      {!soundEnabled && (
        <p className="sound-warning" role="alert">
          Global sounds are off — enable them in the taskbar first.
        </p>
      )}

      {/* Piano keyboard */}
      <div className="piano-section">
        <p className="piano-label" id="piano-group-label">Play your own notes:</p>
        <div className="piano-keys" role="group" aria-labelledby="piano-group-label">
          {KEYS.map(k => (
            <button
              key={k.note}
              className={`piano-key ${activeKey === k.note ? 'active' : ''}`}
              style={{ '--key-color': k.color }}
              onClick={() => playKeyNote(k.freq, k.note)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && playKeyNote(k.freq, k.note)}
              aria-label={`Play note ${k.note}`}
              disabled={audioDisabled}
            >
              {k.note}
            </button>
          ))}
        </div>
      </div>

      <p className="lullaby-note">
        🌙 Nothing plays automatically — click ▶ or tap a key to begin.
      </p>
    </div>
  )
}
