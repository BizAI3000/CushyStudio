import * as fs from '@tauri-apps/api/fs'
import * as path from '@tauri-apps/api/path'

import { Workspace } from '../core/Workspace'

import { drawOpenPoseBones } from './drawPoseV2'
import samplePose1 from './json_inputs/32/001.json'
import samplePose2 from './json_inputs/32/002.json'
import samplePose3 from './json_inputs/32/003.json'
import samplePose4 from './json_inputs/32/004.json'
import samplePose5 from './json_inputs/32/005.json'
import samplePose6 from './json_inputs/32/006.json'
import samplePose7 from './json_inputs/32/007.json'
import samplePose8 from './json_inputs/32/008.json'
import samplePose9 from './json_inputs/32/009.json'

export class OpenPoseAnimV0 {
    constructor(public workspace: Workspace) {}
    poses = [
        //
        samplePose1,
        samplePose2,
        samplePose3,
        samplePose4,
        samplePose5,
        samplePose6,
        samplePose7,
        samplePose8,
        samplePose9,
    ]
    ctx: CanvasRenderingContext2D | null = null

    // @internal
    private intervalId: NodeJS.Timer | null = null

    ix = 0

    drawAllToPngAndSaveLocally = async () => {
        let i = -1
        const targetFolderPath = this.workspace.folder + path.sep + 'images'
        // ensure target folder exists
        await fs.createDir(targetFolderPath, { recursive: true })

        for (const pose of this.poses) {
            i++
            // Create a new canvas element
            const canvas = document.createElement('canvas')
            canvas.width = 640 // 🔴 openposeData.image_width
            canvas.height = 480 // 🔴 openposeData.image_height

            // Get the 2D rendering context
            const ctx = canvas.getContext('2d')
            if (ctx == null) return console.log('❌ ctx is null')

            // Draw the OpenPose bones on the canvas
            drawOpenPoseBones(pose, ctx)

            // Convert the canvas to a PNG image and return it
            const b64url = canvas.toDataURL('image/png')

            const res = await fetch(b64url)
            const blob2 = await res.blob()
            const binArr = await blob2.arrayBuffer()

            const fPath = targetFolderPath + path.sep + `test-${i}.png`
            await fs.writeBinaryFile(fPath, binArr, { dir: fs.Dir.Document })

            console.log('✅', fPath)
        }
        console.log('✅ DONE')
    }

    start = () => {
        if (this.intervalId) return
        this.intervalId = setInterval(() => this.draw(), 200)
    }

    stop = () => {
        if (!this.intervalId) return
        clearInterval(this.intervalId)
        this.intervalId = null
    }

    draw = async () => {
        if (this.ctx == null) return
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        drawOpenPoseBones(this.poses[this.ix++ % this.poses.length], this.ctx)
    }
}