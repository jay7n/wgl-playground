import { createSceneNode } from 'j7/scene/node'

const Scene = {
    init() {
        Object.assign(this, {
            root: createSceneNode({
                name: 'sceneRootNode'
            })
        })
    },
    addSceneNode(node) {
        this.root.addSceneNode(node)
    },

    update() {
        this.root.update()
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
