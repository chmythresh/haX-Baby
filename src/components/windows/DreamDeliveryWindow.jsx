import React, { useState } from 'react'
import './DreamDeliveryWindow.css'

const DELIVERY_POINTS = [
  {
    id: 'bunny',
    x: 18,
    y: 30,
    name: 'The Bunny Warren',
    emoji: '🐰',
    dream: 'A meadow full of clover that goes on forever, with a warm sun and no foxes at all.',
    recipient: 'Bun & family',
    delivered: true,
  },
  {
    id: 'owl',
    x: 72,
    y: 20,
    name: 'Owl Post Tower',
    emoji: '🦉',
    dream: 'A vast library of the stars, where every star is actually a question finally answered.',
    recipient: 'Professor Hoot',
    delivered: true,
  },
  {
    id: 'hedgehog',
    x: 42,
    y: 60,
    name: 'Hedgehog Cottage',
    emoji: '🦔',
    dream: 'A warm garden where no one trips on the prickles and everyone knows a great mushroom recipe.',
    recipient: 'Bramble',
    delivered: true,
  },
  {
    id: 'mouse',
    x: 80,
    y: 55,
    name: 'Mouse Manor',
    emoji: '🐭',
    dream: 'A banquet hall the size of a whole cheese wheel, with music and no cats.',
    recipient: 'The Squeaks',
    delivered: true,
  },
  {
    id: 'frog',
    x: 25,
    y: 70,
    name: 'Lily Pad Loft',
    emoji: '🐸',
    dream: 'A rainy night on the most perfect lily pad, with a moon that smells like water mint.',
    recipient: 'Frogsworth',
    delivered: false,
  },
  {
    id: 'nursery',
    x: 50,
    y: 38,
    name: 'Midnight Nursery',
    emoji: '🏠',
    dream: "This is where Pip lives! The dream workshop, the star cupboard, and the lullaby piano are all here.",
    recipient: 'Pip',
    delivered: null, // home base
    isHome: true,
  },
]

