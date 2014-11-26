/**
 * 日志器
 * @deprecated log4js
 * @author hechangmin
 * @date 2014.1
 */
var logger,
    log4js  = require('log4js'),
    configs = require('../configs.js');

if(configs.debug){
    configs.log.replaceConsole = true;
    configs.log.appenders.push({type: 'console'});
}

log4js.configure(configs.log);

module.exports = {
    access: function(){
        if(configs.enabledAccessLog){
            logger = log4js.getLogger('access');
            logger.info.apply(logger, arguments);
        }
    },
    error: function(){
        if(configs.enabledErrorLog){
            logger = log4js.getLogger('error');
            logger.info.apply(logger, arguments);
        }
    },
    debug: function(){
        if(configs.enabledDebugLog){
            logger = log4js.getLogger('debug');
            logger.info.apply(logger, arguments);
        }
    }
}