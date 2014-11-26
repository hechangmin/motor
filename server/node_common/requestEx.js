/**
 * 为request实例增加扩展
 * @author  hechangmin
 * @date 2014.11.24
 *
 * req.get       取GET参数
 * req.postData  取整段POST数据
 * req.getIP     获取客户端IP
 * req.getCookie 获取cookie
 */

exports.init = function(req, res){
    var mapQuery,
        urlParams,
        configs   = require('../configs.js'),
        url       = require('url'),
        Cookie    = require('./cookie.js');

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
        return Cookie.get(req, name);
    };
};