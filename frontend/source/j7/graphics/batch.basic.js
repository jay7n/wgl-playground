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
            indices: {
                vbo: gl.createBuffer(),
                bufferDataType: Uint16Array,
            },
            data: {
                position: [],
                indices: [],
            }
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
            logger.prod.error(`no ${posAttrib.name} location found`)
            return false
        }
        attr.location = location


        return true
    }

    useShader(shader) {
        const gl = this.gl

        if (!shader) {
            logger.prod.error('no shader can be used.')
            return false
        }
        this.shader = shader

        if(!this._setVertextPositionAttribute(gl, shader, this.attributes.position)) {
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

    draw() {
        const gl = this.gl

        gl.useProgram(this.shader.program)
        gl.bindVertexArray(this.vao)
        gl.drawElements(gl.TRIANGLES, this.data.indices.length, gl.UNSIGNED_SHORT, 0)
    }
}
