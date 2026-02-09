# Scoundrel - Agent Instructions

## Project Overview
Roguelike solo card game built with React, Vite, and TypeScript. 
Single-player deck-based dungeon crawler with permadeath mechanics.

## Tech Stack
- **Framework**: React 18+ with hooks
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **Language**: TypeScript (strict mode)
- **Styling**: CSS
- **State**: Zustand

## Project Structure

src/
  App.tsx
  main.tsx
  assets/
  components/
  ui/
  game/
    lib/
    store/
    types/
  hooks/
  stores/
  lib/
  types/


## Key Rules

### Code Style
- Use functional components with hooks only
- Prefer `const` arrow functions: `const Component = () => {}`
- Explicit return types on exported functions
- No `any` types without comment explaining why

### State Management
- Game state (deck, health, dungeon) → Zustand store
- UI state (modals, selections) → local useState
- Derived values → useMemo, not stored state

### Component Patterns

- Game board: GameBoard → renders 4-card room, health, weapon

- Card: Card → draggable/clickable, shows suit + value

- Modals: RunEndModal, HelpModal → portal-based

### Performance

- Card sprites: preload, use CSS sprites or single SVG

- No re-renders on card hover → use CSS :hover

- Animate with CSS transitions, not JS

### Game Logic Location

- Pure functions in game/lib/scoundrel.ts

- No React in game logic files

- Testable without DOM

## Scoundrel Rules Reference


### Implement these exactly:


1. Dungeon: 4 cards visible = "room"

2. Monsters (clubs/spades): Fight or flee
	- Fight: take damage = monster value - weapon value (min 0)

	- Weapon: equip diamond, can kill monsters ≤ weapon value without damage

	- Flee: put room on bottom of deck, lose 1 health


3. Potions (hearts): Heal value, max 20, no consecutive potions

4. Run ends: health ≤ 0 or dungeon empty

5. Scoring: remaining health + skipped cards value

## Commands

	# Install
	pnpm install
	
	# Dev server
	pnpm dev
	
	# Build
	pnpm build
	
	# Preview production
	pnpm preview
	
	# Type check
	pnpm tsc --noEmit
	
	# Lint
	pnpm lint

## Assets Needed

- 52 card faces (SVG or PNG sprites)

- Card backs

- Health/weapon icons

- Sound effects (optional v2)
