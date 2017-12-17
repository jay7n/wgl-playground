import { BasicBatch } from './batch.basic'
import {
    createSimpleMeshPrimitive, SimpleMeshPrimitive,
    createCameraPrimitive, CameraPrimitive,
} from './primitive.basic'
import { BasicShader } from './shader.basic'
import { createGLib } from './glib'
import logger from 'j7/utils/logger'

import vertShader from 'j7/graphics/shaders/vert'
import fragShader from 'j7/graphics/shaders/frag'

function initBasicBatchEnvironment(gl) {
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
        logger.prod.error('failed to create basic shader')
        return false
    }

    if (!BasicBatch.static.init(gl, basicShader)) {
        logger.prod.error('failed to call basic batch static init func')
        return false
    }

    return true
}

function initGraphicsEnvironment(canvas) {
    const gl = canvas.getContext('webgl2')
    if (!gl) {
        logger.prod.error('no webgl2 in the given canvas detected')
        return null
    }

    if (!initBasicBatchEnvironment(gl)) {
        logger.prod.error('failed to init BasicBatch environment')
        return null
    }

    const glib = createGLib(canvas, gl)
    if (!glib) {
        logger.prod.error('failed to create glib with the given canvas')
        return null
    }

    return glib
}

export {
    initGraphicsEnvironment,
    createSimpleMeshPrimitive,
    SimpleMeshPrimitive,
    createCameraPrimitive,
    CameraPrimitive,
}
