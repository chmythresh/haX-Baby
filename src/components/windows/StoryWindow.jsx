import React, { useState, useMemo } from 'react'
import './StoryWindow.css'

const SCENES = [
  {
    id: 1,
    title: 'The Lost Star',
    emoji: '⭐',
    bgColor: '#1a1225',
    textColor: '#f0e0d8',
    accentColor: '#ffd700',
    text: `One very quiet night, when the moon was hiding behind a lazy cloud and the wind had gone to sleep early, Pip was sitting outside the Midnight Nursery counting fireflies.

That's when Pip noticed it — a tiny glimmer in the tall grass. Not a firefly. Something warmer. Something still.

It was a fallen star, small enough to fit in one hand, still faintly glowing, as if it didn't quite know it had come down.

Pip picked it up very carefully, wrapped it in a soft piece of felt, and whispered: "Don't worry. I'll keep you safe."`,
    stars: 12,
    floatingElements: ['⭐', '✨', '💫'],
  },
  {
    id: 2,
    title: 'A Little Idea',
    emoji: '🎵',
    bgColor: '#230f35',
    textColor: '#f0e0f0',
    accentColor: '#d8b4f8',
    text: `Back inside, Pip set the star on the little workbench and watched it flicker.

Every time Pip hummed — just a low, wandering little tune with no particular plan — the star pulsed brighter. Slow hum: slow glow. Quick cheerful hum: quick cheerful shimmer.

Pip hadn't planned to discover anything that evening. Pip was just humming because that's what Pip does when thinking.

But something was happening. The star wasn't just glowing — it was listening.

"Oh," said Pip very quietly. "Oh, that's interesting."`,
    stars: 10,
    floatingElements: ['🎵', '♪', '✨', '💜'],
  },
  {
    id: 3,
    title: 'The First Dream',
    emoji: '💤',
    bgColor: '#0f1a30',
    textColor: '#d0e8f8',
    accentColor: '#a0c8f0',
    text: `Down the lane lived a little creature named Bramble — a hedgehog who hadn't slept properly in three nights. Too many worrying thoughts, all piled on top of each other.

Pip carried the star to Bramble's window very quietly. Pip hummed the gentlest melody imaginable — slower than a heartbeat, softer than a yawn — and let the star's warm light drift through the glass.

By the third verse (if it was a verse — it was more of a feeling), Bramble's eyes closed.

By the fifth, Bramble was dreaming of a warm garden where nothing had sharp edges.

The star had carried the dream right where it needed to go.`,
    stars: 14,
    floatingElements: ['💤', '🌙', '⭐', '🦔'],
  },
  {
    id: 4,
    title: 'Midnight Nursery',
    emoji: '🏠',
    bgColor: '#1e0a28',
    textColor: '#f0d8f0',
    accentColor: '#e878a0',
    text: `Word got around, as it does in small neighborhoods where everyone knows everyone else.

Pip made an official application to be hired as Junior Dream Engineer at Midnight Nursery — mostly by writing it in careful letters on a piece of pale blue paper and pushing it under the front door.

The answer came back the same night, on paper that smelled faintly of lavender: "The position is yours, if you'd like it. Please bring the star."

Now Pip works every night, building dreams, tuning lullabies, and delivering little lanterns of warm light to tired creatures all over the neighborhood.

The star still lives on the workbench. It still listens when Pip hums. ✨`,
    stars: 16,
    floatingElements: ['🏠', '🌟', '💌', '🏮'],
  },
]

// Pre-generate stable star positions per scene so they don't jump on re-render
const SCENE_STARS = SCENES.map(s =>
  Array.from({ length: s.stars }, (_, i) => ({
    id: i,
    x: 5 + ((i * 37 + 11) % 87),          // deterministic spread
    y: 5 + ((i * 53 + 7)  % 87),
    delay: (i * 0.23) % 3,
  }))
)

export default function StoryWindow() {
  const [currentScene, setCurrentScene] = useState(0)
  const scene = SCENES[currentScene]
  const sceneStars = SCENE_STARS[currentScene]

  return (
    <div className="story-window">
      {/* Scene panel */}
      <div
        className="story-scene"
        style={{
          '--scene-bg':     scene.bgColor,
          '--scene-text':   scene.textColor,
          '--scene-accent': scene.accentColor,
        }}
        key={scene.id}
      >
        {/* Decorative background layer */}
        <div className="scene-floaters" aria-hidden="true">
          {scene.floatingElements.map((el, i) => (
            <span
              key={i}
              className="scene-float-el"
              style={{
                left:            `${10 + i * 22}%`,
                animationDelay:  `${i * 0.8}s`,
                animationDuration:`${3 + i * 0.5}s`,
              }}
            >
              {el}
            </span>
          ))}
          {sceneStars.map(s => (
            <div
              key={s.id}
              className="scene-star"
              style={{
                left:           `${s.x}%`,
                top:            `${s.y}%`,
                animationDelay: `${s.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Readable content */}
        <div className="scene-content">
          <div className="scene-number" aria-label={`Scene ${scene.id} of ${SCENES.length}`}>
            Scene {scene.id} / {SCENES.length}
          </div>
          <div className="scene-emoji" aria-hidden="true">{scene.emoji}</div>
          <h3 className="scene-title">{scene.title}</h3>
          <div className="scene-text">
            {scene.text.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Scene picker */}
      <nav className="story-progress" aria-label="Jump to scene">
        {SCENES.map((s, i) => (
          <button
            key={s.id}
            className={`progress-dot ${i === currentScene ? 'active' : ''} ${i < currentScene ? 'done' : ''}`}
            onClick={() => setCurrentScene(i)}
            aria-current={i === currentScene ? 'step' : undefined}
            aria-label={`Scene ${i + 1}: ${s.title}${i < currentScene ? ' (read)' : ''}`}
          >
            <span aria-hidden="true">
              {i < currentScene ? '✓' : i === currentScene ? s.emoji : '○'}
            </span>
          </button>
        ))}
      </nav>

      {/* Prev / next */}
      <div className="story-nav">
        <button
          className="nav-btn prev-btn"
          onClick={() => setCurrentScene(s => Math.max(s - 1, 0))}
          disabled={currentScene === 0}
          aria-label="Previous scene"
        >
          ← Previous
        </button>

        <span className="nav-label" aria-hidden="true">{scene.title}</span>

        <button
          className="nav-btn next-btn"
          onClick={() => setCurrentScene(s => Math.min(s + 1, SCENES.length - 1))}
          disabled={currentScene === SCENES.length - 1}
          aria-label="Next scene"
        >
          Next →
        </button>
      </div>

      {currentScene === SCENES.length - 1 && (
        <div className="story-end" aria-live="polite">
          <span>🌙 <em>And they all dreamed beautifully. The end.</em></span>
          <button className="restart-btn" onClick={() => setCurrentScene(0)}>
            Read Again ↺
          </button>
        </div>
      )}
    </div>
  )
}
