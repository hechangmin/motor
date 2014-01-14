#motor是什么

**这是用nodejs写的一个web服务器框架
谈不上什么模式，不过其流程清晰、配置简单、操控性强。**

###motor与express比较

* 犹如他们的名字一样：
   * express 功能比较完善，封装比较复杂。
   * motor 很简单，操控性强，麻雀虽小五脏俱全。喜欢他的人会很喜欢。

**不过，我还是要说萝卜青菜各有所爱。**


###更新日志:

* 2014.1.10 首次入库
   * 静态服务器部分基本完成,支持缓存、gzip压缩等常规功能;
   * cookie 操作部分已完成;
   * 模板引擎 已完成，直接沿用了 [jstpl](https://github.com/hechangmin/jstpl);
   * 基本配置文件、及流程基本成型。
* 2014.1.13
   * 增加日志功能，引入了log4js；
   * 专门对favicon.ico 请求做了处理;
* 2014.1.13
   * 增加发邮件功能模块，引入nodemailer;

未完待续：
   * get\post\access.log\error.log\rewrite 等等

----------------------------

>不要投入生产环境使用，因为未经严格测试，功能也还有欠缺。

*[hechangmin@gmail.com](mailto://hechangmin@gmail.com)*
