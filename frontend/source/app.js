import j7 from 'j7'

export default class Application {
    constructor(canvas) {
        j7.init(canvas)

        const scene = j7.createScene()
        if (!scene) {
            return
        }
        this.scene = scene
    }

    start() {
        const cameraNode = j7.createSceneNode({
            name: 'mainCamera',
            position: [0,0,0],
            mounted: {
                type: j7.Camera.static.type,
                data: j7.createCamera(),
            }
        })
        this.scene.addSceneNode(cameraNode)

        const simpleMesh = j7.createSimpleMesh({
            vertices: [
                -1, 0, 0,
                0, 0, 0,
                0, 1, 0,
                1, 0, 0
            ],
            indices: [0,1,2, 2,1,3,],
            mode: 'TRIANGLES'
        })

        const node1 = j7.createSceneNode({
            name: 'testNode1',
            position: [0,0,-2],
            mounted: {
                type: j7.SimpleMesh.static.type,
                data: simpleMesh
            }
        })
        node1.rotateAxisAngle('z', 45)
        this.scene.addSceneNode(node1)

        // const node3 = j7.createSceneNode({
        //     name: 'testNode3',
        //     position: [1,0,-9.9],
        //     mounted: {
        //         type: j7.SimpleMesh.static.type,
        //         data: simpleMesh
        //     }
        // })
        // this.scene.addSceneNode(node3)

        this.scene.update()
    }
}
