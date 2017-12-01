import {
    createVector3, Vector3,
    createMatrix4
} from 'j7/math'

import logger from 'j7/utils/logger'

import { SimpleMesh } from './simplemesh'

const Node = {
    init(options) {
        options = Object.assign({
            position: createVector3(0,0,0),
            rotation: createVector3(0,0,0),
            scale: createVector3(1,1,1),
            transformMat4: createMatrix4(),
            dirtyTransform: false,
            children: [],
            parent: null,
            name: 'defaultNodeName',
            mounted: {
                type: 'Void',
                data: null
            }
        }, options)

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

    addNode(node) {
        node.parent = this
        this.children.push(node)
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

    renderRecursive(accTransformMat4) {
        if (this.dirtyTransform) {
            this.transformMat4 = this.transformMat4.static.transform(this.position)
            this.dirtyTransform = false
        }

        accTransformMat4.multiply(this.transformMat4)

        if (this.children.length > 0) {
            for (const child of this.children) {
                child.renderRecursive(accTransformMat4)
            }
        }

        switch(this.mounted.type) {
        case SimpleMesh.static.type:
            break
        }
    },

    render() {
        let accTransformMat4 = createMatrix4()
        this.renderRecursive(accTransformMat4)
    }
}

function createNode(options) {
    const node = Object.create(Node)
    node.init(options)
    return node
}

export { createNode, Node }
