var path = require('path')
var webpack = require('webpack')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

var Conf = require('../conf')
var baseWebpackConfig = require('./base.conf')


function testWebpackConfigCreator(name, live, devEnv) {
    const testPath = path.resolve(Conf.RootPath, 'test', name)
    const testDistPath = path.join(testPath, 'dist')

    const config = Object.assign({}, baseWebpackConfig, {
        entry: {
            [name]: ['babel-polyfill', path.join(testPath, 'index.js')]
        },
        devtool: 'inline-source-map',
        output: {
            path: testDistPath,
            publicPath: live ? `http://${Conf.Dev.Host}:${Conf.Dev.Port}/` : '',
            filename: '[name].js'
        },
        plugins: [
            new CleanWebpackPlugin(['dist'], {
                root: testPath,
                verbose: true,
                dry: false,
            }),
            new webpack.DefinePlugin({
                BUILD: {
                    'process.env.NODE_ENV': JSON.stringify(devEnv ? 'develop' : 'production'),
                    MODE: JSON.stringify(devEnv ? 'develop' : 'production'),
                    DEBUG: devEnv ? true : false,
                }
            }),
            new webpack.HashedModuleIdsPlugin(),

            // split vendor js into its own file
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                minChunks: function (module) {
                    // any required modules inside node_modules are extracted to vendor
                    const cond = (
                        module.resource &&
                        /\.js$/.test(module.resource) && (
                            module.resource.indexOf(path.resolve(Conf.RootPath, 'node_modules')) !== -1 ||
                            module.resource.indexOf(path.resolve(Conf.RootPath, 'third')) !== -1 ||
                            module.resource.indexOf(path.resolve(Conf.RootPath, 'dist')) !== -1 ||
                            module.resource.indexOf(path.resolve(Conf.RootPath, 'source')) !== -1
                        )
                    )

                    return cond
                }
            }),

            // extract webpack runtime and module manifest to its own file in order to
            // prevent vendor hash from being updated whenever app bundle is updated
            new webpack.optimize.CommonsChunkPlugin({
                name: 'manifest',
                chunks: ['vendor']
            }),

            new CopyWebpackPlugin([
                {
                    from: path.resolve(testPath, 'assets'),
                    to: path.resolve(testDistPath, 'assets'),
                    ignore: ['.*']
                }
            ]),

            new HtmlWebpackPlugin({
                title: Conf.Dev.HtmlTitle,
                template: path.resolve(testPath, 'index.html'),
                inject: true,
            }),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
        ],
    })

    if (!devEnv) {
        config.plugins.push(new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            generateStatsFile: 'true',
        }))
    }

    return config
}

module.exports = testWebpackConfigCreator
