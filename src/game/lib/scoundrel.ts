import { type Card, type Suit } from '../types/card'
import { type CardType } from '../types/cardType'
import { type ActionResult, type GameState } from '../types/state'

const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']

export const createDeck = (): Card[] => {
  const cards: Card[] = []
  suits.forEach((suit) => {
    for (let value = 1; value <= 13; value += 1) {
      cards.push({ id: `${suit}-${value}`, suit, value })
    }
  })
  return cards
}

export const shuffleDeck = (
  cards: Card[],
  random: () => number = Math.random,
): Card[] => {
  const shuffled = [...cards]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    const temp = shuffled[index]
    shuffled[index] = shuffled[swapIndex]
    shuffled[swapIndex] = temp
  }
  return shuffled
}

export const drawRoom = (
  deck: Card[],
  room: Card[],
): { deck: Card[]; room: Card[] } => {
  const updatedDeck = [...deck]
  const updatedRoom = [...room]
  while (updatedRoom.length < 4 && updatedDeck.length > 0) {
    const nextCard = updatedDeck.shift()
    if (nextCard) {
      updatedRoom.push(nextCard)
    }
  }
  return { deck: updatedDeck, room: updatedRoom }
}

export const initializeGame = (
  random: () => number = Math.random,
): GameState => {
  const deck = shuffleDeck(createDeck(), random)
  const { deck: remainingDeck, room } = drawRoom(deck, [])
  return {
    deck: remainingDeck,
    room,
    health: 20,
    weapon: null,
    lastPotion: false,
  }
}

export const getCardType = (card: Card): CardType => {
  if (card.suit === 'hearts') {
    return 'potion'
  }
  if (card.suit === 'diamonds') {
    return 'weapon'
  }
  return 'monster'
}

export const applyCardChoice = (
  state: GameState,
  index: number,
): { state: GameState; result: ActionResult } => {
  const isOver = state.health <= 0 || (state.deck.length === 0 && state.room.length === 0)
  if (isOver) {
    return { state, result: { success: false, message: 'Run is already over.' } }
  }

  if (index < 0 || index >= state.room.length) {
    return { state, result: { success: false, message: 'Pick a card in the room.' } }
  }

  const chosen = state.room[index]
  const cardType = getCardType(chosen)

  if (cardType === 'potion' && state.lastPotion) {
    return { state, result: { success: false, message: 'No consecutive potions.' } }
  }

  let health = state.health
  let weapon = state.weapon
  let lastPotion = false

  if (cardType === 'monster') {
    const weaponValue = weapon?.value ?? 0
    const damage = Math.max(0, chosen.value - weaponValue)
    health -= damage
  }

  if (cardType === 'weapon') {
    weapon = chosen
  }

  if (cardType === 'potion') {
    health = Math.min(20, health + chosen.value)
    lastPotion = true
  }

  if (cardType !== 'potion') {
    lastPotion = false
  }

  const remainingRoom = state.room.filter((_, cardIndex) => cardIndex !== index)
  const { deck, room } = drawRoom(state.deck, remainingRoom)

  return {
    state: {
      ...state,
      deck,
      room,
      health,
      weapon,
      lastPotion,
    },
    result: { success: true },
  }
}

export const fleeRoom = (
  state: GameState,
): { state: GameState; result: ActionResult } => {
  const isOver = state.health <= 0 || (state.deck.length === 0 && state.room.length === 0)
  if (isOver) {
    return { state, result: { success: false, message: 'Run is already over.' } }
  }

  if (state.room.length === 0) {
    return { state, result: { success: false, message: 'No cards to flee from.' } }
  }

  const combinedDeck = [...state.deck, ...state.room]
  const health = state.health - 1
  const { deck, room } = drawRoom(combinedDeck, [])

  return {
    state: {
      ...state,
      deck,
      room,
      health,
      lastPotion: false,
    },
    result: { success: true },
  }
}
