
exports.index = function(req, res){
    
    var common = require('../node_action/common.js');
    var TplHelper = require('../node_common/tplHelper.js');
    var data = {};

    function init(){

        data = common.initData(data);
        TplHelper.echo(req, res, 'login.tpl', data);
    }

    if(!TplHelper.hasExpire(req, res)){
        TplHelper.readCache(req, res, init);
    }
}

exports.login = function(req, res){
    var common = require('../node_common/common.js');
    var qs = require('querystring');
    var hadLogin = false;

    if(hadLogin){
        //清理token ? logout ?
    }

    req.onPostEnd(parsePost);

    function parsePost(err, data){
        var postData = data.toString();
        var postObj = qs.parse(postData);
        var session = require('../node_common/session.js');
        var user = postObj.user;
        //应该检索下用户名密码是否存在于数据库
        if(user){
            var token = session.createToken(res, user);
            res.json({ok : token});
        }
    }
}