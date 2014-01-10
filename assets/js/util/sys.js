/**
 * @brief   Expansion of native string
 * @author  hechangmin@gmail.com
 * @date	2012.9
 */

define({
	/**
	 * @brief 从当前url中获取参数
	 * @param {Object} name
	 */
	getParam : function(name) {
        if(name == 'url'){
            var r = unescape(decodeURI(window.location.href)).split(/[&?]url=/)[1];
            if(r) return unescape(r);
        }else{
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = (unescape(decodeURI(window.location.search))).substr(1).match(reg);
            if (r != null){
            	var sRet = unescape(r[2]);
            	if(name == 'trace'){
            		var traceArray = sRet.split('_');
            		for(var ti = traceArray.length; ti < 5; ti++){
            			traceArray[ti] = '0';
            		}
            		sRet = traceArray.join('_');
            	}
                return sRet;
            }
        }
		return '';
	},

	/**
	 * brief 更改页面URL参数并跳转
	 * @param {[type]} name  [description]
	 * @param {[type]} value [description]
	 */
	setParam : function(name, value){
		var queryString = document.location.search;
		if(arguments.length < 2){
			var params = arguments[0];
			for(var i in params){
				var patt = new RegExp('([?&])' + i + '=[^&=]+', 'ig');
				queryString = queryString.replace(patt, '');
				if(params[i] !== null){
					queryString += '&' + i + '=' + params[i];
				}
			}
		}else{
			var patt = new RegExp('([?&])' + name + '=[^&=]+', 'ig');
			queryString = queryString.replace(patt, '');
			if(value !== null){
				queryString += '&' + name + '=' + value;
			}
		}
		document.location = '?' + queryString.slice(1);
	},

	/**
	 * @brief 预加载图片
	 * @param {Object} arrImgSrc 图片src 数组
	 */
	preloader : function(arrImgSrc) {
		for (var i = 0, nLen = arrImgSrc.length; i < nLen; i++) {
			var preImg = new Image();
			preImg.src = arrImgSrc[i];
		}
	},

	/**
	 * @brief 判断系统位数
	 */
	getCPU : function() {
		var agent = navigator.userAgent.toLowerCase();
		if (agent.indexOf("win64") >= 0 || agent.indexOf("wow64") >= 0)
			return "64";
		return "32"
	},

	/**
	 * @brief 判断操作系统类型
	 */
	detectOS : function() {
		var sUserAgent = navigator.userAgent;
		var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
		if (isWin2K)
			return "WinXP";
		var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
		if (isWinXP)
			return "WinXP";
		var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
		if (isWin2003)
			return "WinS2003";
		var isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
		if (isWinVista)
			return "Vista";
		var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
		if (isWin7)
			return "Win7";
		var isWin8 = sUserAgent.indexOf("Windows NT 6.2") > -1 || sUserAgent.indexOf("Windows 8") > -1;
		if (isWin8)
			return "Win8";
		if (sUserAgent.indexOf("Mac OS X") != -1)
			return "Mac OS X";

		return "WinS2008"
	},

	/**
	 * @brief 判断浏览器类型
	 */
	getBrowser : function() {
		var Sys = {};
		var ua = navigator.userAgent.toLowerCase();
		if (window.ActiveXObject){
			Sys.ie = ua.match(/msie ([\d.]+)/)[1];
		}else if (ua.indexOf('firefox') > 0){
			Sys.firefox = ua.match(/firefox\/([\d.]+)/)[1];
		}else if (window.MessageEvent && !document.getBoxObjectFor){
			Sys.chrome = ua.match(/chrome\/([\d.]+)/)[1];
		}else if (window.opera){
			Sys.opera = ua.match(/opera.([\d.]+)/)[1];
		}else if (window.openDatabase){
			Sys.safari = ua.match(/version\/([\d.]+)/)[1];
		}
		getBrowser = function(){
			return Sys;
		}
		return Sys;
	}
});