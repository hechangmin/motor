/**
 * 操作cookie
 * @author hechangmin@gmail.com
 * @date 2014.12.3
 */

exports.get = function(req, name) {
    var tmp, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)", "gi");

    if ((tmp = reg.exec(unescape(req.headers.cookie))))
        return (tmp[2]);
    return null;
};

exports.set = function(name, value, options) {
    var exp, strCookie = name + "=" + escape(value);

    strCookie += ((options.path) ? "; path=" + options.path : "");
    strCookie += ((options.domain) ? "; domain=" + options.domain : "");

    if(options.expires){
        exp = new Date();
        //options.expires 天为单位
        exp.setTime(exp.getTime() + options.expires * 24 * 60 * 60 * 1000);
        strCookie += "; expires=" + exp.toUTCString();
    }
    
    //仅https可用
    strCookie += ((options.secure) ? "; secure" : "");

    //如果sessionid 或者 不希望被浏览器JS 调用的cookie 应该加 httponly
    strCookie += ((options.httponly) ? "; httponly" : "");

    return strCookie;
};

exports.clear = function(name, options) {

    var strCookie = name;

    strCookie += "=";
    strCookie += ((options.path) ? "; path=" + options.path : "");
    strCookie += ((options.domain) ? "; domain=" + options.domain : "");
    strCookie += "; expires=Thu, 01-Jan-70 00:00:01 GMT";

    return strCookie;
};