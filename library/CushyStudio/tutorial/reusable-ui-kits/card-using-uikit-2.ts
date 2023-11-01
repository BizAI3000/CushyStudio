import { subform_startImage } from './_ui'

card({
    name: 'card2',
    ui: (formBuilder) => {
        return {
            a: subform_startImage(formBuilder),
            b: subform_startImage(formBuilder),
            c: formBuilder.int({ default: 1 }),
        }
    },
    run: async (flow, p) => {
        flow.print(`startImage: ${p.a.startImage}`)
        flow.print(`startImage: ${p.b.startImage}`)
    },
})