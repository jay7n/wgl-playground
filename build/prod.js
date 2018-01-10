const ora = require('ora')
const webpack = require('webpack')
const path = require('path')
const chalk = require('chalk')
const opn = require('opn')
const parseArgs = require('minimist')
const _ = require('lodash')

const Conf = require('../config/conf')

const prodWebpackConfig = require('../config/webpack/prod.conf')
const libWebpackConfig = require('../config/webpack/lib.conf')

function _build_prod(isLib) {
    return new Promise((resolve, reject) => {
        const wpConfg = isLib ? libWebpackConfig : prodWebpackConfig
        webpack(wpConfg, function(err, stats) {
            if (err) reject(err)

            console.log(stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false
            }, '\n'))

            resolve()
        })
    })
}

function _start_server(port) {
    return new Promise((resolve, reject) => {
        const express = require('express')
        const app = express()
        app.use('/', express.static(Conf.DistPath))
        app.listen(port, function(err) {
            if (err) reject(err)
            opn(`http://127.0.0.1:${port}`)
            resolve()
        })
    })
}

async function main(args) {
    try {
        let has_build_arg = _.includes(args._, 'build')
        let has_server_arg = _.includes(args._, 'server')
        let has_lib_arg = _.includes(args._, 'liglib')

        if (_.isEmpty(args._)) {
            has_build_arg = true
            has_server_arg = true
        } else if (has_lib_arg) {
            has_server_arg = false
            has_build_arg = false
        }

        if (has_build_arg) {
            console.log(chalk.green('build production...'))
            await _build_prod()
            console.log(chalk.green('build production done.'))
        }
        if (has_server_arg) {
            const port = args.port || Conf.Prod.Port
            await _start_server(port)
            console.log(chalk.green(`start server listening at port ${port} ... `))
        }
        if (has_lib_arg) {
            console.log(chalk.green('build lig lib production...'))
            await _build_prod(true)
            console.log(chalk.green('build lig lib production done.'))
        }
    } catch(err) {
        console.log(chalk.red(err))
    }
}

if (require.main === module) {
    const args = parseArgs(process.argv.slice(2))
    main(args)
} else {
    module.exports = main
}
