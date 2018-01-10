#! /usr/bin/env node

const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const parseArgs = require('minimist')
const opn = require('opn')

const testWebpackConfigCreator = require('../config/webpack/test.conf')
const Conf = require('../config/conf')

function _log_start_listen() {
    const host = Conf.Dev.Host
    const port = Conf.Dev.Port

    const uri = `http://${host}:${port}`

    const _report = () => {
        console.log(chalk.green('> app listening at ' + uri + '  ... ͼ\n'))
    }

    return {host, port, uri, _report}
}

function _build_test(testWebpackConfig) {
    return new Promise((resolve, reject) => {
        webpack(testWebpackConfig, function(err, stats) {
            if (err) reject(err)

            console.log(stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false
            }, '\n'))

            resolve(testWebpackConfig)
        })
    })
}

function _live(isHMRMode, testPath, wpConfig) {
    const express = require('express')
    const webpackDevMiddleware = require('webpack-dev-middleware')

    Object.keys(wpConfig.entry).forEach(function (name) {
        wpConfig.entry[name] = ['webpack-hot-middleware/client'].concat(wpConfig.entry[name])
    })
    const compiler = webpack(wpConfig)

    const devMiddleware = webpackDevMiddleware(compiler, {
        publicPath: wpConfig.output.publicPath,
        inline: true,
    })

    const app = express()
    app.use(devMiddleware)
    app.use('/assets', express.static(path.resolve(testPath, 'assets')))

    let hotMiddleware = null
    if (isHMRMode) {
        const webpackHotMiddleware = require('webpack-hot-middleware')
        hotMiddleware = webpackHotMiddleware(compiler, {
            log: () => {}
        })
        app.use(hotMiddleware)
    }

    // force page reload when html-webpack-plugin template changes
    compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
            if (isHMRMode) {
                hotMiddleware.publish({ action: 'reload' })
            }
            cb()
        })
    })

    const { host, port, uri, _report } = _log_start_listen()
    app.listen(port, host)

    devMiddleware.waitUntilValid(() => {
        _report()

        if (Conf.AutoOpenBrowser) {
            opn(uri)
        }
    })
}

function _start_server(testDistPath, port) {
    return new Promise((resolve, reject) => {
        const express = require('express')
        const app = express()
        app.use('/', express.static(testDistPath))
        app.listen(port, function(err) {
            if (err) reject(err)
            opn(`http://127.0.0.1:${port}`)
            resolve()
        })
    })
}

function show_help(err) {
    if (err) {
        // TODO: make it nice
        console.log(err)
    }

    // TODO: make it nice
    console.log('help: xxxxx')

}

async function main(args) {
    try {
        const testName = args.name
        const mode = args.mode || 'build-and-server'
        const libver = args.libver || 'dev'

        const modes = [
            'build', // 0
            'server', // 1
            'build-and-server', // 2
            'live', // 3
            'live-and-hmr' // 4
        ]

        if (libver != 'dev' && libver != 'prod') {
            show_help()
            return
        } else if (!modes.includes(mode)) {
            show_help()
            return
        }

        let build_mode = true
        let live_mode =false
        let hmr_mode = false
        let server_mode = true

        switch (mode) {
        case modes[0]:
            build_mode = true
            break
        case modes[1]:
            server_mode = true
            break
        case modes[2]:
            build_mode = true
            server_mode = true
            break
        case modes[3]:
            live_mode = true
            break
        case modes[4]:
            live_mode = true
            hmr_mode = true
            break
        }

        const devEnv = libver == 'dev' ? true : false
        const wpConfig = testWebpackConfigCreator(testName, live_mode, devEnv)

        console.log(chalk.green(`build Linger lib-test '${chalk.cyan(testName)}' using '${chalk.cyan(libver)}' lib version in '${chalk.cyan(mode)}' mode ...`))

        if (live_mode) {
            const testPath = path.resolve(Conf.RootPath, 'test', testName)
            _live(hmr_mode, testPath, wpConfig)
        } else if (build_mode){
            await _build_test(wpConfig)
            console.log(chalk.green('done.'))
        }

        if (server_mode) {
            const port = args.port || Conf.Prod.Port
            await _start_server(wpConfig.output.path, port)
            console.log(chalk.green(`start server listening at port ${port} ... `))
        }
    } catch (err) {
        console.log(chalk.red(err))
    }

}
if (require.main === module) {
    const args = parseArgs(process.argv.slice(2))
    main(args)
} else {
    module.exports = main
}
