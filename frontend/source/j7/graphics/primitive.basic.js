// XXXXPrimitive should only treated as a pure data structure as the bridge of
// two hierarchy layers between 'scene' -> 'graphics'
//

import { callSuperiorProto } from 'j7/base'
import { createWireframeData } from './wireframe.js'

const SimpleMeshPrimitive = {
    init(key, {vertPosition, vertIndices, transformMat4, mode}) {
        Object.assign(this, {
            key,
            vertPosition,
            vertIndices,
            transformMat4,
            mode: mode || 'TRIANGLES'
        })
    },
}

const SimpleMeshWireframePrimitive = Object.create(SimpleMeshPrimitive)

Object.assign(SimpleMeshWireframePrimitive, {
    init(key, {vertPosition, vertIndices, transformMat4, vertBaryCenter, mode}) {
        callSuperiorProto(this, 'init', key, {vertPosition, vertIndices, transformMat4, mode})
        Object.assign(this, {
            vertBaryCenter
        })
    }
})

const CameraPrimitive = {
    init(key, viewMatrix, perspectiveProjectionMatrix) {
        Object.assign(this, {
            key,
            viewMatrix,
            perspectiveProjectionMatrix
        })
    }
}

function createSimpleMeshPrimitive(key, {
    vertPosition, vertIndices, transformMat4, mode
}, options) {
    if (options.wireframeMode) {
        const { vertPosition:newVertPosition, vertIndices:newVertIndices, vertBaryCenter, mode:newMode} = createWireframeData(vertPosition, vertIndices, mode)
        const smwfprim = Object.create(SimpleMeshWireframePrimitive)
        smwfprim.init(key, {vertPosition:newVertPosition, vertIndices:newVertIndices, mode:newMode, transformMat4, vertBaryCenter})
        return smwfprim
    } else {
        const smprim = Object.create(SimpleMeshPrimitive)
        smprim.init(key, {vertPosition, vertIndices, transformMat4})
        return smprim
    }
}


function createCameraPrimitive(key, viewMatrix, perspectiveProjectionMatrix) {
    const cprim = Object.create(CameraPrimitive)
    cprim.init(key, viewMatrix, perspectiveProjectionMatrix)
    return cprim
}

export {
    createSimpleMeshPrimitive,
    createCameraPrimitive,

    SimpleMeshPrimitive,
    SimpleMeshWireframePrimitive,
    CameraPrimitive,
}
