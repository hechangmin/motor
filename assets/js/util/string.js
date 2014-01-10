
/**
 * @brief   Expansion of native string
 * @author  hechangmin@gmail.com
 * @date	2010.5
 */


define({
	/**
	 * @brief 去除字符串前后空格
	 */
	trim : function(strParam) {
		return strParam.replace(/(^\s*)|(\s*$)/g, "");
	},
	/**
	 * @brief 去除左边空格
	 */
	ltrim : function(strParam) {
		return strParam.replace(/(^\s*)/g, "");
	},
	/**
	 * @brief 去除右边空格
	 */
	rtrim : function(strParam) {
		return strParam.replace(/(\s*$)/g, "");
	},
	/**
	 * @brief 避免XSS 攻击
	 */
	avoidXSS : function(strParam) {
		var m = {
            "<": "&#60;",
            ">": "&#62;",
            '"': "&#34;",
            "'": "&#39;",
            "&": "&#38;"
        };
        return strParam.replace(/[&<>"']/g, function (s) {
            return m[s];
        });
	},
	/**
	 * @brief 获取字符串的字节长度 汉字默认双字节
	 */
	byteLength : function(strParam) {
		return strParam.replace(/[^\x00-\xff]/g, "**").length;
	},
	/**
	 * @brief 根据字符长来截取字符串
	 * @param 字符最大个数（汉字算双字）
	 */
	subStringByBytes : function(strParam, maxBytesLen) {
		var len = maxBytesLen;
		var result = strParam.slice(0, len);

		while (byteLength(result) > maxBytesLen) {
			result = result.slice(0, --len);
		}

		return result;
	},

	/**
	 * @brief 	除去HTML标签
	 * @example	<div id="test1">aaaa</div>  =>  aaaa
	 */
	removeHTML : function(strParam) {
		return strParam.replace(/<\/?[^>]+>/gi, '');
	},
	/**
	 * @brief 模板
	 * @mark data[$1] 最好能做下XSS 处理
	 */
	sub : function(str, data) {
		return str.replace(/{(.*?)}/igm, function($, $1) {
			return data[$1] ? data[$1] : $;
		});
	},

	/**
	 * @brief  	格式化字符串
	 * @example "<div>{0}</div>{1}".format(txt0,txt1)
	 */
	format : function(strParam) {
		var args = [];

		for (var i = 1, il = arguments.length; i < il; i++) {
			args.push(arguments[i]);
		}

		return strParam.replace(/\{(\d+)\}/g, function(m, i) {
			return args[i];
		});
	},

	/**
	 * @brief 字符串转数字
	 */
	toInt : function(strParam) {
		return Math.floor(strParam);
	}
});