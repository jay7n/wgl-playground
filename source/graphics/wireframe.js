function createWireframeData(vertPosition, vertIndices, mode) {
    const newVertPosition = [], newVertIndices = [], vertBaryCenter = []

    if (mode == 'TRIANGLES') {
        for (const i of vertIndices.keys()) {
            newVertIndices.push(i)

            const idx_v0 = vertIndices[i] * 3
            newVertPosition.push(vertPosition[idx_v0], vertPosition[idx_v0+1], vertPosition[idx_v0+2])

            switch (i%3) {
            case 0: vertBaryCenter.push(1,0,0); break
            case 1: vertBaryCenter.push(0,1,0); break
            case 2: vertBaryCenter.push(0,0,1); break
            }
        }
    } else if (mode =='TRIANGLE_STRIP') {
        // TODO
    }

    return {
        vertPosition: newVertPosition,
        vertIndices: newVertIndices,
        vertBaryCenter,
        mode: 'TRIANGLES'
    }
}

export {
    createWireframeData
}
