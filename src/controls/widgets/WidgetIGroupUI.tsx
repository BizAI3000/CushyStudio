import type { Widget, Widget_group, Widget_groupOpt } from 'src/controls/Widget'

import { observer } from 'mobx-react-lite'
import { WidgetWithLabelUI } from './WidgetWithLabelUI'

export const WidgetGroupUI = observer(function WidgetItemsUI_(p: {
    //
    req:
        | Widget_group<{ [key: string]: Widget }> //
        | Widget_groupOpt<{ [key: string]: Widget }>
}) {
    const req = p.req
    const isTopLevel = req.input.topLevel
    const groupFields = Object.entries(req.state.values)
    const showAsCard = groupFields.length > 0 && !isTopLevel
    return (
        <div
            tw={[
                //
                'flex rounded-box bg-opacity-95 items-start w-full text-base-content',
                showAsCard ? 'mb-2' : undefined,
                showAsCard ? 'bg-base-300 bg-opacity-30' : undefined,
                showAsCard ? 'virtualBorder' : undefined,
            ]}
            style={{
                position: 'relative',
                // borderRadius: '0.5rem',
                // border: showAsCard ? 'solid' : undefined,
                paddingLeft: showAsCard ? '.2rem' : undefined,
            }}
        >
            {req.state.collapsed ? null : (
                <div
                    // style={isTopLevel ? undefined : { border: '1px solid #262626' }}
                    tw={['_WidgetGroupUI w-full', req.input.layout === 'H' ? 'flex flex-wrap gap-2' : null]}
                    className={req.input.className}
                >
                    {groupFields.map(([rootKey, sub], ix) => (
                        <WidgetWithLabelUI //
                            isTopLevel={isTopLevel}
                            vertical={req.state.vertical}
                            key={rootKey}
                            labelPos={sub.input.labelPos}
                            rootKey={rootKey}
                            req={sub}
                        />
                    ))}
                </div>
            )}
        </div>
    )
})
