import logger from 'j7/utils/logger'

import vertShader from 'j7/graphics/shaders/vert'
import fragShader from 'j7/graphics/shaders/frag'

class GLib {
    constructor() {
        Object.assign(this, {
            canvas: null,
            gl: null,
            shaderProgram: null,
            vao: null,
            indices: []
        })
    }

    _createBasicShaderProgram(shaderConfigs) {
        const gl = this.gl

        function _createShader(type, source, fileName) {
            const shader = gl.createShader(type)
            gl.shaderSource(shader, source)
            gl.compileShader(shader)

            const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
            if (success) {
                return shader
            } else {
                logger.prod.error(`can not compile shader ${fileName}`)
                gl.deleteShader(shader)
                return null
            }
        }

        function _createProgram(shaders) {
            const program = gl.createProgram()
            shaders.map(shader => {
                gl.attachShader(program, shader)
            })

            gl.linkProgram(program)

            const success = gl.getProgramParameter(program, gl.LINK_STATUS)
            if (success) {
                return program
            } else {
                logger.prod.error('can not link shader program for', shaderConfigs.map(sc => sc.fileName))
                gl.deleteProgram(program)
                return null
            }
        }

        const shaders = shaderConfigs.map(({ type, source ,fileName}) => {
            return _createShader(type, source, fileName)
        })

        const shaderProgram = _createProgram(shaders)

        return shaderProgram
    }

    _setupVXOs(shaderProgram, attributes, indices) {
        const gl = this.gl

        if (!attributes) {
            logger.prod.error('no attributes provided, which is mandatory')
            return null
        }

        if (!indices) {
            logger.prod.error('no indices provided, which is mandatory')
            return null
        }

        // TODO: validate attributes to see if it fits the expected format

        //1. create vertex array object(VAO) and bind it
        const vao = gl.createVertexArray()
        gl.bindVertexArray(vao)

        for (const [attribName, attribValue] of Object.entries(attributes)) {

            //2. create vertex buffer object(VBO) and bind it
            const buffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

            //3. declare shader attributes
            const location = gl.getAttribLocation(shaderProgram, attribName)
            gl.enableVertexAttribArray(location)
            gl.vertexAttribPointer(location, ...attribValue.parameters)

            //4. assign buffer data to the VBO
            gl.bufferData(gl.ARRAY_BUFFER, new attribValue.bufferDataType(attribValue.buffer), gl.STATIC_DRAW)
        }

        const indexBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

        gl.bindVertexArray(null)

        return vao
    }

    init(canvas, positionBuffer, indices) {
        if (!canvas) {
            logger.prod.error('sorry. no canvas detected')
            return false
        }
        this.canvas = canvas

        const gl = canvas.getContext('webgl2')
        if (!gl) {
            logger.prod.error('sorry. no webgl2 in the given canvas detected')
            return false
        }
        this.gl = gl

        const shaderConfigs = [{
            fileName: 'render.vert',
            source: vertShader,
            type: this.gl.VERTEX_SHADER,
        }, {
            fileName: 'render.frag',
            source: fragShader,
            type: this.gl.FRAGMENT_SHADER
        }]

        const shaderProgram = this._createBasicShaderProgram(shaderConfigs)

        if (!shaderProgram) {
            logger.prod.error('creating basic shader progrom failed')
            return false
        }
        this.shaderProgram = shaderProgram

        const attributes = {
            ['a_position']: {
                parameters: [3, gl.FLOAT, false, 0, 0],
                bufferDataType: Float32Array,
                buffer: positionBuffer
            }
        }

        const vao = this._setupVXOs(shaderProgram, attributes, indices)
        if (!vao) {
            logger.prod.error('setting up vao/vbos failed')
            return false
        }
        this.vao = vao
        this.indices = indices

        return true
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

    draw() {
        this.resize()

        const gl = this.gl

        // When you need to set the viewport to match the size of the canvas's
        // drawingBuffer this will always be correct
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)

        gl.useProgram(this.shaderProgram)
        gl.bindVertexArray(this.vao)

        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0)
    }
}

const glib = new GLib()
export default glib
