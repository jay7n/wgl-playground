import logger from 'j7/utils/logger'

const BasicBatch = {
    static: {
        gl: null,
        shader: null,
        attributes: {
            position: null,
        },
        uniforms: {
            transform: null,
            view: null,
            perspectiveProjection: null
        },
        init(gl, shader) {
            if (!gl || !shader){
                logger.prod.error('no gl context or shader provided')
                return false
            }

            BasicBatch.static.gl = gl
            BasicBatch.static.shader = shader

            BasicBatch.static.attributes = {
                position: {
                    name: 'a_position',
                    location: null,
                    numComponent: 3,
                    componentType: gl.FLOAT,
                    normalized: false,
                    stride: 0,
                    offset: 0,
                    vbo: null, // should fill in each batch instance
                    bufferDataType: Float32Array,
                }
            }

            BasicBatch.static.uniforms = {
                transform: {
                    name: 'u_transform_mat4',
                    location: null,
                    data: null, // should fill in each batch instance
                },
                view: {
                    name: 'u_view_mat4',
                    location: null,
                    data: [ // can be changed during rendering process
                        1,0,0,0,
                        0,1,0,0,
                        0,0,1,0,
                        0,0,0,1
                    ],
                },
                perspectiveProjection: {
                    name: 'u_perspective_projection_mat4',
                    location: null,
                    data: [ // can be changed during rendering process
                        1,0,0,0,
                        0,1,0,0,
                        0,0,1,0,
                        0,0,0,1
                    ],
                },
            }

            return true
        },

        _setUniformForMatrix4fvToGL(gl, uniform) {
            gl.uniformMatrix4fv(uniform.location, false, uniform.data.m)
        },

        updateUniformData(uniformData) {
            if (uniformData.view) {
                BasicBatch.static.uniforms.view.data = uniformData.view
            }
            if (uniformData.perspectiveProjection) {
                BasicBatch.static.uniforms.perspectiveProjection.data = uniformData.perspectiveProjection
            }
        },
    },

    init(key, vertexData, uniformData) {
        const gl = this.static.gl
        const shader = this.static.shader

        Object.assign(this, {
            key,
            vao: gl.createVertexArray(),
            attributes: {
                position: Object.assign(Object.create(BasicBatch.static.attributes.position), {
                    vbo: gl.createBuffer(),
                }),
            },
            uniforms: {
                transform: Object.assign(Object.create(BasicBatch.static.uniforms.transform), {
                    data: [
                        1,0,0,0,
                        0,1,0,0,
                        0,0,1,0,
                        0,0,0,1
                    ]
                }),
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

        if (uniformData) {
            this.updateUniformData(uniformData)
        }

        return true
    },

    _setVertextPositionAttribute(gl, shader, posAttrib) {
        const attr = posAttrib
        const location = gl.getAttribLocation(shader.program, attr.name)
        if (location == null) {
            logger.prod.error(`no attribute for '${posAttrib.name}' location found`)
            return false
        }
        attr.location = location
        return true
    },

    _setUniform(gl, shader, uniform) {
        const location = gl.getUniformLocation(shader.program, uniform.name)
        if (!location) {
            logger.prod.error(`no uniform for '${uniform.name}' location found`)
            return false
        }
        uniform.location = location
        return true
    },

    useShader(shader) {
        const gl = this.static.gl

        if (!shader) {
            logger.prod.error('no shader can be used.')
            return false
        }

        // set various attributes
        if(!this._setVertextPositionAttribute(gl, shader, this.static.attributes.position)) {
            return false
        }

        // set various uniforms
        if(!this._setUniform(gl, shader, this.static.uniforms.transform) ||
           !this._setUniform(gl, shader, this.static.uniforms.view) ||
           !this._setUniform(gl, shader, this.static.uniforms.perspectiveProjection)
        ) {
            return false
        }

        return true
    },

    // data = {
    //      position : [Array],
    //      indices: [Array],
    // }
    updateVertexData(data) {
        const gl = this.static.gl

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

        // LINOTE: the calling sequences are vital important here,
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
    },

    updateUniformData(uniformData) {
        if (uniformData.transform) {
            this.uniforms.transform.data = uniformData.transform
        }
    },

    draw() {
        const gl = this.static.gl

        // LINOTE: it's not important whether gl.userProgram() or gl.bindVertexArray() comes first
        //
        gl.useProgram(this.static.shader.program)
        gl.bindVertexArray(this.vao)

        BasicBatch.static._setUniformForMatrix4fvToGL(gl, this.uniforms.transform)
        BasicBatch.static._setUniformForMatrix4fvToGL(gl, BasicBatch.static.uniforms.view)
        BasicBatch.static._setUniformForMatrix4fvToGL(gl, BasicBatch.static.uniforms.perspectiveProjection)

        gl.drawElements(gl.TRIANGLES, this.data.indices.length, gl.UNSIGNED_SHORT, 0)
    }
}

function createBasicBatch(key, vertexData, uniformData) {
    const bbatch = Object.create(BasicBatch)
    bbatch.init(key,vertexData, uniformData)
    return bbatch
}

export {
    createBasicBatch,
    BasicBatch,
}
