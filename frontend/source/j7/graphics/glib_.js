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
            batches: {
                basic: [],
            },
            shaders: {
                basic: null,
            }
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
            logger.prod.error('basic shader failed to create')
            return
        }
        this.shaders.basic = basicShader

    }

    _createBasicBatch(gl, vertexData) {
        if (!vertexData) {
            logger.prod.error('creating basic batch failed. no veretxData provided')
        }

        return  new BasicBatch(gl, this.shaders.basic, vertexData)
    }


    addBatch(batch, material) {
        const basicBatch = this._createBasicBatch(this.gl, batch)
        if (!basicBatch) {
            return false
        }
        this.batches.basic.push(basicBatch)
    }

    resize() {  // https://webgl2fundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
        /* LINOTE: the canvas must be explicitly given an initial size in css styles before it's resized*/

        const devicePixelRatio = window.devicePixelRatio || 1

        const displayActualWidth = Math.floor(this.gl.canvas.clientWidth * devicePixelRatio)
        const displayAcutalHeight = Math.floor(this.gl.canvas.clientHeight * devicePixelRatio)

        if (this.gl.canvas.width != displayActualWidth) {
            this.gl.canvas.width = displayActualWidth
        }
        if (this.gl.canvas.height != displayAcutalHeight) {
            this.gl.canvas.height = displayAcutalHeight
        }
    }

    translate(x, y, z) {
        for (const batch of this.batches.basic) {
            batch.translate(x, y, z)
        }
    }

    render() {
        this.resize()

        const gl = this.gl

        // When you need to set the viewport to match the size of the canvas's
        // drawingBuffer this will always be correct
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)

        for (const batch of this.batches.basic) {
            batch.draw()
        }
    }
}
