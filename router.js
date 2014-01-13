/**
 * 配置路由映射
 * @author hechangmin@gmail.com
 */

// var url        = require('url'),
//     path       = require("path"),
    var controller = require('./controller.js');
//     config     = require('./config.js'),
    var core       = require('./common/core.js');

// var router = {
//     '/getname' : controller.getname,
//     '/getage'  : controller.getage,
//     '/getjson' : controller.ajaxtest
//};







/**
 * 处理配置中的url router
 * @param { } [varname] [description]
 * @return
 */
function router(req, res, curPath, realPath){

    //处理303问题

    //分派到模块

}
// if('favicon.ico' === curPath.slice(1)){
//         fs.exists(favicon, function (exists) {
//             if(exists){
//                 res.writeHead(302, {'Location': location});
//                 res.end();
//             }else{

//             }
//         });
//     }
module.exports = {

    disPatchDynamic : function(){
        //
    },

    disPatchAsset : function(req, res, curPath, realPath){
        router(req, res, curPath, realPath);
        core.disPatchAsset(req, res, curPath, realPath);
    }
};
