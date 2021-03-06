/**
 * 配置文件
 * @author  hechangmin
 */

module.exports = {
    debug      : true,
    port       : 8899,
    charset    : 'utf-8',
    root       : __dirname,
    domain     : 'localhost',
    welcome    : 'index.html',

    errPage  : {
        403 : 'node_data/errpage/403.html',
        404 : 'node_data/errpage/404.html',
        405 : 'node_data/errpage/405.html',
        500 : 'node_data/errpage/500.html'   
    },

    errDesc : {
        500 : 'Internal Server Error',
        405 : 'Method Not Allowed',
        404 : 'Not Found',
        403 : 'Forbidden'
    },
    
    //是否开启session功能
    enabledSession : true,
    //session 在cookie中的名字标识
    sessionName : 'sid',
    //session 使用的秘钥
    sessionKey : 'motor',
    //session 过期
    sessionExpires : 1,
    //session path(先文件，后续可以用redis 或 db)
    sessionPath : 'node_data/session/',

    //关闭该功能 gzip : false
    gzip       : /css|js|html|json/ig,

    tplCacheExp : 0, // 服务器 0 则关闭该功能
    tplExpires  : 3600000, // 浏览器
    jsonExpires : 3600000,

    //允许接收POST数据的大小上限
    maxPostSize : 1024 * 1024, // 1M
    uploadPath : 'node_data/upload',
    
    cssPath : '/css/',
    jsPath  : '/js/',
    imgPath : '/img/',

    //安全配置
    secure     : {
        https : false,
        key   : './privatekey.pem',
        cert  : './certificate.pem'
    },
    
    //缓存配置
    expires : [
        [/^(gif|png|jpg|js|css|ico)$/i, 604800000],
        [/^(html|htm)$/i, 86400000]
    ],

    //禁止访问 0 : 目录 1 : 具体文件 3 : 文件类型
    forbidden : [
        ['^/node_'],
        ['^/app.js', '^/configs.js', '^/controller.js', '^/daemon.js', '^/router.js', '^/package.json'],
        ['sql', 'log', 'tpl', 'sh', 'pid']],

    // 日志开关
    enabledErrorLog  : true,
    enabledAccessLog : true,
    enabledDebugLog  : true,

    // 日志常规配置
    log : {
        appenders: [{
            type: 'file',
            filename: './node_data/log/access.log',
            maxLogSize: 204800,
            backups: 10,
            category: 'access'
        },{
            type: 'file',
            filename: './node_data/log/error.log',
            maxLogSize: 102400,
            backups: 5,
            category: 'error'
        },{
            type: 'file',
            filename: './node_data/log/debug.log',
            maxLogSize: 204800,
            backups: 5,
            category: 'debug'
        }]
    },

    mail : {
        host: 'smtp.qq.com',
        // use SSL
        secureConnection: true,
        port: 465,
        auth: {
            user: '120@qq.com',
            pass: 'your_password'
        }
    },

    rptParams : {
        subject : 'test.com server carsh',
        to : '110@qq.com'
    },

    watchList : [
        'node_action',
        'node_common',
        'configs.js',
        'controller.js',
        'router.js',
        'app.js'
    ]
};