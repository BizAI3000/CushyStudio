import type { Runtime } from 'src/back/Runtime'
import type { FormBuilder } from 'src/controls/FormBuilder'
import type { Slot } from 'src/core/Slot'
import type { OutputFor } from '../_prefabs'

export const ui_latent = (form: FormBuilder) => {
    return form.group({
        label: 'Start from',
        items: () => ({
            image: form.imageOpt({ group: 'latent' }),
            size: form.size({}),
            // width: form.int({ default: 512, group: 'latent', step: 128, min: 128, max: 4096 }),
            // height: form.int({ default: 768, group: 'latent', step: 128, min: 128, max: 4096 }),
            batchSize: form.int({ default: 1, group: 'latent', min: 1, max: 8 }),
        }),
    })
}

export const run_latent = async (p: {
    //
    flow: Runtime
    opts: OutputFor<typeof ui_latent>
    vae: _VAE
}) => {
    // init stuff
    const graph = p.flow.nodes
    const opts = p.opts

    // misc calculatiosn
    let width: number | Slot<'INT'>
    let height: number | Slot<'INT'>
    let latent: HasSingle_LATENT

    // case 1. start form image
    if (opts.image) {
        const image = await p.flow.loadImageAnswer(opts.image)
        latent = graph.VAEEncode({ pixels: image, vae: p.vae })
        const size = graph.Image_Size_to_Number({ image: image })
        width = size.outputs.width_int
        height = size.outputs.height_int
    }

    // case 2. start form empty latent
    else {
        width = /* opts.flip ? opts.size.height : */ opts.size.width
        height = /* opts.flip ? opts.size.width : */ opts.size.height
        latent = graph.EmptyLatentImage({
            batch_size: opts.batchSize ?? 1,
            height: height,
            width: width,
        })
    }

    // return everything
    return { latent, width, height }
}