export default function DreamDeliveryWindow() {
  const [selected, setSelected] = useState(null)
  const [hovered, setHovered] = useState(null)

  const home = DELIVERY_POINTS.find(p => p.isHome)
  const stops = DELIVERY_POINTS.filter(p => !p.isHome)

  return (
    <div className="delivery-window">
      <div className="delivery-header">
        <h3 className="delivery-title">🗺️ Dream Delivery Routes</h3>
        <p className="delivery-desc">
          Pip's nightly route through the neighborhood. Click a location to see tonight's dream.
        </p>
      </div>

      {/* Map */}
      <div className="dream-map" role="application" aria-label="Dream delivery map">
        <svg
          className="map-svg"
          viewBox="0 0 100 90"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Sky gradient */}
          <defs>
            <radialGradient id="moonGlow" cx="85%" cy="12%" r="15%">
              <stop offset="0%" stopColor="#e8c850" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#e8c850" stopOpacity="0" />
            </radialGradient>
            <filter id="blur2">
              <feGaussianBlur stdDeviation="1" />
            </filter>
          </defs>

          {/* Background */}
          <rect width="100" height="90" fill="#1a1a3a" />
          <rect width="100" height="90" fill="url(#moonGlow)" />

          {/* Stars */}
          {[
            [10, 8], [22, 5], [35, 10], [48, 6], [60, 12], [75, 7], [88, 15],
            [5, 18], [30, 3], [65, 4], [90, 9], [15, 14], [55, 8],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="0.5" fill="white" opacity={0.4 + (i % 3) * 0.2} />
          ))}

          {/* Moon */}
          <circle cx="85" cy="12" r="6" fill="#e8c850" opacity="0.8" />
          <circle cx="88" cy="10" r="5" fill="#1a1a3a" />

          {/* Ground / Hills */}
          <path d="M0 72 Q15 62 30 68 Q45 74 60 65 Q75 56 100 62 L100 90 L0 90 Z" fill="#1a3020" />
          <path d="M0 78 Q20 72 40 76 Q60 80 80 74 Q90 72 100 74 L100 90 L0 90 Z" fill="#1e3820" />
          <path d="M0 82 L100 82 L100 90 L0 90 Z" fill="#243010" />

          {/* Rooftops */}
          {DELIVERY_POINTS.map(p => (
            <g key={p.id}>
              {/* Small house shape under each point */}
              <rect
                x={p.x - 4}
                y={p.y + 6}
                width="8"
                height="6"
                fill={p.isHome ? '#a34063' : '#3a2060'}
                rx="0.5"
                opacity="0.9"
              />
              <polygon
                points={`${p.x - 5},${p.y + 6} ${p.x},${p.y + 2} ${p.x + 5},${p.y + 6}`}
                fill={p.isHome ? '#c4607e' : '#5a3090'}
                opacity="0.9"
              />
              {/* Window light */}
              <rect
                x={p.x - 1.5}
                y={p.y + 8}
                width="3"
                height="2"
                fill="#ffd700"
                opacity={p.delivered !== false ? '0.8' : '0.2'}
                rx="0.3"
              />
            </g>
          ))}

          {/* Delivery route lines from home to each stop */}
          {stops.map(p => (
            <line
              key={p.id + '-line'}
              x1={home.x}
              y1={home.y}
              x2={p.x}
              y2={p.y}
              stroke={p.delivered ? '#ffd700' : '#444'}
              strokeWidth="0.5"
              strokeDasharray={p.delivered ? '0' : '2 2'}
              opacity={p.delivered ? '0.4' : '0.2'}
            />
          ))}

          {/* Interactive points */}
          {DELIVERY_POINTS.map(p => (
            <g key={p.id + '-btn'}>
              {/* Glow ring when selected/hovered */}
              {(selected?.id === p.id || hovered === p.id) && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="6"
                  fill="none"
                  stroke={p.isHome ? '#c4607e' : '#ffd700'}
                  strokeWidth="1"
                  opacity="0.8"
                />
              )}
              {/* Clickable circle */}
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill={
                  p.isHome ? '#a34063' :
                  p.delivered === false ? '#555' :
                  '#ffd700'
                }
                opacity="0.9"
                style={{ cursor: 'pointer' }}
              />
            </g>
          ))}
        </svg>

        {/* Overlay clickable buttons */}
        {DELIVERY_POINTS.map(p => (
          <button
            key={p.id + '-overlay'}
            className="map-point-btn"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            onClick={() => setSelected(selected?.id === p.id ? null : p)}
            onMouseEnter={() => setHovered(p.id)}
            onMouseLeave={() => setHovered(null)}
            aria-label={`${p.name}: ${p.emoji}`}
            aria-expanded={selected?.id === p.id}
          >
            <span className="map-point-emoji">{p.emoji}</span>
          </button>
        ))}
      </div>

      {/* Info panel */}
      {selected ? (
        <div className="dream-info" aria-live="polite" aria-label="Selected location dream">
          <div className="dream-info-header">
            <span className="dream-emoji">{selected.emoji}</span>
            <div>
              <div className="dream-place">{selected.name}</div>
              <div className="dream-recipient">
                For: {selected.recipient}
                {selected.delivered === true && <span className="delivered-badge"> ✓ Delivered</span>}
                {selected.delivered === false && <span className="pending-badge"> ⏳ Pending</span>}
              </div>
            </div>
            <button
              className="dream-close"
              onClick={() => setSelected(null)}
              aria-label="Close dream info"
            >✕</button>
          </div>
          <p className="dream-text">
            {selected.isHome ? '🏠 ' : '🌙 '}
            <em>{selected.dream}</em>
          </p>
        </div>
      ) : (
        <p className="map-hint" aria-live="polite">
          Click any location on the map to read tonight's dream. ✨
        </p>
      )}

      <div className="map-legend">
        <span className="legend-item">
          <span className="legend-dot" style={{ background: '#ffd700' }} /> Dream delivered
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: '#555' }} /> Pending
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: '#a34063' }} /> Home base
        </span>
      </div>
    </div>
  )
}
