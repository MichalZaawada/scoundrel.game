import { Application, extend } from '@pixi/react'
import { Container, Graphics, Text } from 'pixi.js'
import { type Card } from '../types/card'
import { getCardType } from '../lib/scoundrel'

extend({ Container, Graphics, Text })

interface PixiRoomProps {
  room: Card[]
  onSelect: (index: number) => void
  disabled?: boolean
}

const cardWidth = 92
const cardHeight = 128
const cardGap = 16

const suitGlyph: Record<Card['suit'], string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
}

const formatCardValue = (value: number): string => {
  if (value === 1) return 'A'
  if (value === 11) return 'J'
  if (value === 12) return 'Q'
  if (value === 13) return 'K'
  return value.toString()
}

const typeStroke: Record<ReturnType<typeof getCardType>, number> = {
  monster: 0xc75bff,
  weapon: 0x5be7c7,
  potion: 0xff6b6b,
}

const suitColor: Record<Card['suit'], number> = {
  hearts: 0xd13c3c,
  diamonds: 0xd13c3c,
  clubs: 0x1c1c1c,
  spades: 0x1c1c1c,
}

export const PixiRoom = ({ room, onSelect, disabled = false }: PixiRoomProps): React.JSX.Element => {
  const totalCards = Math.max(room.length, 1)
  const width = totalCards * cardWidth + Math.max(totalCards - 1, 0) * cardGap
  const height = cardHeight
  const resolution = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1

  return (
    <div className="rounded-[20px] border border-dungeon-500 bg-dungeon-900/70 p-6">
      <h2 className="text-base text-white">Room (Pixi)</h2>
      <div className="mt-4 overflow-x-auto">
        <Application
          width={width}
          height={height}
          backgroundAlpha={0}
          antialias
          autoDensity
          resolution={resolution}
        >
          {room.map((card, index) => {
            const x = index * (cardWidth + cardGap)
            const type = getCardType(card)
            return (
              <pixiContainer
                key={card.id}
                x={x}
                eventMode={disabled ? 'none' : 'static'}
                cursor={disabled ? 'default' : 'pointer'}
                onPointerTap={() => onSelect(index)}
              >
                <pixiGraphics
                  draw={(graphics) => {
                    graphics.clear()
                    graphics.roundRect(0, 0, cardWidth, cardHeight, 16)
                    graphics.fill({ color: 0x0f152d, alpha: 0.85 })
                    graphics.stroke({ color: typeStroke[type], width: 3 })
                    graphics.roundRect(12, 12, cardWidth - 24, cardHeight - 24, 10)
                    graphics.fill({ color: 0xfdf3d6 })
                    graphics.stroke({ color: 0x111827, width: 2 })
                  }}
                />
                <pixiText
                  text={suitGlyph[card.suit]}
                  x={cardWidth / 2}
                  y={48}
                  anchor={0.5}
                  style={{ fontFamily: '"Press Start 2P"', fontSize: 18, fill: suitColor[card.suit] }}
                />
                <pixiText
                  text={formatCardValue(card.value)}
                  x={cardWidth / 2}
                  y={82}
                  anchor={0.5}
                  style={{ fontFamily: '"Press Start 2P"', fontSize: 14, fill: 0x111827 }}
                />
              </pixiContainer>
            )
          })}
        </Application>
      </div>
      <p className="mt-3 text-[0.6rem] text-slate-400">
        Suits: {room.map((card) => `${suitGlyph[card.suit]}${formatCardValue(card.value)}`).join(' ')}
      </p>
    </div>
  )
}
