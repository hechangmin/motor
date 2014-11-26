/**
 * 首页
 *
 * @author Lanfei
 * @date 2014-04-01
 */

$(function() {
	Detail.main();
});

var Detail = (function(){

	var _appData = {
		action: 2,
		catalog: 1,
		downloadurl: "http://softdl.ijinshan.com/marketmgr/package/20140126/weixin520android380_87_222949.apk",
		freesize: 0,
		id: 10720,
		images: "http://app.sjk.ijinshan.com/market/img/app/20140128/20140128115044610.jpg,http://app.sjk.ijinshan.com/market/img/app/20140128/20140128115052283.jpg,http://app.sjk.ijinshan.com/market/img/app/20140128/20140128115052816.jpg,http://app.sjk.ijinshan.com/market/img/app/20140128/20140128115053300.jpg,http://app.sjk.ijinshan.com/market/img/app/20140128/20140128115053457.jpg,http://app.sjk.ijinshan.com/market/img/app/20140128/20140128115053697.jpg,",
		logothurls: "http://app.sjk.ijinshan.com/market/img/10720/20130918225112756.png",
		marketappid: 1358612,
		marketname: "shoujikong_channel",
		name: "微信",
		officialsigsha1: "0999d027fb010eec651929bcaf37da0ed5d6304f",
		pathstatus: 0,
		permissions: ",7,3,4,28,52,58,63,84,88,73,79,113,114,118,117,122,19,20,24,109,34,50,60,11,80,124,111,9,78,",
		pkname: "com.tencent.mm",
		signaturesha1: "0999d027fb010eec651929bcaf37da0ed5d6304f",
		size: 26348268,
		subcatalog: 4,
		trace: "0_0_0_0_0|xq_微信_1_1_btn,微信",
		version: 5.2,
		versioncode: 380
	};

	var main = function(){
		initPage();
		initEvent();
	};

	var initPage = function(){
		Global.init();
		Comment.init(_appData);
		_initImages();
	};

	var initEvent = function(){
		$('.detail .more').bind({
			click: function(e){
				if($(this).children('.text-show').is(':visible')){
					var height = $('.detail .intro').height('auto').height();
					$('.detail .intro').stop(true, false).height(72).animate({height: height});
				}else{
					$('.detail .intro').stop(true, false).animate({height: 72});
				}
				$(this).children('.icon').toggleClass('icon-slide-down').toggleClass('icon-slide-up');
				$(this).children('.text').toggle();
				e.preventDefault();
			}
		});
		// 图片滚动
		$('.images').bind({
			mouseenter: function(){
				$(this).find('.prev').stop(true, false).animate({left: 0}, 100);
				$(this).find('.next').stop(true, false).animate({right: 0}, 100);
			},
			mouseleave: function(){
				$(this).find('.prev').stop(true, false).animate({left: -50}, 100);
				$(this).find('.next').stop(true, false).animate({right: -50}, 100);
			}
		});
		$('.images .prev, .images .next').bind({
			mouseenter: function(){
				$(this).css({opacity: 1});
			},
			mouseleave: function(){
				$(this).css({opacity: 0.7});
			},
			click: function(e){
				var num = $('.images .item').length;
				var page = $('.images').data('page') || 0;
				var width = $('.images .item').outerWidth(true);
				var maxPage = num - ($('.images').is('.images-ver') ? 2 : 1);
				var minLeft = $('.images').width() - 2 * parseInt($('.images .image-list').css('marginLeft')) - width * num;
				if($(this).is('.prev')){
					-- page;
				}else{
					++ page;
				}
				if(page < 0 || page > maxPage){
					return;
				}
				left = - page * width;
				if(left > 0){
					left = 0;
				}else if(left < minLeft){
					left = minLeft;
				}
				$('.images').data('page', page);
				$('.images .prev').toggle(page > 0);
				$('.images .next').toggle(page < maxPage);
				$('.images .image-list').stop(true, false).animate({'left': left}, 'fast');
				e.preventDefault();
			}
		}).mouseleave();
	};

	var _initImages = function(){
		var url = $('.images .image').eq(0).prop('src');
		var isVer = null;
		if(url){
			window[url] = new Image();
			window[url].onerror = window[url].onabort = function(){
				window[url] = null;
			};
			window[url].onload = function(){
				isVer = this.width < this.height;
				$('.images').addClass('images-' + (isVer ? 'ver' : 'hor')).show();
				window[url] = null;
			};
			window[url].src = url;
		}
	};

	return {main: main};
})();