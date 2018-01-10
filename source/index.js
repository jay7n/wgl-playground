import logger from '@/utils/logger'
import * as GraphicsPackage from '@/graphics'
import * as ScenePackage from '@/scene'
import * as MathPackage from '@/math'

logger.createLogger('debug')
logger.createLogger('prod')

const CompoundPackage = Object.assign({}, ScenePackage, MathPackage)
const linger = Object.create(CompoundPackage)

Object.assign(linger, {
    logger,
    init(canvas) {
        const glib = GraphicsPackage.initGraphicsEnvironment(canvas)
        if (!glib) {
            return false
        }

        if(!ScenePackage.initSceneAndNodeEnvironment(glib)) {
            return false
        }

        return true
    }
})

export default linger
module.exports = linger
