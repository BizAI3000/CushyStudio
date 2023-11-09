import { observer } from 'mobx-react-lite'
import { Button, Toggle } from 'rsuite'
import { Widget_image, Widget_imageOpt } from 'src/controls/Widget'
import { useSt } from '../../state/stateContext'
import { ImageUI } from '../../widgets/galleries/ImageUI'
import { useImageDrop } from '../../widgets/galleries/dnd'
import { useDraft } from '../../widgets/misc/useDraft'
import { TabsUI } from '../../widgets/misc/TabUI'
import { EnumSelectorUI } from './WidgetEnumUI'
import { ScribbleCanvas } from '../../widgets/misc/ScribbleUI'
import { runInAction } from 'mobx'

enum Tab {
    Cushy = 0,
    Comfy,
    Scribble,
    Asset,
}
export const WidgetSelectImageUI = observer(function WidgetSelectImageUI_(p: { req: Widget_image | Widget_imageOpt }) {
    const req = p.req
    const st = useSt()
    const [dropStyle, dropRef] = useImageDrop(st, (i) => {
        runInAction(() => {
            console.log('DROPPED', i)
            req.state.active = true
            req.state.cushy = { type: 'CushyImage', imageID: i.id }
            req.state.pick = 'cushy'
        })
    })
    const draft = useDraft()
    const tabs = [
        {
            title: () => <>Drop</>,
            body: () => (
                <div className='flex gap-2 bg-yellow-900 rounded p-1 self-center'>
                    {req.state.cushy != null ? ( //
                        <div tw='flex items-start'>
                            <ImageUI img={draft.db.images.getOrThrow(req.state.cushy.imageID)} />
                            {req instanceof Widget_imageOpt ? (
                                <Button size='sm' onClick={() => (req.state.active = false)}>
                                    X
                                </Button>
                            ) : null}
                        </div>
                    ) : (
                        <span>drop image here</span>
                    )}
                </div>
            ),
        },
        {
            title: () => <>Pick</>,
            body: () => (
                <>
                    {req.state.comfy && (
                        <img
                            style={{ width: '7rem', height: '7rem' }}
                            src={`${st.getServerHostHTTP()}/view?filename=${encodeURIComponent(
                                req.state.comfy.imageName,
                            )}&type=input&subfolder=`}
                            alt=''
                        />
                    )}

                    <EnumSelectorUI
                        enumName='Enum_LoadImage_image'
                        value={req.state.comfy?.imageName ?? null}
                        isOptional={req.state.pick !== 'comfy' || !req.state.active}
                        onChange={(t) => {
                            // handle nullability for Widget_imageOpt
                            if (
                                t == null &&
                                (req instanceof Widget_imageOpt || req instanceof Widget_image) &&
                                req.state.active &&
                                req.state.pick === 'comfy'
                            ) {
                                req.state.active = false
                            }

                            if (t == null) return
                            // handle value
                            req.state.comfy.imageName = t as Enum_LoadImage_image
                            req.state.pick = 'comfy'
                        }}
                    />
                </>
            ),
        },
        {
            title: () => <>Scribble</>,
            body: () => (
                <ScribbleCanvas
                    style={{ border: '1px solid black' }}
                    fillStyle='black'
                    strokeStyle='white'
                    onChange={(base64: string) => {
                        req.state.paint = { type: 'PaintImage', base64 }
                        if (req.state.pick !== 'paint') req.state.pick = 'paint'
                    }}
                />
            ),
        },
    ]

    // if (req instanceof Widget_imageOpt) {
    //     tabs.unshift({
    //         title: () => <>None</>,
    //         body: () => <div>No image</div>,
    //     })
    // }
    const current = !req.state.active
        ? Tab.Cushy
        : req.state.pick === 'comfy'
        ? Tab.Comfy
        : req.state.pick === 'paint'
        ? Tab.Scribble
        : req.state.pick === 'asset'
        ? Tab.Asset
        : Tab.Asset

    return (
        <div>
            <div style={dropStyle} ref={dropRef} className='flex gap-2 flex-row items-center'>
                <TabsUI
                    // inline
                    disabled={!req.state.active}
                    onClick={(i) => {
                        // if (i === Tab.None && req instanceof Widget_imageOpt) req.state.active = false
                        req.state.active = true
                        if (i === Tab.Cushy) req.state.pick = 'cushy'
                        if (i === Tab.Comfy) req.state.pick = 'comfy'
                        if (i === Tab.Scribble) req.state.pick = 'paint'
                        if (i === Tab.Asset) req.state.pick = 'asset'
                    }}
                    current={current}
                    tabs={tabs}
                />
            </div>
        </div>
    )
})
