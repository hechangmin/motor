/**
 * 页面脚本范例
 * @author hechangmin@gmail.com
 * @date 2013-12-4
 */

$(function(){
    App.main();
});

var App = {
    config : {},
    queue : [{id : 'test', name : 'test', url : 'data/test.json'}],

    main : function(){
        App.initPage();
        App.initEvent();
    },

    initPage : function(){
        require(['js/lib/jstpl/jstpl-debug.js', 'js/index/test.js'], function(jstpl, string){
            App.template = jstpl.template;
            App.helper = string;
            App.loadData();
        });
    },

    initEvent : function(){

    },

    loadData : function(){
        for(var i = 0, task; task = App.queue[i++];){
            $.get(task['url'], function(id){
                return function(data){
                    App.render(id, data);
                }
            }(task['id']));
        }
    },

    render : function(id, data){
        var html = "";

        switch(id){
            case 'test':
                html = $("#test").html();
                html = App.template(html, data);
                alert(html)
                $('#area').html(html);
                break;
        }
    }
}