/**
 * 为request实例增加扩展
 * @author  hechangmin
 * @date 2014-12-03
 *
 * req.get       取GET参数
  * req.getIP     获取客户端IP
 * req.getCookie 获取cookie
 */

var url     = require('url'),
    cookie  = require('./cookie.js'),
    session = require('./session.js'),
    configs = require('../configs.js');

exports.init = function(req, res){
    var mapQuery,
        urlParams;

    req.get = function (key){
        if(!mapQuery){
            if(!urlParams){
                urlParams = url.parse(req.url, true);
            }
            mapQuery = urlParams.query || {}
        }
        return mapQuery[key];
    };

    req.reff = req.headers['referer'] || '';

    req.getIP = function(){
        var h = req.headers, r = 'x-real-ip', x = 'x-forwarded-for', p = 'Proxy-Client-IP', w = 'WL-Proxy-Client-IP';
        var ip = h[r] || h[x] || h[p] || h[w] || req.connection.remoteAddress;

        ip = (ip || '') && ip.split(',')[0];
        req.getIP = function(){return ip;}
        return ip;
    };

    req.getCookie = function(name){
        return cookie.get(req, name);
    };

    // post 业务逻辑要放在回调里
    if (req.method.toUpperCase() === "POST") {
        req.onPostEnd = function(callback){
            var postBody  = [];
            var nPostSize = 0;
            req.on('data', function (chunk) {
                postBody.push(chunk);
                nPostSize += chunk.length;
                //上传大小控制
                if(nPostSize >= configs.maxPostSize){
                    callback(1, 'data too large.');
                }
            }).on("end", function () {
                callback(0, Buffer.concat(postBody, nPostSize));
            });
        };
    }
};