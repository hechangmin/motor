
exports.index = function(request, response) {
    var body = '<html>' +
    '<head>' + 
    '<meta http-equiv="Content-Type" content="text/html; ' + 
    'charset=UTF-8" />' + 
    '</head>' + '<body>' + 
    '<form action="/upload/upload" enctype="multipart/form-data" ' +
    'method="post">' + 
    '<input type="file" name="upload" multiple="multiple">' + 
    '<input type="submit" value="上传" />' + 
    '</form>' + 
    '</body>' + 
    '</html>';
    response.writeHead(200, {
        "Content-Type" : "text/html"
    });
    response.write(body);
    response.end();
};

exports.multipart = function(request, response) {
    
    var TplHelper = require('../node_common/tplHelper.js');
    
    if(!TplHelper.hasExpire(request, response)){
        TplHelper.readCache(request, response, function(){
            TplHelper.echo(request, response, 'upload.tpl', {});
        });
    }
};

exports.upload = function(request, response) {
    var common = require('../node_common/common.js');
    var fs = require('fs');
    
    common.onUpload(request, function(error, fields, files){
        //文件操作rename操作必须是同一个逻辑分区。否则会Rename失败
        console.log(files.upload.path);
        fs.renameSync(files.upload.path, "node_data/upload/test"); 
        
        response.writeHead(200, {
            "Content-Type" : "text/html"
        });    

        response.end("<img src='/upload/show' />");
    });
};

exports.show = function(request, response){
    var fs = require("fs");
    fs.readFile("node_data/upload/test", "binary", function (error, file) {
        if (error) {
            response.writeHead(500, {
                "Content-Type" : "text/plain"
            });
            response.write(error + "\n");
            response.end();
        } else {
            response.writeHead(200, {
                "Content-Type" : "image"
            });
            response.write(file, "binary");
            response.end();
        }
    });
};