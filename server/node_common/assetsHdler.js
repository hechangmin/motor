/**
 * 静态文件处理器
 *
 * @author hechangmin
 * @date 2014-3-29
 */

var fs       = require('fs'),
    mime     = require('./mime.js').types,
    configs  = require('../configs.js'),
    logger   = require('./log.js'),
    common   = require('./common.js');

/**
 * 处理静态资源
 *
 * @param {request}  req
 * @param {response} res
 * @return
 */
exports.init = function(req, res, curPath, extName) {

    var raw,
        range,
        maxAge,
        target,
        contentType,
        lastModified,
        curPath = curPath.substr(1);

    fs.stat(curPath, function(err, stats) {

        if (err) {
            common.handle404(res, req.url);
            logger.error(req.getIP(), 404, req.url);
            return;
        }

        lastModified = stats.mtime.toUTCString();
        contentType = mime[extName] || "text/plain";
        range = req.headers["range"];
        contentType += ';charset=';
        contentType += configs.charset;
        res.setHeader("Content-Type", contentType);
        res.setHeader("Last-Modified", lastModified);

        // 规避GZIP 压缩造成内容长度不一致的问题
        // res.setHeader("Content-Length", stats.size);

        maxAge = common.getMaxAge(extName);

        if(maxAge){
            common.handleExpires(res,maxAge);
        }

        if (req.headers['if-modified-since'] && lastModified == req.headers['if-modified-since']) {
            common.handle304(res);
            logger.access(req.getIP(), 304, req.url);
            return;
        }

        if (range) {

            range = common.handleRange(range, stats.size);

            if (range) {
                res.setHeader("Content-Range", "bytes " + range.start + "-" + range.end + "/" + stats.size);
                // 断点续传 206
                res.setHeader("Content-Length", (range.end - range.start + 1));
                raw = fs.createReadStream(curPath, {"start": range.start, "end": range.end});
                common.compressGzip(req, res, configs.gzip, extName, raw, 206, "Partial Content", stats.size);
            } else {
                res.writeHead(416, "Request Range Not Satisfiable");
                res.end();
                logger.error(req.getIP(), 416, req.url);
            }
        } else {
            raw = fs.createReadStream(curPath);
            common.compressGzip(req, res, configs.gzip, extName, raw, 200, "Ok", stats.size);
            logger.access(req.getIP(), 200, req.url);
        }
    });
}