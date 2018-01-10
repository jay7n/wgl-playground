import { BasicBatch } from './batch.basic'
import { BasicShader } from './shader.basic'
import {
    createSimpleMeshPrimitive, SimpleMeshPrimitive,
    createCameraPrimitive, CameraPrimitive,
} from './primitive.basic'
import { createGLib } from './glib'
import logger from '@/utils/logger'

function initBasicShaderEnvironment(gl) {
    if (!BasicShader.static.init(gl)) {
        logger.prod.error('failed to call basic shader static init func')
        return false
    }

    return true
}

function initBasicBatchEnvironment(gl) {
    if (!BasicBatch.static.init(gl)) {
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

    if (!initBasicShaderEnvironment(gl)) {
        logger.prod.error('failed to init BasicBatch environment')
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

    glib.resize()
    return glib
}

export {
    initGraphicsEnvironment,
    createSimpleMeshPrimitive,
    SimpleMeshPrimitive,
    createCameraPrimitive,
    CameraPrimitive,
}
