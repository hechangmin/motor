/**
 * session 管理
 * @author  hechangmin@gmail.com
 * @date 2014-11-27
 */

var fs = require('fs');

(function(uuid, configs){

    var _sid = 0;
    var _session = {};
    var _path;

    function init(req, res){
        
        var needGet = true;

        // 启用session的情况
        if(configs.enabledSession){

            _sid = req.getCookie(configs.sessionName);
            
            if(!_sid){
                needGet = false;
                _sid = uuid.init();
            }

            _path = configs.sessionPath + _sid;

            if(needGet){
                //读取\更新_session    
                _get();
            }

            //每次都设置，主要是为了让过期时间更合理
            res.setCookie(configs.sessionName, _sid, {
                httponly: 'httponly',
                path: '/',
                expires : configs.sessionExpires
            });
        }
    }

    function _set(){
        var content = JSON.stringify(_session);
        fs.writeFileSync(_path, content);
    }

    function _get(){
        var content = '{}', obj = {};
        try{
            content = fs.readFileSync(_path, 'utf-8');
            _session = JSON.parse(content);
        }catch(err){
            //console.log(err);
        }
    }

    function prop(key, val){
        if(_sid){
            if(undefined !== val){
                _session[key] = val;
                _set();    
            }else if(null === val){
                delete _session[key];
                _set(); 
            }else{
                return _session[key];
            }
        }
    }

    module.exports = {
        prop : prop,
        init : init
    };
}(require('./uuid.js'), require('../configs.js')));