/**
 * 首页
 *
 * @author Lanfei
 * @date 2014-03-26
 */

$(function() {
	Index.main();
});

var Index = (function(){

	var main = function(){
		initPage();
		initEvent();
	};

	var initPage = function(){
		Global.init();
		Slider.init();
	};

	var initEvent = function(){
	};

	var Slider = (function(){

		var index = 0;
		var delay = 3000;
		var timer = null;
		var length = $('.banner .item').length;

		var init = function(){
			play(false);
			initEvent();
		};

		var initEvent = function(){
			$('.banner').delegate('.icon-switch', {
				mouseenter: function(){
					if(index - $(this).index() != 1){
						stop();
						index = $(this).index();
						play();
					}
				}
			});
			$('.banner-list').bind({
				mouseenter: stop,
				mouseleave: function(){
					timer = setTimeout(play, delay);
				}
			});
		};

		var play = function(animate){
			if(animate === false){
				$('.banner .item').stop(true, true).hide().eq(index).show();
			}else{
				$('.banner .item').stop(true, true).fadeOut().eq(index).fadeIn();
			}
			$('.banner .icon-switch').removeClass('icon-switch-on').eq(index).addClass('icon-switch-on');
			index = (index + 1) % length;
			timer = setTimeout(play, delay);
		};

		var stop = function(){
			clearTimeout(timer);
		};

		return {init: init};
	})();

	return {main: main};
})();