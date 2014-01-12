/**
 * 配置文件
 * @author  hechangmin
 */

module.exports = {
    port       : 8888,
    charset    : 'utf-8',
    debug      : true,
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
    }
};