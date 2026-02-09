import { create } from 'zustand'
import {
  applyCardChoice,
  fleeRoom,
  initializeGame,
} from '../game/lib/scoundrel'
import { type Card } from '../game/types/card'
import { type GameState } from '../game/types/state'

interface GameStore {
  state: GameState
  message: string | null
  selectCard: (index: number) => void
  flee: () => void
  reset: () => void
  getRoomCardType: (card: Card) => 'monster' | 'weapon' | 'potion'
}

export const useGameStore = create<GameStore>((set, get) => ({
  state: initializeGame(),
  message: null,
  selectCard: (index) => {
    const { state } = get()
    const { state: nextState, result } = applyCardChoice(state, index)
    set({ state: nextState, message: result.message ?? null })
  },
  flee: () => {
    const { state } = get()
    const { state: nextState, result } = fleeRoom(state)
    set({ state: nextState, message: result.message ?? null })
  },
  reset: () => set({ state: initializeGame(), message: null }),
  getRoomCardType: (card) => {
    if (card.suit === 'hearts') {
      return 'potion'
    }
    if (card.suit === 'diamonds') {
      return 'weapon'
    }
    return 'monster'
  },
}))
