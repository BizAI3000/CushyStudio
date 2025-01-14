import type { STATE } from 'src/state/state'

import { observer } from 'mobx-react-lite'
import { ImageL } from 'src/models/Image'
import { Button, DropdownMenu, Popover, PositionChildProps, Whisper } from 'src/rsuite/shims'
import { MenuItem } from 'src/rsuite/Dropdown'
import { useSt } from '../../state/stateContext'
import { useImageDrag } from './dnd'
import { RevealUI } from 'src/rsuite/RevealUI'

export const ImageUI = observer(function ImageUI_(p: { img: ImageL }) {
    const image = p.img
    const st = useSt()
    const GalleryImageWidth = st.gallerySizeStr
    const [{ opacity }, dragRef] = useImageDrag(image)

    const IMG =
        image.data.type === 'video' ? (
            <video
                //
                onMouseEnter={(ev) => (st.hovered = { type: 'video', url: image.url })}
                onMouseLeave={() => {
                    if (st.hovered?.url === image.url) st.hovered = null
                }}
                style={{
                    //
                    width: GalleryImageWidth,
                    height: GalleryImageWidth,
                }}
                src={image.url}
            ></video>
        ) : (
            <img
                src={image.url}
                ref={dragRef}
                loading='lazy'
                onMouseEnter={(ev) => (st.hovered = { type: 'image', url: image.url })}
                onMouseLeave={() => {
                    if (st.hovered?.url === image.url) st.hovered = null
                }}
                style={{
                    objectFit: 'contain',
                    width: GalleryImageWidth,
                    height: GalleryImageWidth,
                    opacity,
                    padding: '0.2rem',
                    borderRadius: '.5rem',
                }}
                // onAuxClick={(e) => {
                //     st.hovered = null
                //     st.currentAction = { type: 'paint', imageID: image.id }
                // }}
                onClick={() => {
                    st.layout.addImage(image.id)
                    // st.lightBox.opened = true
                    // st.lightBox.getImgs
                }}
            />
        )
    return (
        <>
            {/* right click logic 👇 */}
            <RevealUI
                enableRightClick
                //
            >
                <div>{IMG}</div>
                <div>
                    <Button
                        icon={<span className='material-symbols-outlined'>edit</span>}
                        onClick={() => st.layout.addPaint(image.id)}
                    >
                        Paint
                    </Button>
                    {/* <MenuItem onClick={() => st.layout.addPaint(image.id)}>Mask</MenuItem> */}
                    {/* <DropdownMenu title='Edit'>
                    <DropdownItem eventKey={1}>New File</DropdownItem>
                    <DropdownItem eventKey={2}>New File with Current Profile</DropdownItem>
                    </DropdownMenu> */}
                    {/* <DropdownItem eventKey={3}>Start Flow from this</DropdownItem> */}
                    {/* <DropdownItem eventKey={4}>Export PDF</DropdownItem>
                    <DropdownItem eventKey={5}>Export HTML</DropdownItem>
                    <DropdownItem eventKey={6}>Settings</DropdownItem>
                    <DropdownItem eventKey={7}>About</DropdownItem> */}
                </div>
            </RevealUI>
            {/* {IMG} */}
        </>
    )
})

export const PlaceholderImageUI = observer(function PlaceholderImageUI_(p: {}) {
    const st = useSt()
    const GalleryImageWidth = st.configFile.value.galleryImageSize ?? 48
    return (
        <div
            className='scale-in-center'
            style={{
                objectFit: 'contain',
                width: GalleryImageWidth,
                height: GalleryImageWidth,
                padding: '0.2rem',
                borderRadius: '.5rem',
            }}
        />
    )
})
