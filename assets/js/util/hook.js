/**
 * 钩子模块
 *
 * @author Lanfei
 * @date 2013.10.28
 * <code>
 * function handler(num1, num2){
 *     Hook.doActions();
 *     var value = num1 + num2;
 *     return Hook.applyFilters(value);
 * }
 * console.log('before hook:');
 * console.log(handler(1, 2));
 * function action(num1, num2){
 *     console.log('the numbers are ' + num1 + ' and ' + num2 + '.');
 * }
 * function filter(value){
 *     return 'the result is ' + value + '.';
 * }
 * Hook.addAction(handler, action);
 * Hook.addFilter(handler, filter);
 * console.log('after hook: ');
 * console.log(handler(1, 2));
 * </code>
 */

define(function(){

	var addAction = function(method, action, priority){
		_initHook(method);
		var actions = method['__hooks__'].actions;
		actions.push({
			action : action,
			priority : priority || 10
		});
		actions.sort(_compare);
	}

	var doActions = function(){
		var method = arguments.callee.caller;
		_initHook(method);
		var actions = method['__hooks__'].actions;
		if(arguments.length == 0){
			arguments = method.arguments;
		}
		for(var i in actions){
			if(actions[i].action.apply(method, arguments) === false){
				return false;
			}
		}
	}

	var hasAction = function(method, action){
		_initHook(method);
		var actions = method['__hooks__'].actions;
		if(actions.length > 0 && action !== undefined){
			for(var i in actions){
				if(actions[i].action == action){
					return true;
				}
			}
			return false;
		}else{
			return actions.length > 0;
		}
	}

	var removeAction = function(method, action){
		_initHook(method);
		var actions = method['__hooks__'].actions;
		if(actions.length > 0){
			if(action !== undefined){
				for(var i in actions){
					if(actions[i].action == action){
						delete actions[i];
						return;
					}
				}
			}else{
				method['__hooks__'].actions = [];
			}
		}
	}

	var addFilter = function(method, filter, priority){
		_initHook(method);
		var filters = method['__hooks__'].filters;
		filters.push({
			filter : filter,
			priority : priority || 10
		});
		filters.sort(_compare);
	}

	var applyFilters = function(value){
		var method = arguments.callee.caller;
		_initHook(method);
		var filters = method['__hooks__'].filters;
		for(var i in filters){
			value = filters[i].filter.call(method, value);
		}
		return value;
	}

	var hasFilter = function(method, filter){
		_initHook(method);
		var filters = method['__hooks__'].filters;
		if(filters.length > 0 && filter !== undefined){
			for(var i in filters){
				if(filters[i].filter == filter){
					return true;
				}
			}
			return false;
		}else{
			return filters.length > 0;
		}
	}

	var removeFilter = function(method, filter){
		_initHook(method);
		var filters = method['__hooks__'].filters;
		if(filters.length > 0){
			if(filter !== undefined){
				for(var i in filters){
					if(filters[i].filter == filter){
						delete filters[i];
						return;
					}
				}
			}else{
				method['__hooks__'].filters = [];
			}
		}
	}

	var _compare = function(hook1, hook2){
		return hook1.priority < hook2.priority;
	}

	var _initHook = function(method){
		if(! method['__hooks__']){
			method['__hooks__'] = {
				actions : [],
				filters : []
			};
		}
	}

	return {
		addAction : addAction,
		doActions : doActions,
		hasAction : hasAction,
		removeAction : removeAction,
		addFilter : addFilter,
		applyFilters : applyFilters,
		hasFilter : hasFilter,
		removeFilter : removeFilter
	};
});