import logger from 'j7/utils/logger'

import vertShader from 'j7/graphics/shaders/vert'
import fragShader from 'j7/graphics/shaders/frag'

class GLib {
    constructor() {
        Object.assign(this, {
            gl: null,
            shaderProgram: null
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

        const shaders = shaderConfigs.map(({type, source ,fileName}) => {
            return _createShader(type, source, fileName)
        })

        const shaderProgram = _createProgram(shaders)
        if (shaderProgram) {
            this.shaderProgram = shaderProgram
        }

        return shaderProgram
    }

    _setupVXOs() {
        const gl = this.gl

        //1. create vertex array object(VAO) and bind it
        const vao = gl.createVertexArray()
        gl.bindVertexArray(vao)

        //2. create vertex buffer object(VBO) and bind it
        const posBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)

        //3. assign buffer data to the VBO
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, 0, 0,
            1, 0, 0,
            0, 1, 0
        ]), gl.STATIC_DRAW)
    }

    init(canvas) {
        const gl = canvas.getContext('webgl2')

        if (!gl) {
            logger.prod.error('sorry. no webgl2 in the given canvas detected')
            return false
        }
        this.gl = gl

        const shaderProgram = this._createBasicShaderProgram([{
            fileName: 'render.vert',
            source: vertShader,
            type: this.gl.VERTEX_SHADER
        }, {
            fileName: 'render.frag',
            source: fragShader,
            type: this.gl.FRAGMENT_SHADER
        }])

        if (!shaderProgram) {
            return false
        }
        this.shaderProgram = shaderProgram

        if (!this._setupVXOs()) {
            return false
        }

        return true
    }
}

const glib = new GLib()
export default glib
