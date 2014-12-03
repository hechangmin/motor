#motor是什么

**这是用nodejs写的一个web服务器框架
谈不上什么模式，不过其流程清晰、配置简单、操控性强。**

###motor与express比较

* 犹如他们的名字一样：
   * express 功能比较完善，封装比较复杂。
   * motor 很简单，操控性强，麻雀虽小五脏俱全。喜欢他的人会很喜欢。


###更新日志:

* 2014.1.10 首次入库
   * 静态服务器部分基本完成,支持缓存、gzip压缩等常规功能;
   * cookie 操作部分已完成;
   * 模板引擎 已完成，直接沿用了 [template4js](https://github.com/hechangmin/template4js);
   * 基本配置文件、及流程基本成型。
* 2014.1.13
   * 增加日志功能，引入了log4js；
   * 专门对favicon.ico 请求做了处理;
* 2014.1.13
   * 增加发邮件功能模块，引入nodemailer;
* 2014.11.26
   * 重构代码，使用上推崇nginx + nodejs;
   * 模板使用上，进行了优化和封装;
   * 上传引入formidable模块，并进行简单封装，方便使用；
   * 路由优化;
   * 配置优化;
   * 增加守护进程 daemon.js(监控与报警);
   * 增加cluster 模块，启用多核多进程;
   * 增加服务器上用的run.sh

----------------------------

>仅供学习参考，如果使用在生产环境，造成的异常概不负责。

*[QQ 51411970](tencent://Message/?Uin=51411970)*
*[hechangmin@gmail.com](mailto://hechangmin@gmail.com)*
