import logger from 'j7/utils/logger'
import glib from 'j7/graphics/glib'

export default class Application {
    _initCanvas(canvas) {
        if (!canvas) {
            logger.prod.error('sorry. no canvas detected')
            return false
        }
        this.canvas = canvas
        return true
    }

    _initOptions(options) {
        this.options = options
    }

    constructor(canvas, options) {
        Object.assign(this, {
            canvas: null,
            glib: null,
            options: null,
        })

        if (!this._initCanvas(canvas)) {
            return
        }

        if (!glib.init(canvas)) {
            return
        }
        this.glib = glib

        this._initOptions(options)
    }

    start() {
        logger.debug.log(this.glib)
    }
}
