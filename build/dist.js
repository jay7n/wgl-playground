#! /usr/bin/env node

const chalk = require('chalk')
const webpack = require('webpack')
const parseArgs = require('minimist')
const _ = require('lodash')

const distWebpackConfigCreator = require('../config/webpack/dist.conf')

function _build_dist(mode) {
    return new Promise((resolve, reject) => {
        const distWebpackConfig = distWebpackConfigCreator(mode)
        webpack(distWebpackConfig, function(err, stats) {
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

async function main(args) {
    try {
        let mode = args.mode
        console.log(chalk.green(`build lig lib in ${mode} mode ...`))
        await _build_dist(mode)
        console.log(chalk.green('done.'))
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
