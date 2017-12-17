// XXXXPrimitive should only treated as a pure data structure as the bridge of
// two hierarchy layers between 'scene' -> 'graphics'
//

const SimpleMeshPrimitive = {
    init(key, vertexData, uniformData) {
        Object.assign(this, {
            key,
            vertexData,
            uniformData
        })
    },
}

function createSimpleMeshPrimitive(key, vertexData, uniformData) {
    const smprim = Object.create(SimpleMeshPrimitive)
    smprim.init(key, vertexData, uniformData)
    return smprim
}

const CameraPrimitive = {
    init(key, viewMatrix, perspectiveProjectionMatrix) {
        Object.assign(this, {
            key,
            viewMatrix,
            perspectiveProjectionMatrix
        })
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
    CameraPrimitive,
}
