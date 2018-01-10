var path = require('path')

var Conf = require('../conf')

module.exports = (function() {
    var baseConfig = {
        resolve: {
            extensions: ['.js', '.glsl'],
            alias: {
                '@': path.resolve(Conf.RootPath, 'source'),
                '@@': path.resolve(Conf.RootPath, 'dist'),
            },
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    include: [path.resolve(Conf.RootPath, 'source')],
                    loader: 'eslint-loader',
                    enforce: 'pre',
                    options: {
                        formatter: require('eslint-friendly-formatter'),
                    }
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                },
                {
                    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'img/[name].[hash:7].[ext]'
                    }
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'fonts/[name].[hash:7].[ext]'
                    }
                },
                {
                    test: /\.(vert|frag|glsl)$/,
                    loader: 'webpack-glsl-loader'
                }
            ],
        },
    }
    return baseConfig
})()
