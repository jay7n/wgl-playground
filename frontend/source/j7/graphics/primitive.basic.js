// BasicPrimitive should only treated as a pure data structure as the bridge of
// two hierarchy layers between 'scene' -> 'graphics'
//

const BasicPrimitive = {
    init(key, vertexData, uniformData) {
        Object.assign(this, {
            key,
            vertexData,
            uniformData
        })
    },
}

function createBasicPrimitive(key, vertexData, uniformData) {
    const bprim = Object.create(BasicPrimitive)
    bprim.init(key, vertexData, uniformData)
    return bprim
}

export {
    createBasicPrimitive,
    BasicPrimitive,
}
