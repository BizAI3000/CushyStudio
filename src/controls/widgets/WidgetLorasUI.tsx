import { observer } from 'mobx-react-lite'
import { Button, Input, MultiCascader } from 'src/rsuite/shims'
import { Widget_loras } from 'src/controls/Widget'
import { useSt } from '../../state/stateContext'
import { parseFloatNoRoundingErr } from 'src/utils/misc/parseFloatNoRoundingErr'
import { InputNumberUI } from 'src/rsuite/InputNumberUI'
// ----------------------------------------------------------------------

export const WidgetLorasUI = observer(function LoraWidgetUI_(p: { req: Widget_loras }) {
    const req = p.req
    const st = useSt()
    const schema = st.schema
    if (schema == null) return <div>❌ no schema</div>
    const values = req.state.loras
    const names = values.map((x) => x.name)

    return (
        <div>
            <MultiCascader //
                size='sm'
                style={{ maxWidth: '300px' }}
                value={names}
                menuWidth={300}
                data={req.FOLDER}
                onChange={(rawPicks: (string | number)[]) => {
                    const picks = rawPicks.map((raw) => {
                        if (typeof raw === 'number') return raw.toString()
                        return raw.replace(/\\/g, '/')
                    })
                    console.log({ picks })
                    const nextNames: string[] = []
                    for (const rawPath of req.allLoras) {
                        const path = rawPath.replace(/\\/g, '/')
                        for (const v of picks) {
                            if (typeof v == 'number') continue
                            if (path.startsWith(v)) {
                                nextNames.push(rawPath)
                            }
                        }
                    }
                    // remove old vals
                    for (const oldNv of req.selectedLoras.keys()) {
                        if (!nextNames.includes(oldNv)) req.selectedLoras.delete(oldNv)
                    }
                    // add new vals
                    for (const nv of nextNames) {
                        if (req.selectedLoras.has(nv)) continue
                        req.selectedLoras.set(nv, { strength_clip: 1, strength_model: 1, name: nv as any })
                    }
                    // const nextValues: SimplifiedLoraDef[] = nextNames.map(
                    //     (x): SimplifiedLoraDef => ({
                    //         name: x as any,
                    //         strength_clip: 1,
                    //         strength_model: 1,
                    //     }),
                    // )
                    const nextValues = [...req.selectedLoras.values()]
                    req.state.loras = nextValues
                }}
                // block
            />
            <div>
                {[...req.selectedLoras.entries()].map(([loraName, sld]) => (
                    <div key={loraName} className='flex items-start'>
                        <div className='shrink-0'>{loraName.replace('.safetensors', '')}</div>
                        <div className='flex-grow'></div>
                        <InputNumberUI
                            value={sld.strength_clip}
                            step={0.1}
                            onValueChange={(v) => (sld.strength_clip = parseFloatNoRoundingErr(v, 2))}
                            mode='float'
                            // style={{ width: '3.5rem' }}
                            // type='number'
                            // size='xs'
                        />
                        <InputNumberUI
                            value={sld.strength_model}
                            step={0.1}
                            onValueChange={(v) => (sld.strength_model = parseFloatNoRoundingErr(v, 2))}
                            mode='float'
                            // style={{ width: '3.5rem' }}
                            // type='number'
                            // size='xs'
                        />
                        <Button
                            size='xs'
                            icon={<span className='material-symbols-outlined'>delete</span>}
                            onClick={() => {
                                const next = values.filter((x) => x.name !== loraName)
                                req.selectedLoras.delete(loraName)
                                req.state.loras = next
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
})
