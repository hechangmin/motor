/**
 * 核心公用处理
 * @author hechangmin@gmail.com
 * @date 2014.1
 */

var fs        = require('fs');
var configs   = require('../configs.js');
var formidable = require("formidable");

module.exports = {
    /**
     * 上传文件回调
     * @param  {request}   req
     * @param  {Function} callback
     */
    onUpload : function(req, callback){
        var form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.keepExtensions = true;
        form.maxFieldsSize = configs.maxPostSize;
        form.uploadDir = configs.uploadPath; 
        form.parse(req, callback);
    },

    getMaxAge : function (extName){
        var item,
            nIndex  = 0,
            nMaxAge = 0,
            expiresConfig = configs.expires;

        while(item = expiresConfig[nIndex++]){
            if(item[0].test(extName)){
                return item[1];
            }
        }
        
        return 0;
    },

    handleError : function(res, errorCode, error){
        
        error = error || configs.errDesc[errorCode];

        if(!res.headersSent){
            res.writeHead(errorCode, error, {
                'Content-Type': 'text/html'
            });
        }
        
        try{
            var stream = fs.createReadStream(configs.errPage[errorCode]);
            stream.on("error", function(err) {
                res.end(error);
            });
            stream.pipe(res);
        }catch(e){
            res.end(error);
        }
    },

    handle302 : function(res, url){
        res.writeHead(302, {'Location': url});
        res.end();
    },

    handle304 : function(res){
        if(!res.headersSent){
            res.writeHead(304, "Not Modified");
        }
        res.end();
    },

    handleExpires : function(res, maxAge){
        var expires = new Date();
        expires.setTime(expires.getTime() + maxAge);
        res.setHeader("Expires", expires.toUTCString());
        res.setHeader("Cache-Control", "max-age=" + maxAge);
    },

    handleRange : function (str, size) {

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
    },

    compressGzip : function(req, res, gzip, ext, raw, statusCode, reason, size) {
        var stream         = raw,
            acceptEncoding = req.headers['accept-encoding'] || "",
            hadCompress    = false,
            matched,
            zlib;

        if(gzip){

            matched = ext.match(gzip);
            
            if(matched){

                zlib = require("zlib");

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
    }
};