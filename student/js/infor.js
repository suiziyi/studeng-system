$(function () {
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

    //登录
    var $dom = $("#form_password");
    //按键按下
    $($dom).keydown(function (event) {
        //回车键按下
        if (event.keyCode === 13) {
            check_login();
        }
    });
    $('#loginbtn').on('click', function () {

        check_login();

    });
    function check_login() {
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
                            '                    <li class="active"><a href="../Home/homepage.html">首页</a></li>\n' +
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
    //登录样式
    $('body').delegate('.login_join','click',function () {
        $('#login').modal();
        $('#form_username').val("");
        $('#form_password').val("");
        $('#errormessage').text('');
    });
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

   getmsgpage();
   function getmsgpage(){
       // console.log($.session.get('teachingClassId'));
       var teachingClassId = getUrlParam('teachingClassId');
       // console.log(teachingClassId);
       // console.log(typeof(teachingClassId));
       $.ajax({
           type: 'get',
           url: "http://111.230.31.212/judgement/teachingClassInfo/getTeachingClassInfo",
           dataType: "json",
           data:{
               teachingClassId:teachingClassId
           },
           success: function (obj) {
               var data=obj.chapters;
               $(".row").empty();
               var html1=' <div class="image">\n' +
                     '            <img src="'+obj.couFile+'" />\n' +
                     '        </div>\n' +
                     '        <div class="title">';
                 html1+='<h1>'+obj.tcName+'</h1>\n' +
                   '            <div class="time">\n' +
                   '            <ul>\n' +
                   '                <li>授课老师：'+obj.schName+'&nbsp;&nbsp;'+obj.teaName+'</li>';
               if (obj.tcStatus===0) {
                   var html2=('<li style="width:300px;">开课时间:&nbsp;&nbsp;<span style="color:#00CD00;"> '+obj.tcStrdate+'</span>&nbsp;&nbsp;开课</li>' );
               }
               else if(obj.tcStatus===1){
                   var html2=('<li style="width:300px;">开课时间:&nbsp;&nbsp;<span style="color:#FD7531;"> '+obj.tcStrdate+'</span>&nbsp;&nbsp;即将开课</li>' );
               }
               else{
                   var html2=('<li style="width:300px;">开课时间:&nbsp;&nbsp;<span style="color:#a6a6a6;">'+obj.tcStrdate+'</span>&nbsp;&nbsp;已经结束</li>' );
               }

               var html3=('<li>参加人数：已有'+obj.tcStunum+'人参加</li>\n' +
                   '            </ul>\n' +
                   '            </div>' );
               if(obj.isJoined==true){
                   if (obj.tcStatus===0) {
                       var html4=( '<button type="button"  id="start_study" value="'+obj.tcId+'" class="btn myclass_button" style="border:2px solid #00CD00; border-radius:5px;background-color:#00CD00;">开始学习</button>')
                   }
                   else if(obj.tcStatus===1){
                       var html4=( '<button type="button"  id="start_study" value="'+obj.tcId+'" class="btn myclass_button" style="border:2px solid #FD7531; border-radius:5px;background-color:#FD7531;">已经报名</button>')
                   }
                   else{
                       var html4=( '<button type="button"  id="start_study" value="'+obj.tcId+'" class="btn myclass_button" style="border:2px solid #A6A6A6; border-radius:5px;background-color:#a6a6a6;">已经结束</button>')
                   }
               }
               //未参加
               else{
                   if (obj.tcStatus===0) {
                       var html4=( '<button type="button"  id="start_study" value="'+obj.tcId+'" class="btn myclass_button" style="border:2px solid #00CD00; border-radius:5px;background-color:#00CD00;">立即参加</button>')
                   }
                   else if(obj.tcStatus===1){
                       var html4=( '<button type="button"  id="start_study" value="'+obj.tcId+'" class="btn myclass_button" style="border:2px solid #FD7531; border-radius:5px;background-color:#FD7531;">立即报名</button>')
                   }
                   else{
                       var html4=( '<button type="button"  id="start_study" value="'+obj.tcId+'" class="btn myclass_button" style="border:2px solid #A6A6A6; border-radius:5px;background-color:#a6a6a6;">已经结束</button>')
                   }
               }

               $(".row").html(html1+html2+html3+html4);
               $(".about .p1 p").html('<p>'+obj.couIntro+'</p>');
               $(".class .article").html("");

               $.each(data, function (index, value) {
                   var $lesson = createLesson(value);
                   $(".class .article").append($lesson);
               })
           },
           error: function (xhr) {
               console.log(xhr.status);
           }

       });
   }

    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  // 匹配目标参数
        if (r != null) return unescape(r[2]); return null; // 返回参数值
    }

   function createLesson(obj) {
       var text=obj.sections;
      var title='<div class="sec">\n' +
           '                   <h2>' + obj.chapterName + '</h2>\n' +
           '                   <ul>';
       var title3="";
           $.each(text, function (index, value) {
               title3+='<li>'+value.sectionName+'</li>';

           });
       $(".sec ul").append(text);
            var title2='</ul>\n' +
                 '            </div>';

       return title+title3+title2;
   }

       $("body").delegate('.btn', 'mouseover', function (event) {
           if ($('.btn').text()==='开始学习'||$('.btn').text()==='立即报名'||$('.btn').text()==='立即参加') {
               $('.btn').css({'opacity': '0.5', 'cursor': 'pointer'});
           }
       });
    $("body").delegate('.btn', 'mouseout', function (event) {
        if ($('.btn').text()==='开始学习'||$('.btn').text()==='立即报名'||$('.btn').text()==='立即参加') {
            $('.btn').css({'opacity': '1', 'cursor': 'default'});
        }
    });

    // 加入课程
    $("body").delegate('.btn', 'click', function (event) {
        // event.stopPropagation();
        var $this=$(this);
        var teachingClassId = getUrlParam('teachingClassId');
        $.ajax({
            url: 'http://111.230.31.212/judgement/studentTeachingClass/joinTeachingClass',
            type: 'get',
            dataType: 'json',
            async:true,
            data:{
                teachingClassId:teachingClassId
            },
            success: function (obj) {
                // console.log(obj);
                console.log(obj);
                if(obj.code==200){
                    //document.getElementById('operationDialogDeleteTital').innerText = $(this).text();

                    if($this.text()=='立即参加'){
                        $this.text('开始学习');

                    }
                    else if($this.text()=='立即报名'){
                        $this.text('查看详情');
                    }
                    alert(obj.message);
                }
                else if(obj.code==403){
                    if($this.text()=='开始学习'){
                        $.session.set("classphoto",$('.row img').attr('src'));
                        $.session.set("classname",$('.row .title h1').text());
                        url = "../myclass/myclass.html?teachingClassId="+teachingClassId;//此处拼接内容
                        window.open (url);
                    }

                }
            },
            error: function (msg) {
                console.log(msg.status);
            }
        })

    });
    $('.search-btn').on('click',function(){
        $.session.set('schoolId','00');
        window.location.href='../CourseInfo/searchcourse.html';
    });
});