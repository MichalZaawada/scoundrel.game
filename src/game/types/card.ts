export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'

export interface Card {
  id: string
  suit: Suit
  value: number
}
