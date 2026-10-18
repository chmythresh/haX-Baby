import React, { useState } from 'react'
import { PipFace } from '../BootScreen.jsx'
import './AboutPipWindow.css'

const STATS = [
  { label: 'Name', value: 'Pip' },
  { label: 'Species', value: 'Skull Baby' },
  { label: 'Profession', value: 'Junior Dream Engineer' },
  { label: 'Workplace', value: 'Midnight Nursery' },
  { label: 'Status', value: '🌙 On dream shift' },
]

const QUIRKS = [
  { icon: '⭐', text: 'Collects fallen stars' },
  { icon: '🎵', text: 'Hums while working' },
  { icon: '💤', text: 'Falls asleep mid-dream' },
  { icon: '🏮', text: 'Loves warm glowing things' },
  { icon: '📚', text: 'Keeps a dream journal' },
]

export default function AboutPipWindow({ theme }) {
  const [activeTab, setActiveTab] = useState('bio')
  const isNight = theme === 'night'

  return (
    <div className="about-window">
      {/* Header */}
      <div className="about-header">
        <div className="about-pip-portrait">
          <PipFace size={90} glowing={isNight} />
          <div className="about-pip-status" aria-label="Status: Dreaming">
            <span className="status-dot" />
            Dreaming
          </div>
        </div>
        <div className="about-name-area">
          <h2 className="about-name">Hello, I'm Pip!</h2>
          <p className="about-tagline">Junior Dream Engineer at Midnight Nursery</p>
          <p className="about-intro">
            I craft cozy dreams, hum lullabies into starlight, and make sure every little creature
            finds a peaceful sleep. ✨
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="about-tabs" role="tablist" aria-label="About Pip sections">
        {[
          { id: 'bio',     label: '📋 Profile'  },
          { id: 'quirks',  label: '✨ Quirks'   },
          { id: 'message', label: '💌 From Pip' },
        ].map(tab => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            className={`about-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div
        id={`panel-${activeTab}`}
        className="about-content"
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
      >
        {activeTab === 'bio' && (
          <div className="about-bio">
            {STATS.map(s => (
              <div key={s.label} className="stat-row">
                <span className="stat-label">{s.label}</span>
                <span className="stat-value">{s.value}</span>
              </div>
            ))}
            <div className="stat-row">
              <span className="stat-label">Personality</span>
              <div className="personality-tags">
                {['gentle', 'sleepy', 'curious', 'thoughtful', 'creative'].map(t => (
                  <span key={t} className="personality-tag">{t}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quirks' && (
          <div className="about-quirks">
            <p className="quirks-intro">Some things that make Pip... Pip:</p>
            {QUIRKS.map(q => (
              <div key={q.text} className="quirk-item">
                <span className="quirk-icon">{q.icon}</span>
                <span className="quirk-text">{q.text}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'message' && (
          <div className="about-message">
            <div className="message-paper">
              <div className="message-stamp">💌</div>
              <p className="message-text">
                "Hello, little visitor! You found my corner of the dream world.
                I'm so glad you stopped by.
              </p>
              <p className="message-text">
                I spend my nights weaving warm dreams for tired creatures — a meadow here,
                a gentle melody there. Every dream starts with just a tiny spark of light
                and a soft, hopeful hum.
              </p>
              <p className="message-text">
                If you ever can't sleep, just close your eyes and listen for the lullaby.
                I'll be there. 🌙"
              </p>
              <div className="message-signature">— Pip ⭐</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
