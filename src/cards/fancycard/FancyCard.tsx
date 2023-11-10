import type { CSSProperties } from 'react'

import { makeAutoObservable, observable, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'

import { Tag } from 'rsuite'
import { useSt } from 'src/state/stateContext'
import { CardFile } from '../CardFile'
import { Deck } from '../Deck'

import './FancyCard.css' // Assuming the CSS is written in this file
import { ActionFavoriteBtnUI } from '../CardPicker2UI'
import { GithubUserUI } from '../GithubAvatarUI'
import { CardIllustrationUI } from './CardIllustrationUI'

export class FancyCardState {
    constructor(public theme: CardStyle) {
        makeAutoObservable(this, {
            cardStyle: observable.ref,
            gradientStyle: observable.ref,
            sparklesStyle: observable.ref,
        })
    }

    hoverStyle: string = ''
    setHoverStyle: (style: string) => void = (style) => (this.hoverStyle = style)

    cardStyle: CSSProperties = {}
    gradientStyle: CSSProperties = {}
    sparklesStyle: CSSProperties = {}

    handleMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent> | MouseEvent | TouchEvent) => {
        // normalise touch/mouse
        let pos = [0, 0]
        if (e instanceof TouchEvent) {
            e.preventDefault()
            pos = [e.touches[0].clientX, e.touches[0].clientY]
        } else {
            const mouseEvent = (e as any).nativeEvent as MouseEvent
            pos = [mouseEvent.offsetX, mouseEvent.offsetY]
        }

        const card = e.currentTarget as HTMLElement

        // math for mouse position
        const [l, t] = pos
        const h = card.clientHeight
        const w = card.clientWidth
        const px = Math.abs(Math.floor((100 / w) * l) - 100)
        const py = Math.abs(Math.floor((100 / h) * t) - 100)
        const pa = 50 - px + (50 - py)

        // math for gradient / background positions
        const lp = 50 + (px - 50) / 1.5
        const tp = 50 + (py - 50) / 1.5
        const pxSpark = 50 + (px - 50) / 7
        const pySpark = 50 + (py - 50) / 7
        const pOpc = 20 + Math.abs(pa) * 1.5
        const ty = 0.4 * ((tp - 50) / 2) * -1
        const tx = 0.4 * ((lp - 50) / 1.5) * 0.5

        // before
        this.cardStyle = { transform: `rotateX(${ty}deg) rotateY(${tx}deg)` }
        this.gradientStyle = { backgroundPosition: `${lp}% ${tp}%` }
        this.sparklesStyle = { opacity: `${pOpc / 100}`, backgroundPosition: `${pxSpark}% ${pySpark}%` }
    }
}

export type CardStyle = 'A' | 'B' | 'C' | 'D'

export const FancyCardUI = observer(function FancyCardUI_(p: {
    //
    deck: Deck
    style: CardStyle
    card: CardFile
}) {
    const uiSt = useMemo(() => new FancyCardState(p.style), [p.style])
    const card = p.card
    return (
        <div className='m-2' tw='cursor-pointer relative'>
            <div
                tw='p-1'
                style={uiSt.cardStyle}
                className={`card STYLE_${p.style}`}
                onMouseMove={uiSt.handleMove}
                // onTouchMove={uiSt.handleMove}
                // onMouseOut={uiSt.handleOut}
                // onTouchEnd={uiSt.handleOut}
                // onTouchCancel={uiSt.handleOut}
            >
                <div tw='overflow-auto whitespace-pre-wrap font-bold flex-grow' style={{ fontSize: '1rem' }}>
                    <ActionFavoriteBtnUI card={card} />
                    {card.displayName}
                </div>
                <div tw='flex'>
                    <CardIllustrationUI card={card} size='12rem' />
                    <div tw='flex-grow flex flex-col ml-1'>
                        <div>
                            {(card.manifest.categories ?? []).map((i, ix) => (
                                <Tag key={ix}>{i}</Tag>
                            ))}
                        </div>
                        <div style={{ width: '10rem', height: '5rem' }} tw='m-1 flex-grow text-sm'>
                            {card.description}
                        </div>
                        <GithubUserUI username={card.deck.githubUserName} showName size='1.2rem' tw='text-gray-300' />
                    </div>
                </div>
                {/* ------------------------------------------------------------- */}
                {/* Content of the card */}
                {/* <div className={`card STYLE_${p.style}`}></div> */}
                {/* <div tw='pointer-events-none' style={uiSt.gradientStyle} className='card_before'></div> */}
                {/* <div style={uiSt.sparklesStyle} className='card_after'></div> */}
            </div>
        </div>
    )
})
