import { createNode } from 'j7/scene/node'

const Scene = {
    init() {
        Object.assign(this, {
            root: createNode({
                name: 'sceneRootNode'
            })
        })
    },
    addNode(node) {
        this.root.addNode(node)
    },

    render() {
        this.root.render()
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
