import logger from 'j7/utils/logger'

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
            // shaders: {
            //     basic: null,
            // }
        })

        // const gl = canvas.getContext('webgl2')
        // if (!gl) {
        //     logger.prod.error('sorry. no webgl2 in the given canvas detected')
        //     return false
        // }


        // const basicShader = new BasicShader(gl, [{
        //     type: gl.VERTEX_SHADER,
        //     source: vertShader,
        //     fileName: 'vert.glsl'
        // }, {
        //     type: gl.FRAGMENT_SHADER,
        //     source: fragShader,
        //     fileName: 'frag.glsl'
        // }])

        // if (!basicShader) {
        //     logger.prod.error('basic shader failed to create')
        //     return false
        // }
        // this.shaders.basic = basicShader

        return true
    },

    // _createBasicBatch(vertexData) {
    //     if (!vertexData) {
    //         logger.prod.error('creating basic batch failed. no veretxData provided')
    //     }
    //
    //     return  createBasicBatch(vertexData)
    // },

    _addBasicBatch(batch) {
        this.batches.basic.push(batch)
    },

    sync(batchList) {
        //TODO: sync func should compare & diff the given 'batchList' parameter and the
        //TODO: internal this.batches, and then do the 'add', 'update' and/or 'delete'
        //TODO: operations according to the issue

        for (const batch of batchList) {
            this._addBasicBatch(batch)
        }
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

    // translate(x, y, z) {
    //     for (const batch of this.batches.basic) {
    //         batch.translate(x, y, z)
    //     }
    // },

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

function createGLib(canvas, gl){
    const glib = Object.create(GLib)
    glib.init(canvas, gl)

    return glib
}

export { createGLib }
