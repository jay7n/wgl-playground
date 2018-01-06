import {
    createVector3, Vector3,
    createMatrix4, Matrix4,
    createQuaternion, Quaternion,
} from 'j7/math'

import {
    createSimpleMeshPrimitive,
    createCameraPrimitive
} from 'j7/graphics'

import { stupidIsType } from 'j7/base'

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
        },
    },

    init(options) {
        options = Object.assign({
            // this part can be overridden by parameter options
            active: options.active == null ? true : options.active,
            position: options.position || [0,0,0],
            rotation: options.rotation,
            rotationAxisAngle: options.rotationAxisAngle,
            scale: options.scale || [1,1,1],
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

        this.setPosition(options.position)

        if (options.rotation) {
            this.setRotation(options.rotation)
        } else if (options.rotationAxisAngle){
            this.setRotationAxisAngle(options.rotationAxisAngle)
        } else {
            this.setRotation(0,0,0,1)
        }

        this.setScale(options.scale)
    },

    setPosition(x, y, z) {
        let pos = x
        if (!stupidIsType(pos, Vector3)) {
            pos = createVector3(x, y, z)
        }
        this.position = pos

        this.dirtyTransform = true
        return this
    },

    getPosition() {
        return this.position.copy()
    },
    translate(x, y, z) {
        let pos = x
        if (!stupidIsType(pos, Vector3)) {
            pos = createVector3(x, y, z)
        }
        this.position.add(pos)

        this.dirtyTransform = true
        return this
    },

    setRotation(x, y, z, w) {
        let quat = x
        if (!stupidIsType(quat, Quaternion)) {
            quat = createQuaternion(x, y, z, w)
        }
        this.rotation = quat

        this.dirtyTransform = true
        return this
    },

    getRotation() {
        return this.rotation.copy()
    },

    rotate(x, y, z, w) {
        let quat = x
        if (!stupidIsType(quat, Quaternion)) {
            quat = createQuaternion(x, y, z, w)
        }
        this.rotation = Quaternion.static.multiply(quat, this.rotation)

        this.dirtyTransform = true
        return this
    },

    setRotationAxisAngle(x, y, z, angle) {
        // let axis = [x, y, z]
        // if (stupidIsType(x, Array)) {
        //     const arr = x; axis = [arr[0], arr[1], arr[2]]
        //     angle = y
        // } else if (stupidIsType(x, Object)) {
        //     const obj = x; axis = [obj.x, obj.y, obj.z]
        //     angle = y
        // }
        const q = Quaternion.static.createFromAxisAngle(x, y, z, angle)
        this.rotation = q

        this.dirtyTransform = true
        return this
    },

    getRotationAxisAngle() {
        // TODO
    },

    rotateAxisAngle(x, y, z, angle) {
        const q = Quaternion.static.createFromAxisAngle(x, y, z, angle)
        this.rotation = Quaternion.static.multiply(q, this.rotation)
    },

    setScale(x, y, z) {
        let scale = x
        if (!stupidIsType(scale, Vector3)) {
            scale = createVector3(x, y, z)
        }
        this.scale = scale

        this.dirtyTransform = true
        return this
    },

    getScale() {
        return this.scale.copy()
    },

    scale(x, y, z) {
        let scale = x
        if (!stupidIsType(scale, Vector3)) {
            scale = createVector3(x, y, z)
        }
        this.scale = createVector3(
            this.scale.x * scale.x,
            this.scale.y * scale.y,
            this.scale.z * scale.z,
        )

        this.dirtyTransform = true
        return this
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

    _processDirtyList(dirtyList, options) {
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
                        vertPosition: mounted.data.vertices,
                        vertIndices: mounted.data.indices,
                        transformMat4: transformMat4,
                        mode: mounted.data.mode
                    }, options)
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
        // LINOTE: for camera the underlying glib only keeps one camera primitive(currently), so we use 'camera-prim' as the key
        const cameraPrimitive = createCameraPrimitive('camera-prim', cameraTransformMat4, activeCamera.perspectiveProjectionMatrix)
        primitiveList.push(cameraPrimitive)

        return primitiveList
    },

    _updateRecursive(node, upLevelTransformMat4, outDirtySceneNodeList) {
        const nodeTransformMat4 = Matrix4.static.transform(node.position, node.rotation, node.scale)
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

    update(options) {
        if (this.nodeIsDirty) {
            this.nodeIsDirty = false

            let accTransformMat4 = createMatrix4()
            let dirtySceneNodeList = []
            this._updateRecursive(this, accTransformMat4, dirtySceneNodeList)

            const primitiveList = this._processDirtyList(dirtySceneNodeList, options)
            this.static._glib.syncAndRender(primitiveList, options)
        }
    },

}

function createSceneNode(options) {
    const sceneNode = Object.create(SceneNode)
    sceneNode.init(options)
    return sceneNode
}

export { createSceneNode, SceneNode }
