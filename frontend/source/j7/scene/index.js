import {createScene, Scene} from './scene'
import {createSceneNode, SceneNode} from './node'
import {createSimpleMesh, SimpleMesh} from './simplemesh'

import logger from 'j7/utils/logger'

function initSceneAndNodeEnvironment(glib) {
    if (!glib) {
        logger.prod.error('no glib parameter given')
        return false
    }

    if (!SceneNode.static.init(glib)) {
        logger.prod.error('failed to init Node environment')
        return false
    }

    return true
}

export {
    initSceneAndNodeEnvironment,
    createScene, Scene,
    createSceneNode, SceneNode,
    createSimpleMesh, SimpleMesh,
}
