import { createSceneNode } from './node'
import { SimpleMesh } from './simplemesh'
import { Camera } from './camera'

const Scene = {
    init() {
        Object.assign(this, {
            rootSceneNode: createSceneNode({
                name: 'sceneRootNode'
            }),
            nodes: {
                simpleMesh: [],
                camera: [],
                light: [],
            },
            renderOptions: {
                wireframeMode: false
            }
        })
    },

    addSceneNode(node) {
        switch(node.mounted.type) {
        case SimpleMesh.static.type:
            this.nodes.simpleMesh.push(node)
            break
        case Camera.static.type:
            this.nodes.camera.push(node)
            break
        }
        this.rootSceneNode.addSceneNode(node)
    },

    update() {
        this.rootSceneNode.update(this.renderOptions)
    }
}

function createScene() {
    const scene = Object.create(Scene)
    scene.init()
    return scene
}

export {
    createScene,
    Scene,
}
