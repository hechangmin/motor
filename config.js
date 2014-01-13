/**
 * 配置文件
 * @author  hechangmin
 */

module.exports = {
    port       : 8888,
    charset    : 'utf-8',
    root       : __dirname,
    assets     : '/assets',
    serverName : 'Node-Motor',
    welcome    : 'index.html',

    //关闭该功能 gzip : false
    gzip       : /css|js|html|json/ig,

    //安全配置
    secure     : {
        https : false,
        key   : './privatekey.pem',
        cert  : './certificate.pem'
    },

    //缓存配置
    expires    : {
        fileMatch  : /^(gif|png|jpg|js|css)$/ig,
        //关闭该功能 maxAge ：0
        maxAge     : 604800000 //一周 7*24*60*60*1000
    },

    //不记录访问日志 access_log : false
    access_log : true,

    log : {
        appenders: [{
            type: 'console'
        },{
            type: 'file',
            filename: './data/log/access.log',
            maxLogSize: 102400,
            backups: 4,
            category: 'access'
        }, {
            type: 'file',
            filename: './data/log/error.log',
            maxLogSize: 204800,
            backups: 4,
            category: 'error'
        }],
        replaceConsole: true
    }
};