card({
    ui: (form) => ({
        seed1: form.seed({ defaultMode: 'randomize' }),
    }),

    run: async (flow, form) => {
        const graph = flow.nodes

        const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: 'revAnimated_v122.safetensors' })
        const latent_image = graph.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })
        const negative = graph.CLIPTextEncode({ clip: ckpt, text: 'bad' })
        const positive = graph.CLIPTextEncode({ clip: ckpt, text: 'a house' })

        graph.PreviewImage({
            images: graph.VAEDecode({
                vae: ckpt,
                samples: graph.KSampler({
                    latent_image,
                    model: ckpt,
                    negative,
                    positive,
                    sampler_name: 'ddim',
                    scheduler: 'karras',
                    cfg: 8,
                    denoise: 1,
                    seed: form.seed1,
                    steps: 10,
                }),
            }),
        })

        //        👇 for every value
        for (const i of [1, 2, 3]) {
            //                 👇 we patch the postive text
            positive.json.inputs.text = `a house ${i}`
            //        👇 and re-run the prompt
            await flow.PROMPT()
        }

        // 👇 as a bonus, here is a way to access last image
        // within the action lifetime so you can do stuff with it
        const lastImageURL = flow.lastImage.comfyUrl
        flow.print(lastImageURL)
        // await flow.createAnimation()
    },
})
