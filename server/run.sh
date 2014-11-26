#! /bin/sh
# chkconfig: - 85 15
# description: auto start nodejs server

# :set ff=unix 存盘退出，再运行.
DAEMON="node daemon.js"
PIDFILE="myapp.pid"

cd '/data/myapp/'

case "$1" in
    start)
        echo "start node daemon.js"
        nohup $DAEMON > /data/log/myapp.log 2>&1 &
        echo $! > $PIDFILE
        ;;
    stop)
        echo "stop node daemon.js"
        pid=`cat $PIDFILE`
        spid=`ps -ef | grep node | awk '$3=='$pid' {print $2}'`
        #echo 'pid:'$pid
        #echo 'spid:'$spid
        kill -9 $pid
        kill -9 $spid
        rm $PIDFILE
        ;;
    restart)
        $0   stop
        $0   start
        ;;
    esac
    exit 0