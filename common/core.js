/**
 * 核心处理器
 * @author hechangmin@gmail.com
 * @date 2014.1
 */

var fs     = require("fs"),
    path   = require("path"),
    config = require('../config.js');

/**
 * 统一处理404
 * @param  {response} res
 * @param  {String} curPath 当前请求路径
 * @return
 */
function process404(res, curPath){
    res.writeHead(404, "Not Found", {
        'Content-Type': 'text/plain'
    });
    res.end('This request URL "' + curPath + '" was not found.');
}

/**
 * 处理302
 * @param  {response} res
 * @param  {String} location
 * @return
 */
function process302(res, location){
    res.writeHead(302, {'Location': location});
    res.end();
}

/**
 * 统一处理304
 * @param  {response} res
 * @return
 */
function process304(res){
    res.writeHead(304, "Not Modified");
    res.end();
}

/**
 * 处理缓存
 * @param {response} res
 */
function processExpires(res){
    var expires = new Date();
    expires.setTime(expires.getTime() + config.expires.maxAge);
    res.setHeader("Expires", expires.toUTCString());
    res.setHeader("Cache-Control", "max-age=" + config.expires.maxAge);
}

/**
 * 处理 Range - 断点续传，流媒体等需要
 * @param  {String} str  request.header['range']
 * @param  {Number} size
 * @return
 */
function processRange (str, size) {

    var range = str.split("-"),
        start = parseInt(range[0], 10),
        end   = parseInt(range[1], 10);

    if (str.indexOf(",") != -1) {
        return;
    }
    // Case: -100
    if (isNaN(start)) {
        start = size - end;
        end = size - 1;
    // Case: 100-
    } else if (isNaN(end)) {
        end = size - 1;
    }

    // Invalid
    if (isNaN(start) || isNaN(end) || start > end || end > size) {
        return;
    }

    return {start: start, end: end};
};

/**
 * 处理压缩
 * @param  {request} req
 * @param  {response} res
 * @param  {String} ext 请求扩展名
 * @param  {Stream} raw  ReadStream
 * @param  {Number} statusCode
 * @param  {String} reason
 * @return
 */
function processCompress(req, res, ext, raw, statusCode, reason, size) {
    var stream         = raw,
        acceptEncoding = req.headers['accept-encoding'] || "",
        hadCompress    = false,
        matched,
        zlib;

    if(config.gzip){

        matched = ext.match(config.gzip);

        if(matched){
            zlib    = require("zlib");

            if (acceptEncoding.match(/\bgzip\b/)) {
                res.setHeader("Content-Encoding", "gzip");
                stream = raw.pipe(zlib.createGzip());
                hadCompress = true;
            } else if (acceptEncoding.match(/\bdeflate\b/)) {
                res.setHeader("Content-Encoding", "deflate");
                stream = raw.pipe(zlib.createDeflate());
                hadCompress = true;
            }
        }
    }

    if(!hadCompress){
        res.setHeader("Content-Length", size);
    }

    res.writeHead(statusCode, reason);
    stream.pipe(res);
};

/**
 * 分流静态资源
 * @param  {request} req
 * @param  {response} res
 * @param  {String} curPath  当前请求路径
 * @param  {String} realPath 完整真实路径
 * @return
 */
function disPatchAsset(req, res, curPath, realPath) {
    fs.stat(realPath, function(err, stats) {

         var ext = path.extname(realPath),
            mime,
            lastModified,
            ifModifiedSince = "if-modified-since",
            contentType,
            zlib,
            raw,
            acceptEncoding,
            range,
            matched;

        //处理404
        if (err) {
            process404(res, curPath);
        } else {
            if (stats.isDirectory()) {
                realPath = path.join(realPath, config.welcome);
                disPatchAsset(req, res, curPath, realPath);
            }else{
                mime = require("./mime.js").types;
                lastModified = stats.mtime.toUTCString();
                ext = ext ? ext.slice(1) : 'unknown';
                contentType = mime[ext] || "text/plain";
                range = req.headers["range"];

                contentType += ';charset=';
                contentType += config.charset;

                res.setHeader("Content-Type", contentType);
                res.setHeader("Last-Modified", lastModified);

                // 掉坑了，因为GZIP 跟这里的大小有出入，导致浏览器一直卡
                // 在 processCompress 中，如果没使用Gzip 会给加回来
                // res.setHeader("Content-Length", stats.size);

                //设置缓存
                processExpires(res);

                //处理304
                if (req.headers[ifModifiedSince] && lastModified == req.headers[ifModifiedSince]) {
                    process304(res);
                } else if (range) {
                    range = processRange(range, stats.size);
                    if (range) {
                        res.setHeader("Content-Range", "bytes " + range.start + "-" + range.end + "/" + stats.size);
                        // 断点续传 206 又需要 Content-Length
                        res.setHeader("Content-Length", (range.end - range.start + 1));
                        raw = fs.createReadStream(realPath, {"start": range.start, "end": range.end});
                        processCompress(req, res, ext, raw, 206, "Partial Content", stats.size);
                    } else {
                        res.writeHead(416, "Request Range Not Satisfiable");
                        res.end();
                    }
                } else {
                    raw = fs.createReadStream(realPath);
                    processCompress(req, res, ext, raw, 200, "Ok", stats.size);
                }
            }
        }
    });
};

module.exports = {
    disPatchAsset : disPatchAsset
}