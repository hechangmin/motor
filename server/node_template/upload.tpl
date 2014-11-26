<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
    <style>
    .upload_item{ width: 50px; height: 45px; overflow: hidden;border: 2px dashed #bfbfbf; float: left;margin-right: 10px;}
    .upload_item_add{  width: 50px; height: 45px; display: block; line-height: 42px; text-align: center; font-size: 30px; cursor: pointer;}
    .upload_input{ }
</style>
<script src="http://app.sjk.ijinshan.com/market/release/js/jquery-1.9.1.min.js" type="text/javascript" charset="utf-8" async defer></script>
<script>
    var ADD = {

        upload_click : function(obj){
            $(obj).parent().children().eq(1).click();
        },

        upload_change : function(obj){
            var path = $(obj).val(); 
            
            alert(path);     
            
            var name = path.split('\\'); 
            
            console.log(name);

            var bb = name[name.length-1];
            
            $(obj).parent().children().eq(0).css('fontSize','12px');
            $(obj).parent().css('borderStyle','solid');
            $(obj).parent().children().eq(0).html(bb.substr(0,bb.indexOf('.')));

            if($(obj).parent().attr('index')==1){
                var html = '<div class="upload_item" index="1"><span class="upload_item_add" onclick="ADD.upload_click(this)">+</span><input type="file" name="pics" id="pics" class="upload_input" onchange="ADD.upload_change(this)" /></div>';
                $('form').append(html);
                $(obj).parent().attr('index','0');
            }
        }
     };
</script>
<form method="post" action="/add" target="ifr_upload" enctype="multipart/form-data">
    <input type="submit" value="上传" />
    <div class="upload_item" index="1">
        <span class="upload_item_add" onclick="ADD.upload_click(this)">+</span>
        <input type="file" name="pics" id="pics" class="upload_input" onchange="ADD.upload_change(this)" />
    </div>
</form>
<iframe name="ifr_upload" src=""></iframe>
</body>
</html>