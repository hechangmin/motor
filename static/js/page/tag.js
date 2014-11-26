/**
 * 首页
 *
 * @author Lanfei
 * @date 2014-03-31
 */

$(function() {
	Tag.main();
});

var Tag = (function(){

	var main = function(){
		initPage();
		initEvent();
	};

	var initPage = function(){
		Global.init();
	};

	var initEvent = function(){
	};

	return {main: main};
})();