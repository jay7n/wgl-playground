import logger from 'j7/utils/logger'
import * as GraphicsPackage from 'j7/graphics'
import * as ScenePackage from 'j7/scene'
import * as MathPackage from 'j7/math'

logger.createLogger('debug')
logger.createLogger('prod')

const CompoundPackage = Object.assign({}, ScenePackage, MathPackage)
const J7 = Object.create(CompoundPackage)

Object.assign(J7, {
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

export default J7
