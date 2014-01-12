/**
 * 创建服务、监听端口
 */

var http     = require('http'),
    https    = require('https'),
    dispatch = require('./dispatch.js'),
    config   = require('./config.js'),
    port     = process.argv[2] || config.port || 8888,
    secure  = config.secure,
    fs,
    options;

if(secure.https){
    fs = require('fs');

    // 需要有证书及私钥文件
    options = {
        key  : fs.readFileSync(secure.key),
        cert : fs.readFileSync(secure.cert)
    };
}

var server = secure.https ? https.createServer(options): http.createServer();
server.on('request', dispatch.init);
server.listen(port);

console.log('Server running...');