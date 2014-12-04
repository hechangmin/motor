
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
        var pwd = postObj.pwd;

        //应该检索下用户名密码是否存在于数据库
        if('admin' === user && 'root' === pwd){
            //var token = session.createToken(res, user);
            //res.json({ok : token});
            // session.prop('user1', 'hello');
            // session.prop('user2', 'hello');
            // session.prop('user3', 'hello');
            // session.prop('user4', 'hello');
            // session.prop('user', 'hello');
            // session.prop('test', null);

            //设置session 并存储
            //session.q('user', user);

            console.log(session.prop('user'), session.prop('user1'));
            console.log('sess test ', session.prop('test'));
            res.json({ret : 0, msg : '', data : {},});            
        }
    }
}