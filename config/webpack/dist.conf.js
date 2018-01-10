var path = require('path')
var webpack = require('webpack')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

var Conf = require('../conf')
var baseWebpackConfig = require('./base.conf')

const output = {
    common: {
        filename: 'linger.js',
        library: 'Linger',
        libraryTarget: 'umd',
    },
    dev: {
        path: path.resolve(Conf.DistPath, 'dev'),
    },
    prod: {
        path: path.resolve(Conf.DistPath, 'prod'),
    }
}

const devtool = {
    dev: 'inline-source-map',
    prod: '', // TODO
}

var plugins = {
    common: [
    ],
    dev: [
    ],
    prod: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            generateStatsFile: 'true',
        }),
    ]
}

function  distWebpackConfigCreator(mode) {
    const commonPlugins = [
        new CleanWebpackPlugin([path.basename(output[mode].path)], {
            root: path.dirname(output[mode].path),
            verbose: true,
            dry: false,
        }),
        new webpack.DefinePlugin({
            BUILD: {
                MODE: JSON.stringify(mode == 'dev' ? 'develop' : 'production'),
                DEBUG: false,
            }
        }),
    ]
    const config = {
        // entry: {
        //     lig: [path.resolve(Conf.RootPath, 'source', 'index.js')]
        // },
        entry: path.resolve(Conf.RootPath, 'source', 'index.js'),
        devtool: devtool[mode],
        output: Object.assign({}, output.common, output[mode]),
        plugins: [].concat(commonPlugins, plugins[mode]),
    }

    return Object.assign({}, baseWebpackConfig, config)
}

module.exports = distWebpackConfigCreator
