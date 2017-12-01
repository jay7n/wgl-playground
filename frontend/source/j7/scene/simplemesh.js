import logger from 'j7/utils/logger'
import { glib } from 'j7/graphics/glib'

const SimpleMesh = {
    static: {
        type: 'SimpleMesh'
    },

    init(vertices, indices) {
        if (!Array.isArray(vertices) || !Array.isArray(indices)) {
            logger.prod.error('either vertices or indices is not an Array type')
            return
        }

        vertices = [...vertices]
        indices = [...indices]

        Object.assign(this, {
            vertices,
            indices,
            batchAdded: false,
        })
    },

    render(batch) {
        if (!this.batchAdded) {
            glib.addBatch({
                position: this.vertices,
                indices: this.indices
            })
            this.batchAdded = true
        }
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
