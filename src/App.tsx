import { useMemo } from 'react'
import { useGameStore } from './stores/gameStore'
import { getCardType } from './game/lib/scoundrel'
import { type Card, type Suit } from './game/types/card'
import { type CardType } from './game/types/cardType'
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

const suitGlyph: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
}

const suitColorClass: Record<Suit, string> = {
  hearts: 'text-red-500',
  diamonds: 'text-red-500',
  clubs: 'text-slate-900',
  spades: 'text-slate-900',
}

const typeBorder: Record<CardType, string> = {
  monster: 'border-accent-500',
  weapon: 'border-accent-400',
  potion: 'border-accent-600',
}

const App = (): React.JSX.Element => {
  const { state, message, selectCard, flee, reset } = useGameStore()
  const isGameOver = state.health <= 0 || (state.deck.length === 0 && state.room.length === 0)

  const roomSummary = useMemo<RoomSummaryEntry[]>(() => {
    return state.room.map((card: Card) => ({
      type: getCardType(card),
      value: formatCardValue(card.value),
    }))
  }, [state.room])

  return (
    <div className="min-h-screen text-slate-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[280px_1fr]">
        <aside className="flex flex-col gap-6 lg:sticky lg:top-6">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-accent-200">
              Scoundrel // Solo Deck Roguelike
            </p>
            <h1 className="mt-3 text-2xl text-white">Scoundrel</h1>
            <p className="mt-3 text-xs text-slate-300">
              Descend the dungeon. Survive four cards at a time.
            </p>
          </div>

          <div className="grid gap-4 rounded-panel border border-dungeon-400 bg-dungeon-800/70 p-5 shadow-panel">
            <div className="text-xs">
              <p className="text-accent-300">Health</p>
              <p className="mt-1 text-lg text-lime-100">{state.health}</p>
            </div>
            <div className="text-xs">
              <p className="text-accent-300">Weapon</p>
              <p className="mt-1 text-base text-lime-100">
                {state.weapon
                  ? `${formatCardValue(state.weapon.value)} ${suitGlyph[state.weapon.suit]}`
                  : 'None'}
              </p>
            </div>
            <div className="text-xs">
              <p className="text-accent-300">Deck</p>
              <p className="mt-1 text-base text-lime-100">{state.deck.length}</p>
            </div>
          </div>

          <div className="grid gap-3">
            <button
              className="rounded-panel border border-accent-400 px-4 py-3 text-[0.65rem] uppercase tracking-wide text-accent-400 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              onClick={flee}
              disabled={isGameOver}
            >
              Flee (Lose 1)
            </button>
            <button
              className="rounded-panel bg-accent-400 px-4 py-3 text-[0.65rem] uppercase tracking-wide text-dungeon-900 transition hover:-translate-y-0.5 hover:shadow-lg"
              onClick={reset}
            >
              Reset Run
            </button>
          </div>

          <div className="rounded-panel border border-dungeon-400 bg-dungeon-800/70 p-5">
            <h2 className="text-sm text-white">Quick Rules</h2>
            <ul className="mt-4 grid gap-3 text-[0.7rem] text-slate-300">
              <li className="flex gap-2"><span className="text-accent-300">◆</span>Monsters (♣/♠): take damage = value − weapon.</li>
              <li className="flex gap-2"><span className="text-accent-300">◆</span>Weapons (♦): replace your weapon.</li>
              <li className="flex gap-2"><span className="text-accent-300">◆</span>Potions (♥): heal value, no consecutive potions.</li>
              <li className="flex gap-2"><span className="text-accent-300">◆</span>Flee: put room on bottom, lose 1 health.</li>
              <li className="flex gap-2"><span className="text-accent-300">◆</span>Run ends at 0 health or empty deck.</li>
            </ul>
          </div>
        </aside>

        <main className="flex flex-col gap-6">
          <header>
            <h2 className="text-xl text-white">Descend the dungeon. Survive the room.</h2>
            <p className="mt-2 text-xs text-slate-300">
              Fight or flee four cards at a time. Potions can heal, weapons can
              save you, and every escape costs blood.
            </p>
          </header>

          <section className="rounded-[20px] border border-dungeon-500 bg-dungeon-900/70 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base text-white">Room</h2>
              {isGameOver && <span className="text-xs text-slate-400">Run complete</span>}
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {state.room.map((card: Card, index: number) => {
                const cardType = getCardType(card)
                return (
                  <button
                    key={card.id}
                    className={`flex flex-col items-center gap-3 rounded-panel border-2 bg-dungeon-800/80 p-4 text-[0.6rem] uppercase tracking-wide text-white transition hover:-translate-y-1 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 ${typeBorder[cardType]}`}
                    onClick={() => selectCard(index)}
                    disabled={isGameOver}
                  >
                    <div className="flex h-[120px] w-[84px] flex-col items-center justify-center gap-2 rounded-[12px] border-2 border-slate-900 bg-amber-50 text-slate-900">
                      <span className={`text-xl ${suitColorClass[card.suit]}`}>
                        {suitGlyph[card.suit]}
                      </span>
                      <span className="text-base">{formatCardValue(card.value)}</span>
                    </div>
                    <span className="text-accent-300">{cardType}</span>
                  </button>
                )
              })}
            </div>
            {state.room.length === 0 && (
              <div className="mt-4 text-xs italic text-slate-300">The dungeon is cleared.</div>
            )}
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[18px] border border-dungeon-500 bg-dungeon-900/70 p-6">
              <h2 className="text-base text-white">Room Intel</h2>
              <p className="mt-3 text-xs text-slate-300">
                {message ?? 'Choose a card to act.'}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {roomSummary.map((card: RoomSummaryEntry, index: number) => (
                  <div
                    key={`${card.type}-${index}`}
                    className={`flex items-center justify-between rounded-[12px] border px-3 py-2 text-[0.6rem] uppercase tracking-wide text-white ${typeBorder[card.type]}`}
                  >
                    <span>{card.type}</span>
                    <span>{card.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[18px] border border-dungeon-500 bg-dungeon-900/70 p-6">
              <h2 className="text-base text-white">Run Status</h2>
              <p className="mt-3 text-xs text-slate-300">
                {isGameOver
                  ? 'Run complete. Reset to play again.'
                  : 'Fight or flee to keep going.'}
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3 text-[0.6rem] uppercase tracking-wide text-white">
                <div className="flex flex-col gap-1 rounded-[12px] border border-accent-300 px-3 py-2">
                  <span>Room</span>
                  <span>{state.room.length}</span>
                </div>
                <div className="flex flex-col gap-1 rounded-[12px] border border-accent-300 px-3 py-2">
                  <span>Deck</span>
                  <span>{state.deck.length}</span>
                </div>
                <div className="flex flex-col gap-1 rounded-[12px] border border-accent-300 px-3 py-2">
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
