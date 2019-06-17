$(function(){
    $.ajax({
        type:'get',
        url:'http://111.230.31.212/judgement/login/checkLogin',
        dataType:'json',
        success:function (obj) {
            if(obj.code==200){
                $('.nav ul').html(
                    '                    <li class="active"><a href="../Home/homepage.html">首页</a></li>\n' +
                    '                    <li class="exit"><a href="#">退出登录</a></li>');
                if ($.cookie("headimg")) {
                    $(".head img").attr("src", $.cookie("headimg"));
                }
                $('.nav ul').removeClass('left_title');
                $(".head").attr("style","display:block;");
            }
            else{
                $('.nav ul').html(
                    '                    <li class="active"><a href="../Home/homepage.html">首页</a></li>\n' +
                    '                    <li class="login_join"><a href="#">登录</a></li>');
                $('.nav ul').addClass('left_title');
                $(".head").attr("style","display:none;");
                alert(obj.message);
                window.location.href='../Home/homepage.html';
            }
        },
        error:function (msg) {
            console.log(msg.state);
        }
    })

    //退出登录
    $('body').delegate('.exit','click',function () {
        $('#exit').modal();
        $('.btn-success').on('click',function () {
            $.ajax({
                type: "get",
                url: "http://111.230.31.212/judgement/login/logout",
                async: true,       //异步提交
                // dataType: "json",  //javascript object
                success: function (result) {
                    // console.log(result);
                    // $('.nav ul').html(
                    //     '                    <li class="active"><a href="../Home/homepage.html">首页</a></li>\n' +
                    //     '                    <li class="login_join"><a href="#">登录</a></li>');
                    // $('.nav ul').addClass('left_title');
                    //
                    // $(".head").attr("style","display:none;");
                    window.location.href="../Home/homepage.html";
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest,textStatus,errorThrown);
                }
            });
        })
    })

   if($.session.get('classname')){
       $('.title1 .classname').text($.session.get('classname'));
   }
   if($.session.get('classphoto')){
       $(".m-learnleft .f-pr img").attr("src", $.session.get('classphoto'));
   }
    var teachingClassId = getUrlParam('teachingClassId');
    $('.div_hidden input').attr('value',teachingClassId);
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  // 匹配目标参数
        if (r != null) return unescape(r[2]); return null; // 返回参数值
    }
    $('.search-btn').on('click',function(){
        $.session.set('schoolId','00');
        window.location.href='../CourseInfo/searchcourse.html';
    });

});