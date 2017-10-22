import logger from 'j7/utils/logger'
import Application from 'j7/application'

logger.createLogger('debug')
logger.createLogger('prod')

export default {
    logger: logger,
    Application
}
