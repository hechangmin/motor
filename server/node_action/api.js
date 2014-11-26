
var common = require('../node_common/common.js');
var configs = require('../configs.js');

exports.init = function(req, res){
    
    var data = {
        name : '张三',
        age : 18,
        desc : 'hellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohello'
    };

    var lastModified = req.headers['if-modified-since'];

    if(lastModified){
        var maxAge     = new Date(lastModified).getTime() + configs.jsonExpires,
            curUTCTime = new Date(new Date().toUTCString()).getTime();

        if(maxAge > curUTCTime){
            common.handle304(res);
        }else{
            res.json(data);    
        }
    }else{
        res.json(data);
    }
};