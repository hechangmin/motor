/**
 * 模块自动关联
 * @author hechangmin
 * @date 2014.3
 */

module.exports = (function(){

	var util	  = require('util'),
		http	  = require('http'),
		configs   = require('../configs.js');

	function initData(paramObj){

		var data = {
			cssPath : configs.cssPath,
	        jsPath  : configs.jsPath,
	        imgPath : configs.imgPath
		};

		for(var i in data){
			if('undefined' == typeof paramObj[i]
				&& 'undefined' != typeof data[i]){
				paramObj[i] = data[i];
			}
		}

		return paramObj;
	}

	function getData(url, options){
		if(typeof options == 'function'){
			options = {
				success: options
			};
		}else{
			options = options || {};
		}
		http.get(url, function(res){
			var size = 0;
			var chunks = [];
			res.on('data', function(chunk){
				size += chunk.length;
				chunks.push(chunk);
			});
			res.on('end', function(){
				try{
					var data = JSON.parse(Buffer.concat(chunks, size).toString());
					options.success && options.success(data);
					options.always && options.always();
				}catch(err){
					options.error && options.error(err);
					options.always && options.always();
				}
			});
		}).on('error', function(err){
			console.error('http.get ', url, err);
			options.error && options.error(err);
			options.always && options.always();
		});
	}

	return {
		initData   : initData,
		getData	   : getData
	}
})();