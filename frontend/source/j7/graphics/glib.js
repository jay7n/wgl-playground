import logger from 'j7/utils/logger'

import vertShader from 'j7/graphics/shaders/vert'
import fragShader from 'j7/graphics/shaders/frag'

import { BasicShader } from './shader.basic'
import { BasicBatch } from './batch.basic'

export class GLib {
    constructor(canvas) {
        Object.assign(this, {
            canvas: null,
            gl: null,
            batches: [],
        })

        if (!canvas) {
            logger.prod.error('sorry. no canvas detected')
            return
        }
        this.canvas = canvas

        const gl = canvas.getContext('webgl2')
        if (!gl) {
            logger.prod.error('sorry. no webgl2 in the given canvas detected')
            return
        }
        this.gl = gl
    }

    _createBasicBatch(gl, vertexData) {
        if (!vertexData) {
            logger.prod.error('creating basic batch failed. no veretxData provided')
        }

        const basicShader = new BasicShader(gl, [{
            type: gl.VERTEX_SHADER,
            source: vertShader,
            fileName: 'vert.glsl'
        }, {
            type: gl.FRAGMENT_SHADER,
            source: fragShader,
            fileName: 'frag.glsl'
        }])

        if (!basicShader) {
            return null
        }

        return  new BasicBatch(gl, basicShader, vertexData)
    }


    addBatch(batch, material) {
        const basicBatch = this._createBasicBatch(this.gl, batch)
        if (!basicBatch) {
            return false
        }
        this.batches.push(basicBatch)
    }

    resize() {  // https://webgl2fundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html

        const devicePixelRatio = window.devicePixelRatio || 1

        const displayActualWidth = Math.floor(this.canvas.clientWidth * devicePixelRatio)
        const displayAcutalHeight = Math.floor(this.canvas.clientWidth * devicePixelRatio)

        if (this.canvas.width != displayActualWidth) {
            this.canvas.width = displayActualWidth
        }
        if (this.canvas.width != displayAcutalHeight) {
            this.canvas.height = displayAcutalHeight
        }
    }

    render() {
        this.resize()

        const gl = this.gl

        // When you need to set the viewport to match the size of the canvas's
        // drawingBuffer this will always be correct
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)

        for (const batch of this.batches) {
            batch.draw()
        }
    }
}
