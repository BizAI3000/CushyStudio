import { observer } from 'mobx-react-lite'
import { Button, Input, Panel } from 'rsuite'
import { DraftL } from 'src/models/Draft'
import { JSONHighlightedCodeUI } from '../TypescriptHighlightedCodeUI'
import { TabUI } from '../layout/TabUI'
import { ScrollablePaneUI } from '../scrollableArea'
import { draftContext } from '../useDraft'
import { WidgetWithLabelUI } from './WidgetUI'

/**
 * this is the root interraction widget
 * if a workflow need user-supplied infos, it will send an 'ask' request with a list
 * of things it needs to know.
 */
export const DraftUI = observer(function StepUI_(p: { draft: DraftL }) {
    const draft = p.draft
    const tool = draft.tool.item
    const formDefinition = tool?.data.form ?? {}
    return (
        <draftContext.Provider value={draft} key={draft.id}>
            <div className='flex'>
                <Input
                    onChange={(v) => draft.update({ title: v })}
                    size='sm'
                    placeholder='preset title'
                    value={draft.data.title ?? ''}
                />
                <Button
                    size='sm'
                    className='self-start'
                    color='green'
                    appearance='ghost'
                    startIcon={<span className='material-symbols-outlined'>play_arrow</span>}
                    onClick={() => draft.start()}
                >
                    Run
                </Button>
            </div>
            <ScrollablePaneUI className='flex-grow'>
                <Panel>
                    <form
                        onKeyUp={(ev) => {
                            // submit on meta+enter
                            if (ev.key === 'Enter' && (ev.metaKey || ev.ctrlKey)) {
                                console.log('SUBMIT')
                                ev.preventDefault()
                                ev.stopPropagation()
                                draft.start()
                            }
                        }}
                        onSubmit={(ev) => {
                            console.log('SUBMIT')
                            ev.preventDefault()
                            ev.stopPropagation()
                            draft.start()
                        }}
                    >
                        {Object.entries(formDefinition).map(([rootKey, req], ix) => {
                            return (
                                <WidgetWithLabelUI
                                    path={[rootKey]}
                                    key={rootKey}
                                    rootKey={rootKey}
                                    req={req}
                                    ix={ix}
                                    draft={draft}
                                />
                            )
                        })}
                    </form>
                    <TabUI>
                        <div>result</div>
                        <JSONHighlightedCodeUI code={JSON.stringify(draft.finalJSON, null, 4)} />
                        <div>form</div>
                        <JSONHighlightedCodeUI code={JSON.stringify(formDefinition, null, 4)} />
                        <div>state</div>
                        <JSONHighlightedCodeUI code={JSON.stringify(draft.data.params, null, 4)} />
                    </TabUI>
                </Panel>
            </ScrollablePaneUI>
        </draftContext.Provider>
    )
})
