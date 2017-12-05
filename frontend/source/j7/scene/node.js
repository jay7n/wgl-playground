import {
    createVector3, Vector3,
    createMatrix4, Matrix4
} from 'j7/math'

import {
    createBasicPrimitive,
} from 'j7/graphics'

import logger from 'j7/utils/logger'

import { SimpleMesh } from './simplemesh'

const SceneNode = {
    static: {
        _cur_max_id: -1,
        _glib: null, // not own it

        _assignNewID() {
            return ++SceneNode.static._cur_max_id
        },

        init(glib) {
            SceneNode.static._glib = glib
            return true
        }
    },

    init(options) {
        options = Object.assign({
            // this part can be overridden by parameter options
            position: createVector3(options.position),
            rotation: createVector3(options.rotation),
            scale: createVector3(options.scale),
            name: options.name || 'defaultSceneNodeName',
            mounted: options.mounted || {
                type: 'Void',
                data: null
            },

            // this part can NOT be overridden by parameter options
            id: this.static._assignNewID(),
            // transformMat4: createMatrix4(),
            nodeIsDirty: true,
            children: [],
            parent: null,
        })

        Object.assign(this, options)
    },

    setPosition(position) {
        if (Vector3.isPrototypeOf(position)) {
            this.position = position
        } else {
            this.position = createVector3(position)
        }

        this.dirtyTransform = true
    },

    getPosition() {
        return this.position.copy()
    },

    getParent() {
        return this.parent
    },

    addSceneNode(sceneNode) {
        sceneNode.parent = this
        this.children.push(sceneNode)
    },

    mount(type, data) {
        if (false == [
            SimpleMesh.static.type,
        ].includes(type)) {
            logger.prod.error('the mounting type is not supported for now')
            return
        }

        this.mounted = {
            type,
            data
        }
    },

    _processDirtyList(dirtyList) {
        const primitiveList = []

        for (const dirty of dirtyList) {
            const node = dirty.node
            const transformMat4 = dirty.transformMat4

            switch(node.mounted.type) {
            case SimpleMesh.static.type: {
                const basicPrimitive = createBasicPrimitive(node.id, {
                    position: node.mounted.data.vertices,
                    indices: node.mounted.data.indices,
                }, {
                    transform: transformMat4
                })
                primitiveList.push(basicPrimitive)
                // _assembleGraphicsBatchFromSimpleMesh(this, node.mounted.data)
                break
            }
            }
        }

        return primitiveList
    },

    _updateRecursive(node, upLevelTransformMat4, outDirtySceneNodeList) {
        const nodeTransformMat4 = Matrix4.static.transform(node.position)
        const accTransformMat4 = Matrix4.static.multiply(nodeTransformMat4, upLevelTransformMat4)

        if (node.children.length > 0) {
            for (const child of node.children) {
                if (child.nodeIsDirty) {
                    child._updateRecursive(child, accTransformMat4, outDirtySceneNodeList)
                    child.nodeIsDirty = false
                }
            }
        }

        outDirtySceneNodeList.push({
            node,
            transformMat4: accTransformMat4
        })
    },

    update() {
        if (this.nodeIsDirty) {
            this.nodeIsDirty = false

            let accTransformMat4 = createMatrix4()
            let dirtySceneNodeList = []
            this._updateRecursive(this, accTransformMat4, dirtySceneNodeList)

            const primitiveList = this._processDirtyList(dirtySceneNodeList)
            this.static._glib.sync(primitiveList)

            this.static._glib.render()
        }
    },

}

function createSceneNode(options) {
    const sceneNode = Object.create(SceneNode)
    sceneNode.init(options)
    return sceneNode
}

export { createSceneNode, SceneNode }
