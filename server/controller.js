/**
 * 流程控制
 *
 * @author  hechangmin@gmail.com
 * @date 2014-3-29
 */

var url         = require('url'),
    path        = require('path'),
    domain      = require('domain'),
    router      = require('./router.js'),
    configs     = require('./configs.js'),
    logger      = require('./node_common/log.js'),
    common      = require('./node_common/common.js'),
    requestEx   = require('./node_common/requestEx.js').init,
    responseEx  = require('./node_common/responseEx.js').init,
    reqAssets   = require('./node_common/assetsHdler.js').init;

function routing(req, res, curPath, extName) {
    var hasRouteRule = false;

    try {
        router.forEach(function(item, i) {
            if (req.method.toUpperCase() === item[0].toUpperCase() 
                && 0 === curPath.indexOf(item[1])) {
                throw item[2];
            }
        });
    } catch (handle) {
        hasRouteRule = true;
        handle(req, res);
    }

    if (!hasRouteRule) {
        reqAssets.apply(null, arguments);
    }
}

function isForbidden(curPath, extName) {
    var bRet = false;

    try {
        configs.forbidden.forEach(function(matchList, i) {
            matchList.forEach(function(item) {
                if ((i < 2 && curPath.match(item)) 
                    || (item === extName) && i === 2) {
                    throw {};
                }
            });
        });
    } catch (err) {
        bRet = true;
    }

    return bRet;
}

function dispatch(req, res){

    var params  = url.parse(req.url, true),
        curPath = params.pathname,
        extName = path.extname(params.pathname).slice(1);

    if('' === extName){
        curPath = curPath.replace(/(\/*$)/g, '') + '/' + configs.welcome;
        extName = 'html';
    }

    if (isForbidden(curPath, extName)){
        common.handle403(res);
        logger.error(req.getIP(), 403, req.url, 'Forbidden', req.reff);
    }else{
        try{
            routing(req, res, curPath, extName);
        }catch(e){
            common.handle500(res, JSON.stringify(e));
            logger.error(req.getIP(), 500, req.url, 'Error in routing', req.reff);
        }
    }
}

function handleDomain(req, res){
    var d = domain.create();
    d.on('error', function(err) {
        logger.error(req.getIP(), 500, req.url, 'Error in domain ', req.reff);
    });
    d.add(req);
    d.add(res);
    d.enter();
}

exports.init = function(req, res) {
    requestEx(req, res);
    responseEx(req, res);
    handleDomain(req, res);
    dispatch(req, res);
};