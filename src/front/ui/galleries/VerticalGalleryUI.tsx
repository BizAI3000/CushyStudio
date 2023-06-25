import type { FolderL } from 'src/models/Folder'

import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { IconButton } from 'rsuite'
import { useSt } from '../../FrontStateCtx'
import { GalleryFolderUI } from './GalleryFolderUI'
import { ImageUI, PlaceholderImageUI } from './ImageUI'
import { useImageDrop } from './dnd'

export const VerticalGalleryUI = observer(function VerticalGalleryUI_(p: {}) {
    const st = useSt()
    const [dropStyle, dropRef] = useImageDrop((i) => {
        i.update({ folderID: null })
    })
    return (
        <div className='flex'>
            {/* MAIN IMAGE COLUMN */}
            <div ref={dropRef} className='shrink-0 relative overflow-auto noscrollbar' style={{ width: '3.4rem', ...dropStyle }}>
                <IconButton disabled icon={<I.Close />} size='xs' appearance='link'></IconButton>
                <div className='absolute insert-0'>
                    <div className='flex flex-col-reverse' style={{ overflowX: 'auto' }}>
                        <PlaceholderImageUI />
                        {st.imageReversed.map((img, ix) => (
                            <ImageUI key={ix} img={img} />
                        ))}
                    </div>
                </div>
            </div>

            {/*  EXTRA FOLDERS */}
            {st.db.folders.map((v: FolderL) => {
                return (
                    <GalleryFolderUI //
                        direction='vertical'
                        key={v.id}
                        folder={v}
                    />
                )
            })}
        </div>
    )
})