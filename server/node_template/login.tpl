<!DOCTYPE html>  
<html lang="en">
<head>
<meta charset="UTF-8">
<title></title>
</head>
<body>
<script src="/js/lib/jquery-1.9.1.min.js" type="text/javascript" charset="utf-8"></script>

<script>      
$(function(){          
    $("#btn_login").click(function(){              
        var user = $("#user").val();              
        var pwd = $("#pwd").val();
        $.ajax({
            url: "/session/login",
            method : 'get',
            data : {                      
                user : user,                       
                pwd : pwd                  
            },                  
            dataType : 'json',                  
            success : function(data){                      
                console.log(data);                  
            }
        });
    });  
});
</script>
<form>      
<input type="text" name="user" id="user" value="admin" />      
<input type="password" name="pwd" id="pwd" value='root' />      
<input id="btn_login" type="button" value="登录" />
</form>
</body>
</html>