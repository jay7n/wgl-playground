import { initGraphicsEnvironment } from 'j7/graphics'
import { createScene, createSceneNode, createSimpleMesh, SimpleMesh, initSceneAndNodeEnvironment } from 'j7/scene'

export default class Application {

    _initOptions(options) {
        this.options = options
    }

    constructor(canvas, options) {
        Object.assign(this, {
            // glib: null,
            scene: null,
            options: null,
        })

        // static environment init
        const glib = initGraphicsEnvironment(canvas)
        if (!glib) {
            return
        }

        if(!initSceneAndNodeEnvironment(glib)) {
            return
        }

        // this.glib = glib

        const scene = createScene()
        if (!scene) {
            return
        }
        this.scene = scene

        this._initOptions(options)

        // glib.addBatch({
        //     position: [
        //         -1, 0, 0,
        //         0, 0, 0,
        //         0, 1, 0,
        //         1, 0, 0
        //     ],
        //     indices: [0,1,2, 1,3,2]
        // })
        // glib.addBatch({
        //     position: [
        //         -1, 0, 0,
        //         0, 0, 0,
        //         0, -1, 0,
        //         1, 0, 0
        //     ],
        //     indices: [0,1,2, 1,3,2]
        // })
    }

    start() {
        const simpleMesh = createSimpleMesh({
            vertices: [
                -1, 0, 0,
                0, 0, 0,
                0, 1, 0,
                1, 0, 0
            ],
            indices: [0,1,2]
        })

        const node1 = createSceneNode({
            name: 'testNode1',
            position: [1,0,0],
            mounted: {
                type: SimpleMesh.static.type,
                data: simpleMesh
            }
        })

        const node2 = createSceneNode({
            name: 'testNode1',
            position: [-1,-1,0],
            mounted: {
                type: SimpleMesh.static.type,
                data: simpleMesh
            }
        })

        node1.addSceneNode(node2)

        this.scene.addSceneNode(node1)

        this.scene.update()


        // this.glib.render()
        // this.glib.translate(1,0,0)
        // this.glib.render()
    }
}
