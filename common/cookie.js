/**
 * 操作cookie
 * @author hechangmin@gmail.com
 * @date 2013.1.10
 */

function get(req, name) {
    var tmp, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)", "gi");

    if ((tmp = reg.exec(unescape(req.headers.cookie))))
        return (tmp[2]);
    return null;
};

function set(name, value, options) {
    var exp = new Date(),
        strCookie = name + "=" + escape(value);

    strCookie += ((options.path) ? "; path=" + options.path : "");
    strCookie += ((options.domain) ? "; domain=" + options.domain : "");

    if ("undefined" === typeof options.expires) {
        //0 永不过期， 单位为分钟
        if (options.expires == 0) {
            options.expires = 100 * 365 * 24 * 60;
        }

        exp.setTime(exp.getTime() + expires * 60 * 1000);
        strCookie += "; expires=" + exp.toUTCString();
    }

    strCookie += ((options.secure) ? "; secure" : "");
    strCookie += ((options.httponly) ? "; httponly" : "");

    return strCookie;
}

function clear(name, options) {

    var strCookie = name;

    strCookie += "=";
    strCookie += ((options.path) ? "; path=" + options.path : "");
    strCookie += ((options.domain) ? "; domain=" + options.domain : "");
    strCookie += "; expires=Thu, 01-Jan-70 00:00:01 GMT";

    return strCookie;
}

module.exports = {

    get: get,

    set: function(res, name, value, options) {
        var strCookie = set(name, value, options);
        res.setHeader('Set-Cookie', strCookie);
    },

    clear: function(res, name, options) {
        var strCookie = clear(name, options);
        res.setHeader('Set-Cookie', strCookie);
    }
}