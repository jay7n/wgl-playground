import glib from 'j7/graphics/glib'

export default class Application {

    _initOptions(options) {
        this.options = options
    }

    constructor(canvas, options) {
        Object.assign(this, {
            glib: null,
            options: null,
        })

        const positionBuffer = [
            -1, 0, 0,
            1, 0, 0,
            0, 1, 0
        ]

        const indices = [0 ,1, 2]

        if (!glib.init(canvas, positionBuffer, indices)) {
            return
        }
        this.glib = glib

        this._initOptions(options)
    }

    start() {
        this.glib.draw()
    }
}
