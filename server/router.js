/**
 * 业务路由配置
 * @author  hechangmin@gmail.com
 * @date 2014-11-26
 */

var strModBasePath = './node_action/';

module.exports = [
    ['GET', '/template/index.html', load('template')],
    ['GET', '/upload/index.html', load('upload', 'index')],
    ['GET', '/upload/multipart', load('upload', 'multipart')],
    ['POST', '/upload/upload', load('upload', 'upload')],
    ['GET', '/upload/show', load('upload', 'show')],
    ['GET', '/api/test.json', load('api')],
    ['GET', '/session/index.html', load('session', 'index')],
    ['POST', '/session/login', load('session', 'login')]
];

function load(mod, action){
    var strModPath = strModBasePath + mod;
    var oMod = require(strModPath);
    return action ? oMod[action] : oMod.init;
}