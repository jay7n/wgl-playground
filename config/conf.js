const path = require('path')

exports.RootPath = path.resolve(__dirname, '..')

exports.DistPath = path.resolve(exports.RootPath, 'dist')

// exports.LibDistPath = path.resolve(exports.RootPath, 'lib')

exports.Dev = {
    Host: '127.0.0.1',
    Port:9526,
    HtmlTitle: '♘ LiN Graphics Engine of Rendering -Dev'
}

exports.Prod = {
    Port: 9527,
    HtmlTitle: '♞ LiN Graphics Engine of Rendering'
}

exports.AutoOpenBrowser = true

exports.HMR = true

exports.FtpDeploy = {
    Dist: {
        Local: exports.DistPath,
        Remote: '/htdocs/example/demo/',
    },
    Host: 'example.ftp.com',
    WWW: 'http://example.com/'
}
