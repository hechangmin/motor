/**
 * 首页
 * @author Lanfei
 * @date 2014.4.3
 */

exports.init = function(req, res){
	
	var common = require('../node_action/common.js');
	var TplHelper = require('../node_common/tplHelper.js');

	var data = {js_files: ['page/index.js'], css_files: ['index.css']};

	function init(){

		data = common.initData(data);

		// for(var i = 0, l = list.length; i < l; ++i){
		// 	resolve(list[i]);
		// }
		// 
		TplHelper.echo(req, res, 'index.tpl', data);
	}

	if(!TplHelper.hasExpire(req, res)){
		TplHelper.readCache(req, res, init);
    }
}