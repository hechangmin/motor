/**
 * 创建服务、监听端口
 */

var http     = require('http'),
    https    = require('https'),
    dispatch = require('./dispatch.js'),
    config   = require('./config.js'),
    port     = process.argv[2] || config.port || 8888,
    isHttps  = config.https;

if(isHttps){
    var fs = require('fs');

    // 需要有证书及私钥文件
    var options = {
        key  : fs.readFileSync('./privatekey.pem'),
        cert : fs.readFileSync('./certificate.pem')
    };
}

var server = isHttps ? https.createServer(options): http.createServer();
server.on('request', dispatch.init);
server.listen(port);

console.log('Server running...');