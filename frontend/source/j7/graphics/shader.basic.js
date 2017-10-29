import logger from 'j7/utils/logger'

export class BasicShader {
    // gl = [Object]
    // shaderConfigs = [{
    //      type: gl.VERTEX_SHADER | gl.FRAGMENT_SHADER
    //      source: [string],
    //      fileName: [string],
    // }]
    constructor(gl, shaderConfigs) {
        if (!gl || !shaderConfigs || !shaderConfigs.length) {
            logger.prod.error('creating BasicShader failed. parameters needs to be fed correctly')
            return
        }

        Object.assign(this, {
            gl,
            configs: shaderConfigs,
            shaders: [],
            program: null,
        })

        const shaders = shaderConfigs.map(({ type, source ,fileName}) => {
            return this._createShader(gl, type, source, fileName)
        })

        const shaderProgram = this._createProgram(gl, shaders)

        if (shaders && shaderProgram) {
            this.shaders = shaders
            this.program = shaderProgram
        }
    }

    _createShader(gl, type, source, fileName) {
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


    _createProgram(gl, shaders, shaderConfigs) {
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
}
