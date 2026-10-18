import React, { useState } from 'react'
import './NightlightWindow.css'

const LANTERNS = [
  {
    id: 'star',
    name: 'Star Lantern',
    emoji: '⭐',
    desc: 'A fallen star Pip found and kept safe. It glows with a warm, golden light.',
    baseColor: '#ffd700',
    glowColor: 'rgba(255, 215, 0,',
    colors: ['#ffd700', '#ffb347', '#ffe066', '#ffa07a'],
  },
  {
    id: 'moon',
    name: 'Moon Jar',
    emoji: '🌙',
    desc: 'A little piece of moonlight sealed in a glass jar. Soothes restless dreamers.',
    baseColor: '#c8d8f0',
    glowColor: 'rgba(200, 216, 240,',
    colors: ['#c8d8f0', '#a0b8e0', '#d0e8ff', '#b0c8f0'],
  },
  {
    id: 'mushroom',
    name: 'Dream Mushroom',
    emoji: '🍄',
    desc: "A cozy pink mushroom that hums a tiny tune at night. Makes everything smell like berries.",
    baseColor: '#f4a7b9',
    glowColor: 'rgba(244, 167, 185,',
    colors: ['#f4a7b9', '#e87da0', '#ffd0d8', '#c45078'],
  },
  {
    id: 'firefly',
    name: 'Bottled Firefly',
    emoji: '✨',
    desc: 'Three little fireflies who agreed to stay in a jar for one night. They blink hello.',
    baseColor: '#b5ead7',
    glowColor: 'rgba(181, 234, 215,',
    colors: ['#b5ead7', '#77c4a8', '#d0f4e4', '#5aaa8e'],
  },
  {
    id: 'cloud',
    name: 'Cloud Puff',
    emoji: '☁️',
    desc: 'A tiny piece of storm cloud that Pip convinced to shine softly. Very rare.',
    baseColor: '#d8b4f8',
    glowColor: 'rgba(216, 180, 248,',
    colors: ['#d8b4f8', '#b47af8', '#ead0fe', '#9860d8'],
  },
]

const INTENSITIES = [
  { label: 'Dim', value: 0.3 },
  { label: 'Cozy', value: 0.6 },
  { label: 'Bright', value: 1.0 },
]

export default function NightlightWindow({ theme }) {
  const [selected, setSelected] = useState('star')
  const [intensity, setIntensity] = useState(0.6)
  const [colorIdx, setColorIdx] = useState(0)
  const [pulsing, setPulsing] = useState(true)

  const lantern = LANTERNS.find(l => l.id === selected)
  const currentColor = lantern.colors[colorIdx % lantern.colors.length]
  const glowSize = Math.round(40 + intensity * 60)
  const glowOpacity = (0.3 + intensity * 0.5).toFixed(2)

  return (
    <div className="nightlight-window">
      <div className="nightlight-header">
        <h3 className="nightlight-title">✨ Pip's Nightlight Collection</h3>
        <p className="nightlight-desc">
          Magical lanterns and dream lights — each one hand-found by Pip.
        </p>
      </div>

      {/* Lantern selector */}
      <div className="lantern-grid" role="group" aria-label="Select a lantern">
        {LANTERNS.map(l => (
          <button
            key={l.id}
            className={`lantern-btn ${selected === l.id ? 'selected' : ''}`}
            onClick={() => { setSelected(l.id); setColorIdx(0) }}
            aria-pressed={selected === l.id}
            aria-label={`Select ${l.name}`}
          >
            <span className="lantern-emoji">{l.emoji}</span>
            <span className="lantern-name">{l.name}</span>
          </button>
        ))}
      </div>

      {/* Big glow display */}
      <div className="glow-display" aria-label={`${lantern.name} glowing`}>
        <div
          className={`glow-orb ${pulsing ? 'pulsing' : ''}`}
          style={{
            backgroundColor: currentColor,
            boxShadow: `0 0 ${glowSize}px ${Math.round(glowSize * 0.8)}px ${currentColor}`,
            transition: 'background-color 0.5s ease, box-shadow 0.5s ease',
          }}
        >
          <span className="glow-emoji">{lantern.emoji}</span>
        </div>
      </div>

      {/* Description */}
      <p className="lantern-desc">{lantern.desc}</p>

      {/* Controls */}
      <div className="lantern-controls">
        {/* Intensity */}
        <div className="control-group">
          <label className="control-label">Glow Intensity</label>
          <div className="intensity-buttons" role="group" aria-label="Glow intensity">
            {INTENSITIES.map(i => (
              <button
                key={i.label}
                className={`intensity-btn ${intensity === i.value ? 'active' : ''}`}
                onClick={() => setIntensity(i.value)}
                aria-pressed={intensity === i.value}
              >
                {i.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color cycle */}
        <div className="control-group">
          <label className="control-label">Glow Color</label>
          <div className="color-swatches" role="group" aria-label="Color swatches">
            {lantern.colors.map((c, i) => (
              <button
                key={i}
                className={`color-swatch ${colorIdx === i ? 'active' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColorIdx(i)}
                aria-label={`Color option ${i + 1}`}
                aria-pressed={colorIdx === i}
              />
            ))}
          </div>
        </div>

        {/* Pulse toggle */}
        <div className="control-group">
          <label className="control-label">Pulse</label>
          <button
            className={`pulse-toggle ${pulsing ? 'active' : ''}`}
            onClick={() => setPulsing(p => !p)}
            aria-pressed={pulsing}
            aria-label={pulsing ? 'Disable pulse animation' : 'Enable pulse animation'}
          >
            {pulsing ? '💗 Pulsing' : '⬜ Steady'}
          </button>
        </div>
      </div>

      <p className="nightlight-footer">
        🌙 Each light was lovingly collected by Pip on quiet evenings outside Midnight Nursery.
      </p>
    </div>
  )
}
