import {
    createVector3, Vector3,
    createMatrix4, Matrix4
} from 'j7/math'

import {
    createSimpleMeshPrimitive,
    createCameraPrimitive
} from 'j7/graphics'

import logger from 'j7/utils/logger'

import { SimpleMesh } from './simplemesh'
import { Camera } from './camera'

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
            active: options.active == null ? true : options.active,
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
        let activeCamera = null
        let cameraTransformMat4 = null

        for (const dirty of dirtyList) {
            const node = dirty.node
            const mounted = node.mounted
            const transformMat4 = dirty.transformMat4

            if (node.active) {
                switch(mounted.type) {
                case SimpleMesh.static.type: {
                    const primitive = createSimpleMeshPrimitive(node.id, {
                        position: mounted.data.vertices,
                        indices: mounted.data.indices,
                    }, {
                        transform: transformMat4
                    })
                    primitiveList.push(primitive)
                    break
                }
                case Camera.static.type: {
                    activeCamera = mounted.data
                    cameraTransformMat4 = transformMat4
                    break
                }
                }
            }
        }

        if (!activeCamera) {
            logger.prod.error('none camera exists or activated. at least one camera should be added into the scene and keep active.')
            return
        }
        // LINOTE: for camera the underlining glib only keeps one camera primitive(currently), so we use 'cameraode.id
        const cameraPrimitive = createCameraPrimitive('camera-prim', cameraTransformMat4, activeCamera.perspectiveProjectionMatrix)
        primitiveList.push(cameraPrimitive)

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
