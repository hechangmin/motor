/**
 * 为response实例增加扩展
 * @author  hechangmin
 * @date 20140411
 *
 * res.setCookie    设置Cookie
 * res.clearCookie  清除Cookie
 */

exports.init = function(res){

    var Cookie = require('./cookie.js');

    res.setCookie = function (name, value, options){
        Cookie.set(res, name, value, options);
    };

    res.clearCookie = function(name, options){
        Cookie.clear(res, name, options);
    };

    res.json = function(obj){
        var configs = require('../configs.js');
        var mime    = require('./mime.js').types;
        var common  = require('./common.js');

        var lastModified = (new Date()).toUTCString(),
            maxAge       = configs.jsonExpires || 0,
            contentType  =  mime['json'] + ';charset=UTF-8';

        res.setHeader("Content-Type", contentType);
        res.setHeader("Last-Modified", lastModified);
        common.handleExpires(res,maxAge);

        try{
            res.end(JSON.stringify(obj));
        }catch(err){
            res.end('{ msg : JSON parsing error.}');
        }
    };
};