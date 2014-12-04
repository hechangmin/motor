/**
 * session 管理
 * @author  hechangmin@gmail.com
 * @date 2014-11-27
 */

var crypto = require('crypto');
var uuid = require('./uuid.js');

//key中字符不要包含0~9及abcdef
var key = 'motor';
var sessionId = '';


exports.createToken = function(res, user) {
    var secret = crypto.createHash('md5').update(user + key).digest('hex');
    var q1 = (+new Date()).toString(16);
    var q2 = parseInt(secret.length * Math.random());
    var q3 = key.charAt(parseInt(key.length * Math.random()));
    var q4 = q1.length;
    var token = q3 + secret.substr(q2) + q1 + secret.substr(0, q2) + q3 + q4 + q3 + q2;
    //console.log(q4, '|', q1, '|', q2, '|', q3, '|', secret);

    res.setCookie('token', token, {
        httponly: 'httponly',
        path: '/'
    });

    console.log('hello', token);

    return token;
};

exports.getSID = function(h) {
    return uuid.init(h);
};

var _parse = function(token) {
    var q3 = token.charAt(0);
    var arrToken = token.split(q3);
    var q2 = parseInt(arrToken[arrToken.length - 1]);
    var q4 = parseInt(arrToken[arrToken.length - 2]);
    var len = 32 + q4;
    var secret = arrToken[1];
    var q1 = secret.substr(32 - q2, q4);
    secret = secret.substr(len - q2) + secret.substr(0, 32 - q2);
    //console.log(q4, '|', q1, '|', q2, '|', q3, '|', secret);
};