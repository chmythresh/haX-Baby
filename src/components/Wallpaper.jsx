import React, { useMemo } from 'react'
import './Wallpaper.css'

function randomBetween(a, b) {
  return a + Math.random() * (b - a)
}

export default function Wallpaper({ theme, chaosMode }) {
  const stars = useMemo(() =>
    Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: randomBetween(0, 100),
      y: randomBetween(0, 100),
      size: randomBetween(2, 5),
      delay: randomBetween(0, 4),
      duration: randomBetween(2, 5),
    })), []
  )

  const clouds = useMemo(() =>
    Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      x: randomBetween(-10, 90),
      y: randomBetween(5, 60),
      scale: randomBetween(0.5, 1.2),
      delay: randomBetween(0, 8),
      duration: randomBetween(25, 45),
    })), []
  )

  const isNight = theme === 'night'

  return (
    <div
      className={`wallpaper ${isNight ? 'wallpaper-night' : 'wallpaper-day'} ${chaosMode ? 'wallpaper-chaos' : ''}`}
      aria-hidden="true"
    >
      {/* Stars — always shown, more prominent at night */}
      {stars.map(s => (
        <div
          key={s.id}
          className={`wp-star ${isNight ? 'wp-star-bright' : 'wp-star-soft'}`}
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            '--star-dur': `${s.duration}s`,
          }}
        />
      ))}

      {/* Clouds */}
      {clouds.map(c => (
        <div
          key={c.id}
          className={`wp-cloud ${isNight ? 'wp-cloud-night' : 'wp-cloud-day'}`}
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            '--cloud-scale': c.scale,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
          }}
        >
          <svg width="80" height="40" viewBox="0 0 80 40">
            <ellipse cx="40" cy="28" rx="30" ry="12" fill="currentColor" opacity="0.4" />
            <ellipse cx="28" cy="24" rx="16" ry="14" fill="currentColor" opacity="0.4" />
            <ellipse cx="52" cy="22" rx="14" ry="12" fill="currentColor" opacity="0.4" />
            <ellipse cx="40" cy="18" rx="12" ry="12" fill="currentColor" opacity="0.4" />
          </svg>
        </div>
      ))}

      {/* Moon (night only) */}
      {isNight && (
        <div className="wp-moon">
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="28" fill="#f0d090" opacity="0.15" />
            <circle cx="30" cy="30" r="20" fill="#e8c850" opacity="0.8" />
            <circle cx="40" cy="22" r="15" fill="#0d0a18" />
          </svg>
        </div>
      )}

      {/* Sun (day only) */}
      {!isNight && (
        <div className="wp-sun">
          <svg width="70" height="70" viewBox="0 0 70 70">
            {Array.from({ length: 8 }).map((_, i) => (
              <line
                key={i}
                x1="35" y1="5"
                x2="35" y2="18"
                stroke="#ffd93d"
                strokeWidth="3"
                strokeLinecap="round"
                transform={`rotate(${i * 45} 35 35)`}
                opacity="0.7"
              />
            ))}
            <circle cx="35" cy="35" r="18" fill="#ffd93d" opacity="0.6" />
            <circle cx="35" cy="35" r="14" fill="#ffb347" opacity="0.5" />
          </svg>
        </div>
      )}

      {/* Gentle gradient overlay */}
      <div className="wp-gradient" />
    </div>
  )
}
