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

        if (!glib.init(canvas)) {
            return
        }
        this.glib = glib

        this._initOptions(options)
    }

    start() {
        this.glib.draw()
    }
}
