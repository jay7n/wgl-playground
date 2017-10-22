const path = require('path')

exports.RootPath = path.resolve(__dirname, '..')

exports.DistPath = path.resolve(exports.RootPath, '..', 'web')

exports.Dev = {
    Host: '127.0.0.1',
    Port:9526,
    HtmlTitle: 'A Stupid App Dev ♘'
}

exports.Prod = {
    Port: 9527,
    HtmlTitle: 'A Stupid App ♞'
}

exports.AutoOpenBrowser = true

exports.HMR = false

exports.FtpDeploy = {
    Dist: {
        Local: exports.DistPath,
        Remote: '/htdocs/example/demo/',
    },
    Host: 'example.ftp.com',
    WWW: 'http://example.com/'
}
