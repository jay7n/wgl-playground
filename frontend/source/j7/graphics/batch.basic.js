import logger from 'j7/utils/logger'

export class BasicBatch {
    constructor(gl, shader, vertexData) {
        if (!gl){
            logger.prod.error('creating Batch failed. no gl context provided')
            return
        }

        Object.assign(this, {
            gl,
            vao: gl.createVertexArray(),
            shader: null,
            attributes: {
                position: {
                    name: 'a_position',
                    location: null,
                    numComponent: 3,
                    componentType: gl.FLOAT,
                    normalized: false,
                    stride: 0,
                    offset: 0,
                    vbo: gl.createBuffer(),
                    bufferDataType: Float32Array,
                }
            },
            uniforms: {
                translate: {
                    name: 'u_translate',
                    location: null,
                    data: [0,0,0,1],
                }
            },
            data: {
                position: [],
                indices: [],
            },
            indices: {
                vbo: gl.createBuffer(),
                bufferDataType: Uint16Array,
            },
        })

        if (shader) {
            this.useShader(shader)
        }

        if (vertexData) {
            this.updateVertexData(vertexData)
        }
    }

    _setVertextPositionAttribute(gl, shader, posAttrib) {
        const attr = posAttrib
        const location = gl.getAttribLocation(shader.program, attr.name)
        if (location == null) {
            logger.prod.error(`no attribute for '${posAttrib.name}' location found`)
            return false
        }
        attr.location = location
        return true
    }

    _setTranslateUniform(gl, shader, translateUniform) {
        const location = gl.getUniformLocation(shader.program, translateUniform.name)
        if (!location) {
            logger.prod.error(`no uniform for '${translateUniform.name}' location found`)
            return false
        }
        translateUniform.location = location
        return true
    }

    useShader(shader) {
        const gl = this.gl

        if (!shader) {
            logger.prod.error('no shader can be used.')
            return false
        }
        this.shader = shader

        // set various attributes
        if(!this._setVertextPositionAttribute(gl, shader, this.attributes.position)) {
            return false
        }

        // set various uniforms
        if(!this._setTranslateUniform(this.gl, shader, this.uniforms.translate)) {
            return false
        }

        return true
    }

    // data = {
    //      position : [Array],
    //      indices: [Array],
    // }
    updateVertexData(data) {
        const gl = this.gl

        if (data) {
            if (!data.position || !data.indices ) {
                logger.prod.error(' call fillVertPositionData() failed, data is not valid')
                return false
            }
            this.data.position = data.position
            this.data.indices = data.indices
        } else {
            data = this.data
        }

        // the calling sequences are vital important here,
        // there are several points worth noticing
        // 1.gl.enableVertexAttribArray() has to be called after gl.bindVertexArray() gets called
        // 2.gl.vertexAttribPointer() has to be called after gl.bindBuffer() gets called
        //     or else a error message will pop:
        //     "batch.basic.js:104 GL_INVALID_OPERATION : glVertexAttribPointer: client side arrays are not allowed in vertex array objects."
        //
        gl.bindVertexArray(this.vao)

        // set up position data
        if (data.position) {
            const posAttr = this.attributes.position
            gl.bindBuffer(gl.ARRAY_BUFFER, posAttr.vbo)
            gl.bufferData(gl.ARRAY_BUFFER, new posAttr.bufferDataType(data.position), gl.STATIC_DRAW)

            gl.enableVertexAttribArray(posAttr.location)
            gl.vertexAttribPointer(posAttr.location, posAttr.numComponent, posAttr.componentType, posAttr.normalized, posAttr.stride, posAttr.offset)
        }

        // set up indices data
        if (data.indices) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices.vbo)
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new this.indices.bufferDataType(data.indices), gl.STATIC_DRAW)
        }

        gl.bindVertexArray(null)

        return true
    }

    // x, y, z Or
    // [x, y, z] Or
    // {x, y, z}
    //
    translate(x, y, z, w) {
        let data = [x, y, z, w || 1]
        if (Array.isArray(x) && x.length >=3 && y == null && z == null && w == null) {
            data = x
            data.w = x[3]|| 1
        } else if (x instanceof Object && x.x && x.y && x.z) {
            data = x
            data.w = x.w || 1
        }
        this.uniforms.translate.data = data

        //update
        this.draw()
    }

    draw() {
        const gl = this.gl

        // it's not important whether gl.userProgram() or gl.bindVertexArray() comes first
        //
        gl.useProgram(this.shader.program)
        gl.bindVertexArray(this.vao)

        const translateUniform = this.uniforms.translate
        gl.uniform4fv(translateUniform.location, translateUniform.data)

        gl.drawElements(gl.TRIANGLES, this.data.indices.length, gl.UNSIGNED_SHORT, 0)
    }
}
