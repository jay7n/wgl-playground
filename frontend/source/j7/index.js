import logger from 'j7/utils/logger.js'

logger.createLogger('debug')
logger.createLogger('prod')

export default {
    logger: logger,
    Application: class Application {
        _initCanvas(member, canvas) {
            if (!canvas) {
                logger.prod.error('sorry. no canvas detected')
                return false
            }
            member.canvas = canvas

            const gl = canvas.getContext('webgl2')
            if (!gl) {
                logger.prod.error('sorry. no webgl2 in the given canvas detected')
                return false
            }
            member.gl = gl

            return true
        }

        _initOptions(member, options) {
            member.options = options
        }

        constructor(canvas, options) {
            const member = {
                canvas: null,
                gl: null,
                options: null
            }

            this._initCanvas(member, canvas)
            this._initOptions(member, options)

            Object.assign(this, member)
        }

        start() {
            console.log('hello ya', this.canvas)
        }
    }
}
