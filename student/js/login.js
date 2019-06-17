$(function () {
    //图片
    $.ajax({
        type:'get',
        url:'http://111.230.31.212/judgement/login/checkLogin',
        dataType:'json',
        success:function (obj) {
            if(obj.code==200){
                $('.nav ul').html(
                    '                    <li class="active" style="background-color:#000;"><a href="#">首页</a></li>\n' +
                    '                    <li class="exit"><a href="#">退出登录</a></li>');
                if ($.cookie("headimg")) {
                    $(".head img").attr("src", $.cookie("headimg"));
                }
                $('.nav ul').removeClass('left_title');
                $(".head").attr("style","display:block;");
            }
            else{
                $('.nav ul').html(
                    '                    <li class="active" style="background-color:#000;"><a href="#">首页</a></li>\n' +
                    '                    <li class="login_join"><a href="#">登录</a></li>');
                $('.nav ul').addClass('left_title');
                $(".head").attr("style","display:none;");
            }
        },
        error:function (msg) {
            console.log(msg.state);
        }
    })
    //学院信息
    $.ajax({
        type: 'get',
        url: "http://111.230.31.212/judgement/advancedSearch/getAllSchools",
        dataType: "json",
        success: function (data) {
               //  var html="";

            $(".sidebar ul").empty();
                $.each(data, function (index, value) {
                    var $institute = createEle(value);
                    $(".sidebar ul").append($institute);
                // html+='<li vlaue="'+value.schId+'"><a href="../CourseInfo/searchcourse.html">' + value.schName + '</a></li>';
                });
            // $(".sidebar ul").html(html);
        },
        error: function (xhr) {
            console.log(xhr.status);
        }

    });
//监听学院点击事件

    $("body").delegate('.sidebar a', 'click', function (event) {
        // console.log($(this).parents('li').attr('name'));
        $.session.set('schoolId', $(this).parents('li').attr('name'));

    });
    //登录
    var $dom = $("#form_password");
    //按键按下
    $($dom).keydown(function (event) {
        //回车键按下
        if (event.keyCode === 13) {
            check_login();
            // return false;

        }

    });
    $('#loginbtn').on('click', function () {
        check_login();

    });
    $('.search-btn').on('click',function(){
        $.session.set('schoolId','00');
        window.location.href='../CourseInfo/searchcourse.html';
    });
    function check_login() {
        // alert("111");
        var userName = $('#form_username').val();
        var userPwd = $('#form_password').val();
        if (userName === "" || userPwd === "") {
            $("#errormessage").text("");

            $("#errormessage").text("用户名或密码不为空！");

        }

        else {

            $("#errormessage").text("");
            // $('#login').modal('hide');
            $.ajax({
                type: "POST",
                url: "http://111.230.31.212/judgement/login/login",
                async: true,       //异步提交
                data: {"stuId": userName, "password": userPwd}, //键值对
                dataType: "json",  //javascript object
                success: function (result) {
                    // console.log(result);
                    if (result.code === 200) {
                        $("#errormessage").text(result.message);
                        // window.location.href="http://127.0.0.1/MyBook/index.php/Home/Book.book.html";
                        $(".head img").attr("src", result.stuImage);
                        $.cookie("headimg", result.stuImage,{  path: '/' });
                        $('#login').modal('hide');
                        $('.nav ul').html(
                            '                    <li class="active" style="background-color:#000;"><a href="#">首页</a></li>\n' +
                            '                    <li class="exit"><a href="#">退出登录</a></li>');

                        $('.nav ul').removeClass('left_title');

                        $(".head").attr("style","display:block;");

                        $("#errormessage").css("color", "green");
                        // alert(result.message);
                    }
                    else {
                        $("#errormessage").text(result.message) ;

                        // console.log(result.message);
                    }
                },
                error: function (xhr) {
                    console.log(xhr.status);
                }
            });

        }
    }
    $('body').delegate('.login_join','click',function () {
        $('#login').modal();
        $('#form_username').val("");
        $('#form_password').val("");
        $('#errormessage').text('');

    });
$('body').delegate('.exit','click',function () {
    $('#exit').modal();
    $('.btn-success').on('click',function () {
        $.ajax({
            type: "get",
            url: "http://111.230.31.212/judgement/login/logout",
            async: true,       //异步提交
            // dataType: "json",  //javascript object
            success: function (result) {
                console.log(result);
                $('.nav ul').html(
                    '                    <li class="active" style="background-color:#000;"><a href="#">首页</a></li>\n' +
                    '                    <li class="login_join"><a href="#">登录</a></li>');
                $('.nav ul').addClass('left_title');

                $(".head").attr("style","display:none;");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest,textStatus,errorThrown);
            }
        });
    })
})

    function createEle(obj) {
        var $institute = $('<li name="'+obj.schId+'"><a href="../CourseInfo/searchcourse.html">' + obj.schName + '</a></li>');
        return $institute;
    }
});
