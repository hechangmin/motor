 /**
  * 日志器
  * @deprecated log4js
  * @author hechangmin
  * @date 2014.1
  */

 var log4js = require('log4js');

 log4js.configure(require('./config').log);

 exports.logger = function(name) {
     var logger;

     switch (name) {
         case 'access':
             logger = log4js.getLogger('access');
             logger.setLevel('INFO');
             break;
         case 'error':
             logger = log4js.getLogger('error');
             logger.setLevel('ERROR');
             break;
     }
     return logger;
 }