/**
 * 创建服务、监听端口
 * @author hechangmin
 */

(function App(){
    var server,
        http       = require('http'),
        cluster    = require('cluster'),
        configs     = require('./configs.js'),
        controller = require('./controller.js'),
        numCPUs    = require('os').cpus().length;

    function crearServer(){
        var secure   = configs.secure, options = {};
        
        if(secure.https){
            fs = require('fs');

            //证书及私钥
            options = {
                key  : fs.readFileSync(secure.key),
                cert : fs.readFileSync(secure.cert)
            };
        }

        server = secure.https ? https.createServer(options): http.createServer();
        server.on('request', controller.init);
        server.listen(configs.port||80);
    }

    function bindProcessEvent(){
        process.on('uncaughtException', function(err){
            console.log('server carsh\r\n', err);
            process.send({action : 'rpt', msg : String(err)});
            quit();
        });

        process.on('message',function(message){
            if('changed' === (message['action'])){
                console.log(new Date(), message['msg'] + ' changed.');
                quit();
            }
        });
    }

    function quit(){
        try {
            var killTimer = setTimeout(function () {
                process.exit(1);
            });

            killTimer.unref();

            if(cluster.worker){
                server.close();
                cluster.worker.disconnect();
            }
        } catch (e) {
            console.log('error when quit()：', e.stack);
        }
    }

    function init(){
        if (cluster.isMaster) {
            console.log('[master] start.');

            for (var i = 0; i < numCPUs; i++) {
                cluster.fork();
            }

            bindProcessEvent();

            cluster.on('exit', function(worker){
                console.log('[worker'+ worker.id + '] died.');
                cluster.fork();
            });
        } else if(cluster.isWorker) {
            console.log('[worker' + cluster.worker.id + '] start.');
            crearServer();
        }
    }

    if(!module.parent){
        init();
    }
})();