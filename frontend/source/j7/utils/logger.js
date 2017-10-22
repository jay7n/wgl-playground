import _ from 'lodash'

class Logger {
    constructor(name) {
        this.name = name
        this.levels = [
            'none', // 0
            'error', // 1
            'warn', // 2
            'log', //3
        ]
        this.level = 3
    }

    mute() {
        this.setLevel('none')
    }

    setLevel(level) {
        if (_.isString(level)) {
            let lv = 0
            switch (level) {
            case 'none':
                lv = 0; break
            case 'error':
                lv = 1; break
            case 'warn':
                lv = 2; break
            case 'log':
                lv = 3; break
            }
            this.level = lv
        }
    }

    log(msg) {
        if (this.level >= 3) {
            console.log(`[j7.${this.name}.log]: `, msg)
        }
    }

    warn(msg) {
        if (this.level >= 2) {
            console.warn(`[j7.${this.name}.warn]: `, msg)
        }
    }

    error(msg) {
        if (this.level >= 1) {
            console.error(`[j7.${this.name}.error]: `, msg)
        }
    }
}

class LoggerManager {
    constructor() {
    }

    createLogger(name) {
        const logger = new Logger(name)
        this[name] = logger
        return logger
    }
}

const loggerManager = new LoggerManager()

export default loggerManager
