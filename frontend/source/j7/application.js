import { GLib } from 'j7/graphics/glib'

export default class Application {

    _initOptions(options) {
        this.options = options
    }

    constructor(canvas, options) {
        Object.assign(this, {
            glib: null,
            options: null,
        })

        const glib = new GLib(canvas)
        if (!glib) {
            return
        }
        this.glib = glib

        this._initOptions(options)

        glib.addBatch({
            position: [
                -1, 0, 0,
                0, 0, 0,
                0, 1, 0,
                1, 0, 0
            ],
            indices: [0,1,2, 1,2,3]
        })
        glib.addBatch({
            position: [
                -1, 0, 0,
                0, 0, 0,
                0, -1, 0,
                1, 0, 0
            ],
            indices: [0,1,2, 1,2,3]
        })
    }

    start() {
        this.glib.render()
    }
}
