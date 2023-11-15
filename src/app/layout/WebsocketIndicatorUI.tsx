import { observer } from 'mobx-react-lite'
import { Button, Loader, Message, Popover, Whisper } from 'src/rsuite/shims'
import { useSt } from '../../state/stateContext'

export const WebsocketIndicatorUI = observer(function WebsocketIndicatorUI_(p: {}) {
    const st = useSt()
    return (
        <Whisper
            enterable
            placement='autoVerticalEnd'
            speaker={
                <Popover>
                    {/*  */}
                    {st.schemaReady.done ? null : (
                        <Message showIcon type='warning'>
                            <span>Is your ComfyUI server running? </span>
                            <span>You config file says it should be accessible at</span>
                            <div>{st.getWSUrl()}</div>
                        </Message>
                    )}
                    {st.ws.debugMessages.map((x, ix) =>
                        x.type === 'error' ? ( //
                            <div key={ix} className='text-red-400'>
                                {x.message}
                            </div>
                        ) : (
                            <div key={ix}>{x.message}</div>
                        ),
                    )}
                </Popover>
            }
        >
            {st.ws.isOpen ? (
                <div className='flex gap-1 text-sm px-1 rounded cursor-help'>
                    {/* <span className='material-symbols-outlined text-green-400 '>check_circle</span> */}
                    <span className='text-green-300'>WS</span>
                </div>
            ) : (
                <Button size='xs' color='orange' appearance='ghost' className='flex gap-2'>
                    <Loader />
                    <div>ComfyUI</div>
                </Button>
            )}
        </Whisper>
    )
})
