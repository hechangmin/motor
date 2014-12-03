/**
 * 发送邮件
 * @deprecated nodemailer
 * @author hechangmin
 * @date 2014.1
 */

var util       = require('util'),
    nodemailer = require('nodemailer'),
    mailConf   = require('../configs.js').mail;

exports.send = function(options) {

    var transport = nodemailer.createTransport('SMTP', mailConf);
    var sendParam = {
        from                 : mailConf.auth.user,
        to                   : options.to,
        subject              : options.subject,
        generateTextFromHTML : true,
        html                 : options.html
    };

    //抄送列表
    if(options.cc){
        sendParam.cc = options.cc;
    }

    // 如果给多人同时发送，options.to 邮件地址以','相隔就OK
    // 单独给每一个人发送
    if(util.isArray(options.to)){
        for(var i = 0 , item; item = options.to[i++];){
            sendParam.to = item;
            transport.sendMail(sendParam, function(error, response) {
                if(options.callback){
                    options.callback(error, response);
                }

                if(i == (options.to.length - 1)){
                    transport.close();
                }
            });
        }
    }else{
        transport.sendMail(sendParam, function(error, response) {
            if(options.callback){
                options.callback(error, response);
            }
            transport.close();
        });
    }
};