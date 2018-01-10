import logger from '@/utils/logger'

const SimpleMesh = {
    static: {
        type: 'SimpleMesh'
    },

    init(vertices, indices, mode) {
        if (!Array.isArray(vertices) || !Array.isArray(indices)) {
            logger.prod.error('either vertices or indices is not an Array type')
            return
        }

        if (!mode) {
            mode = 'TRIANGLES'
        }

        Object.assign(this, {
            // LINOTE: if performance issue happens we can just use the original arrays directly
            _vertices: [...vertices],
            _indices: [...indices],
            mode,
        })
    },

    get vertices() {
        return this._vertices
    },

    get indices() {
        return this._indices
    }
}

function createSimpleMesh({vertices, indices}) {
    const smn = Object.create(SimpleMesh)
    smn.init(vertices, indices)
    return smn
}

export {
    createSimpleMesh,
    SimpleMesh
}
