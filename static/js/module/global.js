/**
 * 公用函数模块
 *
 * @author Lanfei
 * @date 2014-3-26
 */

var Global = (function(){

	var _uuid;

	var init = function(){
		initPage();
		initEvent();
	};

	var initPage = function(){
	};

	var initEvent = function(){
		$(window).bind({
			load: loadLazyImg,
			scroll: loadLazyImg,
			resize: loadLazyImg
		});
		$('#header .favorite').bind({
			click: function(){
				addFavorite('http://' + document.location.host);
			}
		});
		$('#header .types').bind({
			mouseenter: function(){
				$(this).children('.list').stop(true).hide().slideDown('fast');
			},
			mouseleave: function(){
				$(this).children('.list').stop(true).slideUp('fast');
			}
		});
		$('#header .hot .title').bind({
			click: function(){
				$('#header .hot .list').toggleClass('hide');
			}
		});
		$('#header .types .item').bind({
			mouseenter: function(){
				$(this).addClass('item-hover');
			},
			mouseleave: function(){
				$(this).removeClass('item-hover');
			},
			click: function(){
				$('#header .types .list').stop(true).hide();
				$('#header .types .item').removeClass('hide');
				$('#header .types .text').text($.trim($(this).text()));
				$('#header .type').val($(this).addClass('hide').data('value'));
			}
		});
		$('.switch').bind({
			click: function(){
				var index = $(this).toggleClass('switch-iphone').hasClass('switch-iphone') ? 1 : 0;
				$(this).parents('.col').eq(0).find('.lists').addClass('hide').eq(index).removeClass('hide');
				loadLazyImg();
			}
		});
		$('.col .tabs').each(function(){
			var timer;
			var $that = $(this).parents('.col').eq(0);
			$(this).delegate('.item', {
				mouseenter: function(){
					var index = $(this).index();
					clearTimeout(timer);
					timer = setTimeout(function(){
						$that.find('.tabs .item').removeClass('item-cur').eq(index).addClass('item-cur');
						$that.find('.lists').each(function(){
							$(this).children('ul').hide().eq(index).show();
						});
						Global.loadLazyImg();
					}, 200);
				},
				mouseleave: function(){
					clearTimeout(timer);
				}
			});
		});
		$('body').delegate('.btn', {
			mouseenter: function(){
				$(this).removeClass('btn-active');
			},
			mousedown: function(e){
				if(e.which == 1){
					$(this).addClass('btn-active');
				}
			},
			mouseup: function(e){
				if(e.which == 1){
					$(this).removeClass('btn-active');
				}
			}
		});
	};

	var getUUID = function(){
		if(! _uuid){
			_uuid = Util.Cookie.get('uuid') || Util.UUID.getUUID();
			Util.Cookie.set('uuid', _uuid, 0, '/');
		}
		return _uuid;
	};

	var addFavorite = function(url, title){
		url = url || document.location.href
		title = title || document.title;
		try{
			window.external.addFavorite(url, title);
			return true;
		}catch(e){}
		try {
			window.sidebar.addPanel(title, url, '');
			return true;
		}catch(e){}
		try {
			external.AddToFavoritesBar(url, title, '');
			return true;
		}catch(e){}
		return false;
	};

	var loadLazyImg = function(){
		clearTimeout(loadLazyImg.timer);
		loadLazyImg.timer = setTimeout(function(){
			var rangeTop = $(window).scrollTop();
			var rangeHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
			var rangeBottom = rangeTop + rangeHeight + 200;
			$('.lazy:visible').each(function(){
				var imageTop = $(this).offset().top;
				var imageBottom = imageTop + $(this).height();
				if(imageBottom >= rangeTop && imageTop <= rangeBottom){
					$(this).removeClass('lazy').attr('src', $(this).data('src')).css({
						opacity: 0
					}).animate({
						opacity: 1
					});
				}
			});
		}, 200);
	};

	return {
		init: init,
		getUUID: getUUID,
		addFavorite: addFavorite,
		loadLazyImg: loadLazyImg
	};
})();