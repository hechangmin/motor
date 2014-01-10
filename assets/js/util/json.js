/**
 * @brief   Javascript json operation
 * @author  hechangmin@gmail.com
 * @date    2010.5
 */

define({
    /**
     * @brief   将json字符串转换为对象
     * @param   json字符串
     * @return  返回object,array,string等对象
     */
    evalJSON : function (strJson){
        try {
            return eval("(" + strJson + ")");
        }catch(error){
            return null;
        }
    },

    /**
     * @brief   将javascript数据类型转换为json字符串
     * @param   待转换对象,支持object,array,string,function,number,boolean,regexp
     * @return  返回json字符串
     */
    toJSON : function (object){
        var type = typeof object;
        if ('object' == type)
        {
            if (Array == object.constructor)
                type = 'array';
            else if (RegExp == object.constructor)
                type = 'regexp';
            else
                type = 'object';
        }
        switch (type){
            case 'undefined':
            case 'unknown':
                return;
            case 'function':
            case 'boolean':
            case 'regexp':
                return object.toString();
            case 'number':
                return isFinite(object) ? object.toString() : 'null';
            case 'string':
                return '"' + object.replace(/(\\|\")/g,"\\$1").replace(/\n|\r|\t/g,
                    function(){
                        var a = arguments[0];
                        return  (a == '\n') ? '\\n':
                        (a == '\r') ? '\\r':
                        (a == '\t') ? '\\t': ""
                    }) + '"';
            case 'object':
                if (object === null) return 'null';
                var results = [];
                for (var property in object) {
                    var value = arguments.callee(object[property]);
                    if (value !== undefined)
                        results.push(arguments.callee(property) + ':' + value);
                }
                return '{' + results.join(',') + '}';
            case 'array':
                var results = [];
                for(var i = 0; i < object.length; i++)
                {
                    var value = arguments.callee(object[i]);
                    if (value !== undefined) results.push(value);
                }
                return '[' + results.join(',') + ']';
        }
    }
});
