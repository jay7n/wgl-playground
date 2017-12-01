import { glib } from 'j7/graphics/glib'
import { createScene, createNode, createSimpleMesh, SimpleMesh } from 'j7/scene'

export default class Application {

    _initOptions(options) {
        this.options = options
    }

    constructor(canvas, options) {
        Object.assign(this, {
            glib: null,
            scene: null,
            options: null,
        })

        if(!glib.init(canvas)) {
            return
        }

        this.glib = glib

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
        const node = createNode({
            name: 'testNode1',
            position: [0,1,0]
            mounted: {
                type: SimpleMesh.static.type,
                data: createSimpleMesh{
                    vertices: [
                        -1, 0, 0,
                        0, 0, 0,
                        0, 1, 0,
                        1, 0, 0
                    ],
                    indices: [0,1,2, 1,3,2]
                }
            }
        })
        this.scene.addNode(node)

        this.scene.render()


        // this.glib.render()
        // this.glib.translate(1,0,0)
        // this.glib.render()
    }
}
