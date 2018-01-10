// import { default as lig } from '@@/dev/linger.js'
// import { default as lig } from '@/index.js'
// var lig = require('@@/prod/linger.js')
// import test from '@@/prod/test.js'

const lig = BUILD.DEBUG ? require('@/index.js') : require('@@/prod/linger.js')

console.log(BUILD)

export default class Application {
    constructor(canvas) {
        // console.log(test)
        lig.init(canvas)

        const scene = lig.createScene()
        if (!scene) {
            return
        }

        Object.assign(this, {
            scene,
            canvas
        })
    }

    start() {
        const cameraNode = lig.createSceneNode({
            name: 'mainCamera',
            position: [0,0,0],
            mounted: {
                type: lig.Camera.static.type,
                data: lig.createCamera(this.canvas),
            }
        })
        this.scene.addSceneNode(cameraNode)

        const simpleMesh = lig.createSimpleMesh({
            vertices: [
                -1,  1, -1,
                -1, -1, -1,
                -1, -1,  1,
                -1,  1,  1,
                1,  1, -1,
                1, -1, -1,
                1, -1,  1,
                1,  1,  1,
            ],
            indices: [0,1,2,0,2,3,3,2,6,3,6,7,7,6,5,7,5,4,4,5,1,4,1,0,0,3,7,0,7,4,2,1,5,2,5,6],
            mode: 'TRIANGLES'
        })

        const node1 = lig.createSceneNode({
            name: 'testNode1',
            position: [0,1,-13.7],
            mounted: {
                type: lig.SimpleMesh.static.type,
                data: simpleMesh
            }
        })
        node1.rotateAxisAngle('y', 90)
        node1.rotateAxisAngle('x', 45)
        // node1.setScale(3,3,3)
        // node1.translate(0, 3, 0)
        this.scene.addSceneNode(node1)

        // const node3 = lig.createSceneNode({
        //     name: 'testNode3',
        //     position: [1,0,-9.9],
        //     mounted: {
        //         type: lig.SimpleMesh.static.type,
        //         data: simpleMesh
        //     }
        // })
        // this.scene.addSceneNode(node3)

        this.scene.update()
    }
}
