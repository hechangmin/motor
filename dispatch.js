/**
 * 配置路由映射
 * @author hechangmin@gmail.com
 */

var url        = require('url'),
    path       = require("path"),
    config     = require('./config.js'),
    router     = require('./router.js');

exports.init = function(req, res) {

    var curPath    = url.parse(req.url).pathname,
        realPath   = path.normalize(path.join(config.root, curPath)),
        staticPath = path.join(config.root, config.assets);

    res.setHeader("Server", config.serverName);

    if(config.debug){
        console.log(realPath, curPath);
    }

    //判断访问路径权限
    if (0 !== realPath.indexOf(config.root)) {
        res.writeHead(403, "Forbidden", {
            'Content-Type': 'text/plain'
        });
        res.end("Forbidden");
    } else {
        //判断是否是静态文件
        if (0 === realPath.indexOf(staticPath)) {
            router.disPatchAsset(req, res, curPath, realPath);
        } else {
            router.disPatchDynamic(req, res, curPath, realPath);
        }
    }
};