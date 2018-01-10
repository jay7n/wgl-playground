import logger from '@/utils/logger'

import { createMatrix4 } from '@/math'
import { createBasicBatch, BasicBatch } from './batch.basic'
import { SimpleMeshPrimitive, SimpleMeshWireframePrimitive, CameraPrimitive } from './primitive.basic'

const GLib = {
    init(canvas, gl) {
        if (!canvas) {
            logger.prod.error('sorry. no canvas detected')
            return false
        }

        if (!gl) {
            logger.prod.error('sorry. no gl detected')
            return false
        }

        Object.assign(this, {
            canvas,
            gl,
            batches: {
                basic: [],
            },
            viewMat4: createMatrix4(),
            perspectiveProjectionMat4: createMatrix4(),
        })

        return true
    },

    _createBasicBatchWithPrimitive(primitive, options) {
        const vertexData = {
            positions: primitive.vertPosition,
            indices: primitive.vertIndices,
            baryCenters: primitive.vertBaryCenter, // used for wireframe mode, can be empty if not set to wireframe
            mode: primitive.mode,
        }

        const uniformData = {
            transform: primitive.transformMat4
        }

        const batch = createBasicBatch(primitive.key, vertexData, uniformData, options)
        return batch
    },

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
    },

    sync(primitiveList, options) {
        //TODO: sync func should compare & diff the given 'primitiveList' parameter and the
        //TODO: internal this.batches using the same 'key' member, and then do the decision about
        //TODO: whether/how to do 'add', 'update' and/or 'delete' operations according to the issue

        for (const primitive of primitiveList) {
            switch (Object.getPrototypeOf(primitive)) {
            case SimpleMeshPrimitive:
            case SimpleMeshWireframePrimitive: {
                const batch = this._createBasicBatchWithPrimitive(primitive, options)
                this.batches.basic.push(batch)
                break
            }
            case CameraPrimitive: {
                BasicBatch.static.updateUniformData({
                    view: primitive.viewMatrix,
                    perspectiveProjection: primitive.perspectiveProjectionMatrix,
                })
                break
            }
            }
        }
    },

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
    },

    syncAndRender(primitiveList, options) {
        this.sync(primitiveList, options)
        this.render()
    }
}

function createGLib(canvas, gl){
    const glib = Object.create(GLib)
    glib.init(canvas, gl)

    return glib
}

export { createGLib }
