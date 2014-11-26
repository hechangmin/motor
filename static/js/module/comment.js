/**
 * 详情页评论模块
 *
 * @author Lanfei
 * @date 2014.2
 */

var Comment = (function(){

	var _rows = 10;

	var _pages = [0, 0];

	var _appData = null;

	var _uuid = Global.getUUID();

	var _api = 'http://cmt.sjk.ijinshan.com/cmt/api/';

	var init = function(appData){
		_filter(_appData = appData || $('#info .btn').data());
		_initPage();
		_initEvent();
	};

	var _initPage = function(){
		$.ajax({
			url: _api + 'read/getCommentInfo.json',
			data: {
				appId: _appData.id,
				catalog: _appData.catalog,
				subCatalog: _appData.subcatalog
			},
			dataType: 'jsonp',
			success: function(data){
				var count = data.cmtCount;
				if(count){
					_resolveScore(data.appLevelInfo);
					$('.stat-comment .num').text(data.cmtCount);
					$('.stat-comment').prev('.stat-split').andSelf().removeClass('hide');
				}else{
					$('.sofa').prev('.stat-split').andSelf().removeClass('hide');
				}
				if(data.tagList.length){
					_initTags(data.tagList);
				}
				if(data.hotCmtList.length){
					_showComments('hot', data.hotCmtList);
				}
				_loadComments(0);
				_loadComments(1);
				$('.comment-write .nickname').val(Util.Cookie.get('nickname') || data.nickName);
			}
		});
	};

	var _initEvent = function(){
		$('.stars-selectable').bind({
			mouseleave: function(){
				var grade = $(this).data('grade');
				$(this).children('.icon-star').addClass('icon-star-on').slice(parseInt(grade)).removeClass('icon-star-on');
				if(grade - parseInt(grade) > 0){
					$(this).children('.icon-star').eq(parseInt(grade)).addClass('icon-star-half');
				}
			}
		}).delegate('.icon-star', {
			mouseenter: function(){
				$(this).addClass('icon-star-on');
				$(this).prevAll('.icon-star').addClass('icon-star-on');
				$(this).nextAll('.icon-star').removeClass('icon-star-half').removeClass('icon-star-on');
			},
			click: function(){
				var grade = $(this).index() + 1;
				if(grade == $(this).parent('.stars-selectable').data('grade')){
					grade = 0;
				}
				$(this).parent('.stars-selectable').data('grade', grade);
			}
		});
		$('#info').delegate('.stars-selectable .icon-star, .levels-selectable .level', {
			click: function(){
				var grade, that = this;
				if($(this).is('.level')){
					grade = 5 - $(this).index();
				}else{
					grade = $(this).index() + 1
				}
				_vote({
					grade: grade,
					nickname: $('.nickname').val()
				}, function(json){
					var code = json.result.code;
					if(code == 0){
						var data = $('.stat-score').data();
						data['cmtCount'] += 1;
						data['allscore'] += grade;
						data['level' + grade] += 1;
						data['levelRecmdRate'] = (data.allscore / data.cmtCount).toFixed(1);
						_resolveScore(data);
						_twinkle($('#info .level' + grade), 2);
						$('#info .stars-selectable').data('grade', data['levelRecmdRate']).mouseleave();
					}else{
						$('.worth-tip').stop(true, false).hide().fadeIn(function(){
							setTimeout(function(){
								$('.worth-tip').fadeOut();
							}, 1000);
						});
					}
					$('#info .stars-selectable').removeClass('stars-selectable');
					$('#info .levels-selectable').removeClass('levels-selectable');
				});
			}
		});
		// 评论数
		$('#info .stat-comment').bind({
			click: function(e){
				_scrollTo('.comments:visible');
				e.preventDefault();
			}
		});
		// 评论框
		$('.comment-write').delegate('.cover', {
			click: function(){
				$(this).prev('.content').focus();
			}
		}).delegate('.content', {
			change: function(){
				$('.comment-write .content').not(this).val($(this).val());
			},
			focus: function(){
				var $parent = $(this).parents('.comment-write');
				$parent.find('.cover').stop(true, true).fadeOut(100);
				$parent.find('.footer').stop(true, true).animate({bottom: 0}, 200);
			},
			blur: function(){
				if(! $.trim($(this).val())){
					var $parent = $(this).parents('.comment-write');
					$parent.find('.cover').stop(true, true).fadeIn(100);
				}
			},
			keyup: function(){
				var $parent = $(this).parents('.comment-write');
				$parent.find('.item-tip').hide();
			}
		}).delegate('.nickname', {
			change: function(){
				$('.comment-write .nickname').not(this).val($(this).val());
			},
			keyup: function(){
				var $parent = $(this).parents('.comment-write');
				$parent.find('.item-tip').hide();
			}
		}).delegate('.change', {
			mousedown: function(){
				$(this).addClass('change-active');
			},
			mouseup: function(){
				$(this).removeClass('change-active');
			},
			mouseleave: function(){
				$(this).removeClass('change-active');
			},
			click: function(e){
				var $parent = $(this).parents('.comment-write');
				_changeName($parent.find('.nickname').val(), function(data){
					$('.comment-write .nickname').val(data.nickName);
				});
				e.preventDefault();
			}
		}).delegate('.icon-star', {
			click: function(e){
				if(! e.isTrigger){
					$('.comment-write .stars').not($(this).parent('.stars')).children('.icon-star').eq($(this).index()).click().mouseleave();
				}
			}
		}).delegate('.submit', {
			mousedown: function(){
				$(this).addClass('submit-active');
			},
			mouseup: function(){
				$(this).removeClass('submit-active');
			},
			mouseleave: function(){
				$(this).removeClass('submit-active');
			},
			click: function(e){
				var $parent = $(this).parents('.comment-write');
				var $content = $parent.find('.content');
				var $nickname = $parent.find('.nickname');
				var $tip = $parent.find('.item-tip');
				var content = $.trim($content.val());
				var nickname = $.trim($nickname.val());
				var grade = $parent.find('.stars').data('grade') || 0;
				if(! nickname){
					$nickname.focus();
					$tip.text('请输入评论昵称！').show();
					return false;
				}else if(! content){
					$content.focus();
					$tip.text('请输入评论内容！').show();
					return false;
				}else if(content.length > 180){
					$content.focus();
					$tip.text('评论内容应小于180字！').show();
					return false;
				}
				_submitComment({
					grade: grade,
					content: content,
					nickname: nickname
				}, function(json){
					var code = json.result.code;
					if(code == 2049){
						$content.focus();
						$tip.text('您刚已评论过了，休息一下吧！').show();
					}else if(code == 2050){
						$content.focus();
						$tip.text('不要发表重复评论哦！').show();
					}else{
						var $comment = $(_buildCommentItem(json.data, true));
						$tip.hide();
						$('.comments-area').removeClass('hide');
						$('.comment-write .content').val('').blur();
						$('.comments-area .list-time').prepend($comment.addClass('item-new'));
						$('.comments-area .tab-time').click();
						setTimeout(function(){
							_scrollTo('.comments-area');
						}, 230);
					}
				});
				e.preventDefault();
			}
		});
		// 评论列表
		$('.comments-area .tab').bind({
			click: function(){
				setTimeout(function(){
					if($('.comments-area .list:visible').index() != $(this).data('index')){
						$('.comments-area .list, .comments-area .more').toggleClass('hide');
						$('.comments-area .tab').toggleClass('tab-active');
					}
				});
			}
		});
		$('.comments-area .more').bind({
			mousedown: function(){
				$(this).addClass('more-active');
			},
			mouseup: function(){
				$(this).removeClass('more-active');
			},
			mouseleave: function(){
				$(this).removeClass('more-active');
			},
			click: function(e){
				_loadComments($(this).index());
				e.preventDefault();
			}
		});
		$('.comments').delegate('.item', {
			mouseenter: function(){
				$(this).addClass('item-active').find('.recommend-area').removeClass('hide');
			},
			mouseleave: function(){
				$(this).removeClass('item-active').find('.recommend-area').addClass('hide');
			}
		}).delegate('.recommend', {
			click: function(e){
				var $parent = $(this).parents('.item');
				var $recommends = $parent.find('.recommends');
				var id = $parent.data('id');
				var recommend = $parent.data('recommend') || false;
				var recommends = $parent.data('recommends') + (recommend ? -1: 1);
				$(this).children('.text').toggleClass('hide');
				$parent.data('recommend', ! recommend).data('recommends', recommends);
				$recommends.text(recommends);
				_recommend({id: id, recommend: ! recommend});
				_enlarge($recommends);
				_bubble(this, recommend ? '-1': '+1');
				e.preventDefault();
			}
		}).delegate('.text-yes', {
			mouseenter: function(){
				$(this).children('.icon-heart').addClass('icon-heart-on');
			},
			mouseleave: function(){
				$(this).children('.icon-heart').removeClass('icon-heart-on');
			}
		}).delegate('.footer .reply', {
			click: function(e){
				var $parent = $(this).parents('.item');
				$parent.find('.reply-area').stop(true).slideToggle(function(){
					if(! $parent.find('.item-reply').length){
						$(this).find('.content:visible').focus();
					}
				});
				e.preventDefault();
			}
		}).delegate('.submit', {
			mousedown: function(){
				$(this).addClass('submit-active');
			},
			mouseup: function(){
				$(this).removeClass('submit-active');
			},
			mouseleave: function(){
				$(this).removeClass('submit-active');
			},
			click: function(e){
				var $parent = $(this).parents('.item');
				var $tip = $parent.find('.reply-write .tip');
				var $content = $parent.find('.reply-write .content');
				var id = $parent.data('id');
				var content = $.trim($content.val());
				var nickname = $.trim($('.comment-write .nickname').val());
				if(! content){
					$content.focus();
					$tip.text('请输入回复内容！').removeClass('hide');
					return false;
				}else if(content.length > 180){
					$content.focus();
					$tip.text('回复内容应小于180字！').removeClass('hide');
					return false;
				}
				_submitReply({
					id: id,
					content: content,
					nickname: nickname
				}, function(json){
					var code = json.result.code;
					if(code == 2049){
						$content.focus();
						$tip.text('您刚已回复过了，休息一下吧！').removeClass('hide');
					}else if(code == 2050){
						$content.focus();
						$tip.text('不要发表重复回复哦！').removeClass('hide');
					}else{
						$tip.addClass('hide');
						$content.val('');
						$reply = $(_buildReplyItem(json.data, $parent.is('.comments-area .item')));
						$parent.find('.replies').prepend($reply.addClass('item-new').hide());
						$reply.slideDown(function(){
						});
						_scrollTo($parent);
					}
				});
				e.preventDefault();
			}
		});
	};

	var _scrollTo = function(selector, callback){
		$('body').scrollTop($(selector).offset().top);
		callback && callback();
	};

	// type：0 支持最多 1 最新评论
	var _loadComments = function(type){
		var list = ['good', 'time'][type];
		if(list){
			$('.comments .more-loading').removeClass('hide');
			var json = ['read/commentRemAppList.json', 'read/commentAppList.json'][type];
			$.ajax({
				url: _api + json,
				data: {
					rows: _rows,
					page: ++ _pages[type],
					appId: _appData.id
				},
				dataType: 'jsonp',
				success: function(json){
					_showComments(list, json.data, true);
					$('.comments .more-loading').addClass('hide');
				}
			});
		}
	};

	var _showComments = function(list, data, isPop){
		if(data.length < _rows){
			$('.comments .more-' + list).hide();
		}
		if(data.length){
			$('.comments .list-' + list).append(_buildComments(data, isPop)).parents('.comments').removeClass('hide');
		}
	};

	var _initTags = function(data){
		var html = '';
		for (var i = 0, j = 0; i < data.length; i++) {
			var tagName = data[i].tagName;
			html += '<span class="item item' + (i + 1) + '">' + tagName + '</span>';
		}
		$('.comment-tags').removeClass('hide').children('.tags').html(html);
	};

	var _resolveScore = function(data){
		var count = data.cmtCount || 0;
		var score = data.allscore || 0;
		var grade = data.levelRecmdRate || 0;
		$('.meta .icon-star:lt(' + Math.round(grade) + ')').addClass('icon-star-on');
		$('.meta .score').text(grade.toFixed(1));
		$('.meta .cmts').text(count + ' 条评论');
	};

	var _buildComments = function(data, isPop){
		var html = '';
		if(data && data.length){
			for(var i = 0, l = data.length; i < l; ++i){
				html += _buildCommentItem(data[i], isPop);
			}
		}
		return html;
	};

	var _buildCommentItem = function(item, isPop){
		var html = '<li class="item" data-id="' + (item.id || 0) + '" data-recommends="' + item.recommends + '"><table class="wraper" cellpadding="0" cellspacing="0"><tr>';
		if(isPop){
			html += '<td class="nickname">' + item.nickName + '<i class="triangle triangle-left triangle-back"></i><i class="triangle triangle-left"></i></td>';
		}
		html += '<td class="content">' + fixContent(item.content) + '</td></tr></table><div class="footer clearfix"><span class="pull-left">';
		if(! isPop){
			html += '<span class="ver-middle">' + item.nickName + '：</span>';
		}
		html += '<span class="stars">';
		for(var i = 0, l = item.likeStatus / 5; i < l; ++i){
			html += '<i class="icon icon-star icon-star-on"></i>';
		}
		html += '</span><span class="ver-middle">';
		html += (item.commentTime ? _parseDate(item.commentTime): new Date()).format('MM月dd日');
		html += '<span class="footer-split">|</span>';
		html += item.versionCode == _appData.versioncode ? '当前版本': '旧版';
		html += '<span class="footer-split">|</span>';
		html += '<span class="recommends">' + (item.recommends || 0) + '</span>' + ' 人赞</span></span>';
		if(item.replyMap){
			html += '<span class="pull-right"><span class="recommend-area hide">';
			html += '<a class="recommend" href="#"><span class="text text-yes"><i class="icon icon-heart"></i>赞</span><span class="text text-no hide"><i class="icon icon-heart-on"></i>取消</span></a><span class="footer-split">|</span></span>';
			html += '<a class="reply" href="#">' + (item.replyMap.length > 0 ? item.replyMap.length + ' 条': '') + '回复</a>';
			html += '</span></div>';
			html += '<div class="reply-area"><ul class="replies">' + _buildReplies(item.replyMap, isPop) + '</ul>';
			html += '<div class="reply-write"><textarea class="content" maxlength="180"></textarea><div class="clearfix"><span class="tip hide"></span><a href="#" class="submit">回复</a></div></div></div>';
		}
		html += '</li>';
		return html;
	};

	var _buildReplies = function(data, isPop){
		var html = '';
		if(data && data.length){
			for(var i = 0, l = data.length; i < l; ++i){
				html += _buildReplyItem(data[i], isPop);
			}
		}
		return html;
	};

	var _buildReplyItem = function(item, isPop){
		var html = '<li class="item-reply" data-id="' + (item.id || 0) + '"><table class="wraper" cellpadding="0" cellspacing="0"><tr>';
		if(isPop){
			html += '<td class="nickname">' + item.nickName + '<i class="triangle triangle-left triangle-back"></i><i class="triangle triangle-left"></i></td>';
		}
		html += '<td class="content">' + fixContent(item.content) + '</td></tr></table><div class="footer">';
		if(! isPop){
			html += item.nickName + '：';
		}
		html += (item.commentTime ? _parseDate(item.commentTime): new Date()).format('MM月dd日') + '</div></li>';
		return html;
	};

	var fixContent = function(content){
		return content.replace(/([~!@#$%^*_\-+\f\r\t\v\/\\\.\*\+\?\|\(\)\[\]\{\}？！·：‘’“”；〉〈、，。])/g, '<span class="punctuation">$1</span>').replace('\n', '<br />');
	};

	var _getFeedbackTitle = function(content){
		var titles = [{
			keywords : ['不能用', '不可以用', '用不上', '用不了', '没法用', '不能使用', '无法使用', '玩不了', '不能玩', '打不开', '进不去', '登陆不上', '怎么才可以玩', '怎么才可以使用', '安不上', '看不见', '发不出去', '玩不到', '玩不起', '玩不成', '没声音', '没音乐'],
			title : '无法正常使用？让我们帮你查明原因！'
		},{
			keywords : ['装不上', '安装不了', '无法安装', '不能安装', '安装失败'],
			title : '安装失败？让我们帮你解决问题！'
		},{
			keywords : ['意外停止', '意外终止', '无响应', '强行关闭', '没反应', '闪退', '自动退出', '程序崩溃'],
			title : '程序崩溃？让我们帮你查明原因！'
		},{
			keywords : ['为什么', '错误', '太卡了', '卡'],
			title : '吐槽完，让我们帮你解决问题！'
		},{
			keywords : ['删不了', '无法删除', '无法卸载', '卸不了'],
			title : '无法卸载？让我们帮你解决问题！'
		},{
			keywords : ['下载不了', '无法下载', '下载失败', '下不下来'],
			title : '下载失败？让我们帮你查明原因！'
		}];
		_getFeedbackTitle = function(content){
			if(content.length){
				for(var i = 0; i < titles.length; ++i){
					var keywords = titles[i].keywords;
					for(var j = 0; j < keywords.length; ++j){
						if(content.indexOf(keywords[j]) >= 0){
							return titles[i].title;
						}
					}
				}
			}
			return null;
		};
		return _getFeedbackTitle(content);
	};

	var _twinkle = function(selector, times){
		times = times || 1;
		$(selector).stop(true, true).animate({opacity: 0}, 200, function(){
			$(this).stop(true, true).animate({opacity: 1}, 200, function(){
				if(times > 1){
					_twinkle(selector, times - 1);
				}
			});
		});
	};

	var _enlarge = function(selector){
		var $animation = $('<div class="animation">' + $(selector).html() + '</div>');
		$(selector).css('position', 'relative').append($animation);
		$animation.css({
			top: '50%',
			left: '50%'
		}).animate({
			opacity: 0,
			fontSize: parseInt($(selector).css('fontSize')) + 20
		}, {
			progress: function(){
				$(this).css({
					marginTop: - $(this).height() / 2,
					marginLeft: - $(this).width() / 2
				});
			},
			complete: function(){
				$(this).remove();
			}
		});
	};

	var _bubble = function(selector, html){
		var $animation = $('<div class="animation">' + html + '</div>');
		$(selector).find('.animation').remove();
		$(selector).css('position', 'relative').append($animation);
		$animation.css({
			top: '50%',
			left: '50%',
			marginTop: - $animation.height(),
			marginLeft: - $animation.width() / 2,
			fontSize: parseInt($(selector).css('fontSize')) + 5
		}).animate({
			opacity: 0,
			marginTop: - $animation.height() * 2
		}, {
			complete: function(){
				$(this).remove();
			}
		});
	};

	var _vote = function(vote, callback){
		$.ajax({
			url: _api + 'write/publishCommentVote.json',
			data: {
				appId: _appData.id,
				appName: _appData.name,
				uuid: _uuid,
				nickName: vote.nickname,
				voteType: vote.grade * 5,
				versionName: _appData.version,
				versionCode: _appData.versioncode,
				marketAppId: _appData.marketappid || 1
			},
			dataType: 'jsonp',
			success: callback
		});
	};

	var _changeName = function(current, callback){
		$.ajax({
			url: _api + 'read/getNickName.json',
			data: {
				appId: _appData.id,
				uuid: _uuid,
				currNickName: current
			},
			dataType: 'jsonp',
			success: callback
		});
	};

	var _recommend = function(data, callback){
		$.ajax({
			url: _api + 'write/recommend.json',
			data: {
				cmtId: data.id,
				appId: _appData.id,
				recommend: data.recommend,
				uuid: _uuid
			},
			dataType: 'jsonp',
			success: callback
		});
	};

	var _submitComment = function(comment, callback){
		var data = {
			uuid: _uuid,
			appId: _appData.id,
			appName: _appData.name,
			content: comment.content,
			likeStatus: comment.grade * 5,
			versionName: _appData.version,
			versionCode: _appData.versioncode,
			nickName: comment.nickname || '佚名',
			marketAppId: _appData.marketappid || 1
		};
		Util.Cookie.set('nickname', data.nickName, '/', 0);
		$.ajax({
			url: _api + 'write/publish.json',
			data: data,
			dataType: 'jsonp',
			success: function(json){
				json.data = data;
				callback(json);
			}
		});
	};

	var _submitReply = function(reply, callback){
		var data = {
			uuid: _uuid,
			appId: _appData.id,
			parentId: reply.id,
			content: reply.content,
			appName: _appData.name,
			versionName: _appData.version,
			versionCode: _appData.versioncode,
			nickName: reply.nickname || '佚名',
			marketAppId: _appData.marketappid || 1
		}
		Util.Cookie.set('nickname', data.nickName, '/', 0);
		$.ajax({
			url: _api + 'write/replyPublish.json',
			data: data,
			dataType: 'jsonp',
			success: function(json){
				json.data = data;
				callback(json);
			}
		});
	};

	var _submitFeedback = function(feedback, callback){
		$.ajax({
			url: _api + 'write/replyPublishAppFeedBack.json',
			data: {
				uuid : _uuid,
				userId : _uuid,
				appId : _appData.id,
				imei : External.getIMEI() || top.Global.uuid + 'IMEI',
				sjkVersion : External.getMainVer(),
				sjkVersionCode : 3,
				version : _appData.version,
				versionCode : _appData.versioncode,
				pkName : _appData.pkname,
				marketAppId : _appData.marketappid,
				appName : _appData.name,
				contact : feedback.contact,
				content : feedback.content
			},
			dataType: 'jsonp',
			success: callback
		});
	};

	var _parseDate = function(dateStr){
		return new Date(dateStr.replace(/^(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)$/, '$1/$2/$3 $4:$5:$6'));
	};

	var _filter = function(data){
		data.subcatalog = data.subcatalog  || data.subCatalog;
		data.versioncode = data.versioncode || data.versionCode;
		data.marketappid = data.marketappid || data.marketAppId;
	};

	return {init: init};
})();