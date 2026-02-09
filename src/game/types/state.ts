import { type Card } from './card'

export interface GameState {
  deck: Card[]
  room: Card[]
  health: number
  weapon: Card | null
  lastPotion: boolean
}

export interface ActionResult {
  success: boolean
  message?: string
}
