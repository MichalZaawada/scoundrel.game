import { useMemo } from 'react'
import './App.css'
import { useGameStore } from './stores/gameStore'
import { type Card } from './game/types/card'
import { getCardType } from './game/lib/scoundrel'
import { type RoomSummaryEntry } from './types/game'

const formatCardValue = (value: number): string => {
  if (value === 1) {
    return 'A'
  }
  if (value === 11) {
    return 'J'
  }
  if (value === 12) {
    return 'Q'
  }
  if (value === 13) {
    return 'K'
  }
  return value.toString()
}

const suitGlyph: Record<Card['suit'], string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
}

const suitColor: Record<Card['suit'], string> = {
  hearts: 'card-suit--red',
  diamonds: 'card-suit--red',
  clubs: 'card-suit--black',
  spades: 'card-suit--black',
}

const App = (): React.JSX.Element => {
  const { state, message, selectCard, flee, reset } = useGameStore()
  const isGameOver = state.health <= 0 || (state.deck.length === 0 && state.room.length === 0)

  const roomSummary = useMemo(() => {
    return state.room.map((card: Card) => ({
      type: getCardType(card),
      value: formatCardValue(card.value),
    }))
  }, [state.room])

  return (
    <div className="app">
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <p className="eyebrow">Scoundrel // Solo Deck Roguelike</p>
            <h1>Scoundrel</h1>
            <p className="subhead">
              Descend the dungeon. Survive four cards at a time.
            </p>
          </div>
          <div className="status-panel">
            <div className="status">
              <span className="status-label">Health</span>
              <span className="status-value">{state.health}</span>
            </div>
            <div className="status">
              <span className="status-label">Weapon</span>
              <span className="status-value">
                {state.weapon ? `${formatCardValue(state.weapon.value)} ${suitGlyph[state.weapon.suit]}` : 'None'}
              </span>
            </div>
            <div className="status">
              <span className="status-label">Deck</span>
              <span className="status-value">{state.deck.length}</span>
            </div>
          </div>
          <div className="sidebar-actions">
            <button className="btn btn-secondary" onClick={flee} disabled={isGameOver}>
              Flee (Lose 1)
            </button>
            <button className="btn btn-primary" onClick={reset}>
              Reset Run
            </button>
          </div>
          <div className="sidebar-panel">
            <h2>Quick Rules</h2>
            <ul>
              <li>Monsters (♣/♠): take damage = value − weapon.</li>
              <li>Weapons (♦): replace your weapon.</li>
              <li>Potions (♥): heal value, no consecutive potions.</li>
              <li>Flee: put room on bottom, lose 1 health.</li>
              <li>Run ends at 0 health or empty deck.</li>
            </ul>
          </div>
        </aside>

        <main className="content">
          <header className="hero">
            <div>
              <h2>Descend the dungeon. Survive the room.</h2>
              <p className="subhead">
                Fight or flee four cards at a time. Potions can heal, weapons can
                save you, and every escape costs blood.
              </p>
            </div>
          </header>

          <section className="room">
            <div className="room-header">
              <h2>Room</h2>
            </div>
            <div className="card-grid">
              {state.room.map((card: Card, index: number) => (
                <button
                  key={card.id}
                  className={`card-slot ${getCardType(card)}`}
                  onClick={() => selectCard(index)}
                  disabled={isGameOver}
                >
                  <div className="card-face">
                    <span className={`card-suit ${suitColor[card.suit]}`}>
                      {suitGlyph[card.suit]}
                    </span>
                    <span className="card-value">{formatCardValue(card.value)}</span>
                  </div>
                  <span className="card-type">{getCardType(card)}</span>
                </button>
              ))}
            </div>
            {state.room.length === 0 && (
              <div className="empty-room">The dungeon is cleared.</div>
            )}
          </section>

          <section className="meta">
            <div className="log">
              <h2>Room Intel</h2>
              {message && <p className="message">{message}</p>}
              {!message && <p className="message">Choose a card to act.</p>}
              <div className="summary-grid">
                {roomSummary.map((card: RoomSummaryEntry, index: number) => (
                  <div key={`${card.type}-${index}`} className={`summary-card ${card.type}`}>
                    <span>{card.type}</span>
                    <span>{card.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="log">
              <h2>Run Status</h2>
              <p className="message">
                {isGameOver
                  ? 'Run complete. Reset to play again.'
                  : 'Fight or flee to keep going.'}
              </p>
              <div className="summary-grid">
                <div className="summary-card neutral">
                  <span>Room</span>
                  <span>{state.room.length}</span>
                </div>
                <div className="summary-card neutral">
                  <span>Deck</span>
                  <span>{state.deck.length}</span>
                </div>
                <div className="summary-card neutral">
                  <span>Health</span>
                  <span>{state.health}</span>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
