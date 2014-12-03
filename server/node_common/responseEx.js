/**
 * 为res实例增加扩展
 * @author  hechangmin
 * @date 20140411
 *
 * res.setCookie    设置Cookie
 * res.clearCookie  清除Cookie
 */

var zlib     = require('zlib'),
    logger   = require('./log.js'),
    Cookie   = require('./cookie.js'),
    common   = require('./common.js'),
    configs  = require('../configs.js'),
    mime     = require('./mime.js').types;

exports.init = function(req, res) {
    
    res.setCookie = function(name, value, options) {
        var strCookie = Cookie.set(name, value, options || {});
        res.setHeader('Set-Cookie', strCookie);
    };
    
    res.clearCookie = function(name, options) {
        var strCookie = Cookie.clear(name, options || {});
        res.setHeader('Set-Cookie', strCookie);
    };

    res.json = function(obj) {
        var ret = '{}';
        var lastModified = (new Date()).toUTCString();
        var maxAge = configs.jsonExpires || 0;
        var contentType = mime['json'] + ';charset=UTF-8';

        res.setHeader("Content-Type", contentType);
        res.setHeader("Last-Modified", lastModified);

        // 增加过期时间控制
        common.handleExpires(res, maxAge);

        // 处理gzip压缩逻辑
        var acceptEncoding = req.headers['accept-encoding'];

        if (!acceptEncoding) {
            acceptEncoding = '';
        }

        try {
            ret = JSON.stringify(obj);
            // Note: this is not a conformant accept-encoding parser. 
            // See http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3 
            if (acceptEncoding.match(/\bgzip\b/)) {

                res.writeHead(200, {
                    'content-encoding': 'gzip'
                });

                zlib.gzip(ret, function(err, buffer) {
                    if (!err) {
                        res.end(buffer);
                    }
                });
            } else if (acceptEncoding.match(/\bdeflate\b/)) {
                res.writeHead(200, {
                    'content-encoding': 'deflate'
                });

                zlib.deflate(ret, function(err, buffer) {
                    if (!err) {
                        res.end(buffer);
                    }
                });
            }else{
                res.writeHead(200, {});
                res.end(ret);
            }
        } catch (err) {
            logger.error(req.getIP(), req.url, JSON.stringify(err));
            res.writeHead(200, {});
            res.end(ret);
        }
    };
};