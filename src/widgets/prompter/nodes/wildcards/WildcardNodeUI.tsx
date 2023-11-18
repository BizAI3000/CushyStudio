import { wildcards } from './wildcards'
import { WildcardNode } from './WildcardNode'
import { observer } from 'mobx-react-lite'
import { Tooltip, Whisper } from 'src/rsuite/shims'
import { RevealUI } from 'src/rsuite/RevealUI'

export const WildcardNodeUI = observer(function WildcardNodeUI_(p: { node: WildcardNode }) {
    const node = p.node
    return (
        <span
            //
            style={{ border: '1px solid #b2ad54' }}
            className='text-yellow-500 rv-tooltip-container p-0.5'
        >
            <RevealUI>
                <span>{node.wildcardName} 🎲</span>
                <div tw='w-96'>{((wildcards as any)[node.wildcardName] ?? []).slice(0, 20).join(', ') + '...'}</div>
            </RevealUI>
        </span>
    )
})
