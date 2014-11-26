/**
 * 模板辅助模块
 * @author hechangmin
 * @date 2014.8
 */

module.exports = function(){

	var template = require('template4js'),
		common   = require('../node_common/common.js'),
		logger   = require('../node_common/log.js'),
		configs  = require('../configs.js'),
		fs 		 = require('fs');

	function setHeaders(res){
		var lastModified = (new Date()).toUTCString(),
			maxAge 		 = configs.tplExpires,
			contentType  = 'text/html;charset=' + configs.charset;

		res.setHeader("Content-Type", contentType);
		res.setHeader("Last-Modified", lastModified);
		common.handleExpires(res,maxAge);
	}

	function getCachePath(req){
		var base = configs.root + '/node_data/cache/';
		base  += req.url.replace(/[\/\.\?\&]/g, function(s1){
        	return '#';
        });
        return  base;
	}

	function readCache(req, res, callback) {
		
		if(configs.tplCacheExp){

			var path = getCachePath(req);
		
			fs.stat(path, function(err, stats) {
				if (err) {
					callback && callback();
					return;
				}

				var curDate = +new Date();
				var lastModified = +stats.mtime;

				if (configs.tplCacheExp > curDate - lastModified) {
					var stream = fs.createReadStream(path);
					stream.on("error", function(err) {
						callback && callback();
						return;
					});
					stream.pipe(res);
				} else {
					callback && callback();
				}
			});
		}else{
			callback && callback();
		}
	}

	function writeCache(req, html){
		if(configs.tplCacheExp){
			fs.writeFile(getCachePath(req), html, function (err) {
	 		    if (err){
	 		    	console.log(req.url, 'cache err: ', err);
	 		    }
	 		});
		}
	}

	function hasExpire(req, res){
		var bRet 		= false,
		   lastModified = req.headers['if-modified-since'];

		if(lastModified){
			var maxAge     = new Date(lastModified).getTime() + configs.tplExpires,
		   		curUTCTime = new Date(new Date().toUTCString()).getTime();

			bRet = maxAge > curUTCTime;

			if(bRet){
	            common.handle304(res);
	            logger.access(req.getIP(), 304, req.url);
	        }
		}

		return bRet;
	}

	function echo(req, res, tpl, data){
		var strErr = ' tpl is null.';

		if(tpl){
			try{
				var html = template('./node_template/' + tpl, data);
				if(html){
					setHeaders(res);
					res.end(html);
					writeCache(req, html);
					return;
				}
			}catch(e){
				strErr = e.toString();
			}
		}

		handleErr(req, res, strErr);
		return;
	}

	function handleErr(req, res, err){
		common.handle500(res, req.url);
		logger.error(req.getIP(), 500, req.url, err, req.reff);
	}

	function avoidXSS(strParam){
		var m = {
			'<': '&#60;',
			'>': '&#62;',
			'"': '&#34;',
			"'": '&#39;',
			'&': '&#38;'
		};
		return strParam.replace(/[&<>"']/g, function (s) {
			return m[s];
		});
	}

	return {
		echo	   : echo,
		readCache  : readCache,
		hasExpire  : hasExpire,
		avoidXSS   : avoidXSS,
		handleErr  : handleErr
	}
}();
