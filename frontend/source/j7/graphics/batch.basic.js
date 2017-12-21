import logger from 'j7/utils/logger'

import { createBasicShader, BasicShader } from './shader.basic'

import vertWireframeShader from 'j7/graphics/shaders/vert.wireframe'
import fragWireframeShader from 'j7/graphics/shaders/frag.wireframe'


const BasicBatch = {
    static: {
        init(gl) {
            if (!gl){
                logger.prod.error('no gl context provided')
                return false
            }

            Object.assign(BasicBatch.static, {
                gl,
                attributes: {
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
                    },
                    baryCenter: {
                        name: 'a_baryCenter',
                        location: null,
                        numComponent: 3,
                        componentType: gl.FLOAT,
                        normalized: false,
                        stride: 0,
                        offset: 0,
                        vbo: null, // should fill in each batch instance
                        bufferDataType: Float32Array,
                    }
                },
                uniforms: {
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
            })

            return true
        },

        _setUniformsForMatrix4fvToGL(gl, ...uniforms) {
            for (const uniform of uniforms) {
                gl.uniformMatrix4fv(uniform.location, false, uniform.data.m)
            }
        },

        _uploadVBOWithArributeToGL(gl, attrib, bufferData) {
            // LINOTE: the calling sequences are vital important here,
            // there are several points worth noticing
            // 1.gl.enableVertexAttribArray() has to be called after gl.bindVertexArray() gets called
            // 2.gl.vertexAttribPointer() has to be called after gl.bindBuffer() gets called
            //     or else a error message will pop:
            //     "batch.basic.js:104 GL_INVALID_OPERATION : glVertexAttribPointer: client side arrays are not allowed in vertex array objects."
            //

            gl.bindBuffer(gl.ARRAY_BUFFER, attrib.vbo)
            gl.bufferData(gl.ARRAY_BUFFER, new attrib.bufferDataType(bufferData), gl.STATIC_DRAW)

            gl.enableVertexAttribArray(attrib.location)
            gl.vertexAttribPointer(attrib.location, attrib.numComponent, attrib.componentType, attrib.normalized, attrib.stride, attrib.offset)
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

    init(key, vertexData, uniformData, { wireframeMode }) {
        const gl = this.static.gl

        Object.assign(this, {
            key,
            vao: gl.createVertexArray(),
            attributes: {
                position: Object.assign(Object.create(BasicBatch.static.attributes.position), {
                    vbo: gl.createBuffer(),
                }),
                baryCenter: Object.assign(Object.create(BasicBatch.static.attributes.baryCenter), {
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
            shader: null,
            data: {
                mode: 'TRIANGLES',
                position: [],
                indices: [],
            },
            indices: {
                vbo: gl.createBuffer(),
                bufferDataType: Uint16Array,
            },
        })

        let shader = BasicShader.static.getShader('default')

        if (wireframeMode) {
            shader = BasicShader.static.getShader('wireframeShader')

            if (!shader) {
                shader = BasicShader.static.addShaderProgram('wireframeShader', createBasicShader(gl, [{
                    type: gl.VERTEX_SHADER,
                    source: vertWireframeShader,
                    fileName: 'vert.wireframe.glsl'
                }, {
                    type: gl.FRAGMENT_SHADER,
                    source: fragWireframeShader,
                    fileName: 'frag.wireframe.glsl'
                }]))
            }
        }

        this.useShader(shader)

        if (vertexData) {
            this.updateVertexData(vertexData)
        }

        if (uniformData) {
            this.updateUniformData(uniformData)
        }

        return true
    },

    _setVertextAttributeLocation(gl, shader, attrib) {
        const location = gl.getAttribLocation(shader.program, attrib.name)
        if (location == null) {
            logger.prod.error(`no attribute for '${attrib.name}' location found`)
            return false
        }
        attrib.location = location
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
        this.shader = shader

        // set various attributes
        if(!this._setVertextAttributeLocation(gl, shader, this.static.attributes.position) ||
           !this._setVertextAttributeLocation(gl, shader, this.static.attributes.baryCenter)
        ) {
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
            if (!data.positions || !data.indices ) {
                logger.prod.error(' call fillVertPositionData() failed, data is not valid')
                return false
            }
            Object.assign(this.data, data)
        } else {
            data = this.data
        }

        gl.bindVertexArray(this.vao)

        // set up position data
        if (data.positions) {
            BasicBatch.static._uploadVBOWithArributeToGL(gl, this.attributes.position, data.positions)
            // gl.bindBuffer(gl.ARRAY_BUFFER, posAttr.vbo)
            // gl.bufferData(gl.ARRAY_BUFFER, new posAttr.bufferDataType(data.positions), gl.STATIC_DRAW)
            //
            // gl.enableVertexAttribArray(posAttr.location)
            // gl.vertexAttribPointer(posAttr.location, posAttr.numComponent, posAttr.componentType, posAttr.normalized, posAttr.stride, posAttr.offset)
        }

        // set up indices data IF NEEDED
        if (data.baryCenters) {
            BasicBatch.static._uploadVBOWithArributeToGL(gl, this.attributes.baryCenter, data.baryCenters)
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
        gl.useProgram(this.shader.program)
        gl.bindVertexArray(this.vao)

        BasicBatch.static._setUniformsForMatrix4fvToGL(gl,
            this.uniforms.transform,
            BasicBatch.static.uniforms.view,
            BasicBatch.static.uniforms.perspectiveProjection
        )

        switch(this.data.mode) {
        case 'TRIANGLES':
        case 'TRIANGLE_STRIP':
            gl.drawElements(gl[this.data.mode], this.data.indices.length, gl.UNSIGNED_SHORT, 0)
            break
        default:
            logger.prod.error(`abort to call gl.drawElements. the given primitive mode ${this.data.mode} not supported. `)
        }

        // if (options.wireframeMode) {
        //     gl.drawElements(gl.TRIANGLES, this.data.indices.length, gl.UNSIGNED_SHORT, 0)
        // } else {

        // gl.drawElements(gl.LINES, this.data.indices.length, gl.UNSIGNED_SHORT, 0)
        // gl.drawArrays(gl.TRIANGLES, 0, )
    }
}

function createBasicBatch(key, vertexData, uniformData, options) {
    const bbatch = Object.create(BasicBatch)
    bbatch.init(key,vertexData, uniformData, options)
    return bbatch
}

export {
    createBasicBatch,
    BasicBatch,
}
