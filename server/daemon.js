/**
 * 为web服务启用守护进程
 * @author  hechangmin@gmail.com
 * @date 2013.4.5
 */

(function(){
    var fs             = require('fs'),
        fork           = require('child_process').fork,
        configs        = require('./configs.js'),
        mail           = require('./node_common/mail.js'),
        nForkTimes     = 0,
        nMaxForkTimes  = 30,     // 最多自动重启次数
        startTimer     = -1,     // 是否有重启检查任务
        nMailCycle     = 180000, // 3分钟只能发送一次邮件
        nSentMailTimes = 0,      // 当前已经发送的次数
        nMaxMailTimes  = 10,     // 发送10次以后不再重复发送
        lastMailTime   = 0,      // 上一次邮件发送时间
        lastStartTime  = 0,      // 上一次启动时间
        lastModified   = 0,      // 文件监控，上一次修改时间
        ignoreModCycle = 4,      // 少于4毫秒间隔，忽略此次修改
        restartCycle   = 60000,  // 1分 文件没有改动，再重启（主要应对线上环境，FTP上传文件）
        child          = {};

    function init(){
        startFork();
        startWatch();
    }

    function bindEvent(){

        process.removeAllListeners('SIGINT').on('SIGINT', function() {
            console.log('守护进程退出:SIGINT');
            process.exit(0);
        });

        child.removeAllListeners('exit').on('exit', function (code, signal) {
            console.log('[master] died.');
            startFork();
        });

        child.removeAllListeners('message').on('message', function(m) {

            var curTime = new Date().getTime();

            if('rpt' === m['action']
                && !configs.debug
                && curTime - lastMailTime > nMailCycle
                && nSentMailTimes < nMaxMailTimes){

                configs.rptParams['html'] = m['msg'];
                mail.send(configs.rptParams);
                lastMailTime =  curTime;
                nSentMailTimes++;
            }
        });
    }

    function startWatch(){
        var nIndex = 0,
            itemPath;
        while(itemPath = configs.watchList[nIndex++]){
            fs.watch(itemPath, fnCallbackWatch);
        }
    }

    function fnCallbackWatch(event, filename){
        var msgParam = { action : 'changed', msg : filename},
            now = new Date().getTime();

        try{
            //大约1毫秒间，同一次修改触发了两次事件。
            if(now - lastStartTime > ignoreModCycle){

                lastStartTime = now;

                if(configs.debug){
                    //process.kill(child.pid); // 有坑
                    child.send(msgParam);
                }else if(startTimer < 0){

                    startTimer = setTimeout(function(){

                        var curTime = new Date().getTime();

                        if(curTime - lastModified >= restartCycle){
                            startTimer = -1;
                            child.send(msgParam);
                            //process.kill(child.pid);
                        }else{
                            startTimer = setTimeout(arguments.callee , restartCycle);
                        }

                    }, restartCycle);
                }
            }
        }catch(err){
            startFork();
        }
    }

    function startFork(){
        // 避免一直重启，服务器宕机
        try{
            if(nForkTimes > nMaxForkTimes && !configs.debug){
                throw {};
            }
            process.nextTick(function(){
                nForkTimes++;
                lastStartTime = new Date().getTime();
                child = fork('./app.js');
                bindEvent();
            });
        }catch(e){
            configs.rptParams['html'] = 'server stop.';
            mail.send(configs.rptParams);
        }
    }

    if(!module.parent){
        console.log('daemon start.');
        init();
    }
})();