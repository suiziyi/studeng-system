
$(function () {
//检验登录
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
                        window.location.Reload();
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

    //获取学院
    getMsgInstitute();
    //获取系
    getMsgSystem();
    //获取all页面内容
    var page = parseInt($.session.get("page")) || 1;//点击哪页刷新还在哪页

    getallmsglist(page);
    function getallmsglist(page) {
        $("#start .g-flow").html("");
        $.ajax({
            url: 'http://111.230.31.212/judgement/search/getAllTeachingClassList',
            type: 'get',
            dataType: 'json',
            async:true,
            data:{
                page:page,
                schoolId:$.session.get('schoolId')
            },
            success: function (obj) {
                $("#start .g-flow").empty();
                var objo = obj.onGoingClasses;
                var num = obj.sumOfClasses;
                var objf=obj.terminateClasses;
                var obju=obj.unStartClasses;
                $.each(obju, function (key, value) {
                    var $lesson = createLesson(value);
                    $("#start .g-flow").append($lesson);
                    // "tcStatus": 1,
                });
                $.each(objo, function (key, value) {
                    var $lesson = createLesson(value);
                    $("#start .g-flow").append($lesson);
                    //"tcStatus": 0,
                });
                $.each(objf, function (key, value) {
                    var $lesson = createLesson(value);
                    $("#start .g-flow").append($lesson);
                    //"tcStatus": 2,
                });
                var num=Math.ceil(num/10);
                getmsgpage(num);
            },
            error: function (msg) {
                console.log(msg.status);
            }
        })

    }
    //正在进行
    getgoingmsglist(page);

    function getgoingmsglist(page) {
        $("#doing .g-flow").html("");
        $.ajax({
            url: 'http://111.230.31.212/judgement/search/getOnGoingTeachingClassList',
            type: 'get',
            dataType: 'json',
            async:true,
            data:{
                page:page,

                schoolId:$.session.get('schoolId')
            },
            success: function (obj) {
                var obj = obj.onGoingClasses;
                var num = obj.sumOfClasses;
                $.each(obj, function (key, value) {
                    var $lesson = createLesson(value);
                    $("#doing .g-flow").append($lesson);
                });
                var num=Math.ceil(num/10);
                getmsgpage(num);
            },
            error: function (msg) {
                console.log(msg.status);
            }
        })
    }
    //将要进行
    getwillmsglist(page);

    function getwillmsglist(page) {
        $("#will_start .g-flow").html("");
        $.ajax({
            url: 'http://111.230.31.212/judgement/search/getUnStartTeachingClassList',
            type: 'get',
            dataType: 'json',
            async:true,
            data:{
                page:page,

                schoolId:$.session.get('schoolId')
            },
            success: function (obj) {
                // console.log(obj);
                var obj = obj.unStartClasses;
                 var num = obj.sumOfClasses;
                $.each(obj, function (key, value) {
                    var $lesson = createLesson(value);
                    $("#will_start .g-flow").append($lesson);
                });
                var num=Math.ceil(num/10);
                getmsgpage(num);
            },
            error: function (msg) {
                console.log(msg.status);
            }
        })
    }
    //已结束
    getfinishmsglist(page);

    function getfinishmsglist(page) {
        $("#finish .g-flow").html("");
        $.ajax({
            url: 'http://111.230.31.212/judgement/search/getTerminateTeachingClassList',
            type: 'get',
            dataType: 'json',
            async:true,
            data:{
                page:page,
                schoolId:$.session.get('schoolId')
            },
            success: function (obj) {
                var obj = obj.terminateClasses;
                var num = obj.sumOfClasses;
                $.each(obj, function (key, value) {
                    var $lesson = createLesson(value);
                    $("#finish .g-flow").append($lesson);
                });
                var num=Math.ceil(num/10);
                getmsgpage(num);
            },
            error: function (msg) {
                console.log(msg.status);
            }
        })
    }
    //获取页码
    function getmsgpage(num) {
        $(".pagination").empty();
      var $b=$('<li><a href="javascript::">&laquo;</a></li>');
        $(".pagination").append($b);
        for (var i = 0; i < num; i++) {
           var $a=$('<li><a href="javascript::">' + (i + 1) + '</a></li>');
            if (i ===page-1) {
                $a.addClass('active');

            }
            $(".pagination").append($a);
        }
        var $c=('<li><a href="javascript::">&raquo;</a></li>');
        $(".pagination").append($c);


    }
    //点击div
    $("body").delegate('.u-course-name', 'click', function (event) {
        // $('.div_class').get(0).obj=$(this).attr("value");
        // console.log($('.div_class').get(0).obj);
        var $this=$(this).parents('.ga-click').attr('value');
        var obj=parseInt($this);
        $('input[name="teachingClassId"]').attr('value',obj);
        url = "infor3.html?teachingClassId="+obj;//此处拼接内容
        window.location.href = url;
    });
    // $("body").delegate('.course_join', 'click', function (event) {
    //         event.stopPropagation();
    //         //document.getElementById('operationDialogDeleteTital').innerText = $(this).text();
    //         $("#joinCourse").modal();
    // });
    // 加入课程
    $("body").delegate('.attend_join', 'click', function (event) {
        // event.stopPropagation();
        var $this=$(this);
        var teachingClassId=parseInt($(this).attr("value"));
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
                   $("#attendCourse").modal();
                   if($this.text()=='立即参加'){
                       $this.text('开始学习');

                   }
                   else if($this.text()=='立即报名'){
                       $this.text('查看详情');

                   }

               }
               else if(obj.code==403){
                   var classphoto= $this.parents('.ga-click').find('.u-img img').attr('src');
                   var classname=$this.parents('.ga-click').find('.div_class .u-course-name').text();
                   if($this.text()=='查看详情'){
                       url = "infor3.html?teachingClassId="+teachingClassId;//此处拼接内容
                       window.location.href = url;
                   }
                   else if($this.text()=='开始学习'){
                       $.session.set('classname',classname);
                       $.session.set('classphoto',classphoto);
                       url = "../myclass/myclass.html?teachingClassId="+teachingClassId;//此处拼接内容
                       window.location.href = url;
                   }

               }
               else if(obj.code==401){
                   alert(obj.message);
                   $('#login').modal();
                   $('#form_username').val("");
                   $('#form_password').val("");
                   $('#errormessage').text('');
               }
            },
            error: function (msg) {
                console.log(msg.status);
            }
        })

    });
    $("body").delegate('.login_join', 'click', function (event) {
        $('#login').modal();
    });

    $(".pagination").delegate('a', 'click', function (event) {
        // console.log("all");
        // console.log($(this).html());
        getallmsglist($(this).html());
        $(this).parents('li').addClass('active');
        $(this).parents('li').siblings().removeClass("active");
        // console.log($('.pagination').html());
        $.session.set('page', $(this).html());
        // console.log($.session.get('page'));
        setInterval(function(){

            window.location.reload();

        },50)
    });
    clearInterval();
//所有课程1
    $(".all").on('click', function () {
        //获取点击页码
        $(".pagination").delegate('a', 'click', function (event) {
            getallmsglist($(this).html());
            $(this).parents('li').addClass('active');
            $(this).parents('li').siblings().removeClass("active");
            $.session.set('page', $(this).html());
            setInterval(function(){

                window.location.reload();

            },50)
        });
        clearInterval();
    });

//正在开课
    $('.going').on('click', function () {

        //获取点击页码
        $(".pagination").delegate('a', 'click', function (event) {
            getgoingmsglist($(this).html());
            $(this).parents('li').addClass("active");
            $(this).parents('li').siblings().removeClass("active");
            $.session.set('page', $(this).html());
            setInterval(function(){

                window.location.reload();

            },50)
        });
        clearInterval();
    });
//将要开课
    $('.will').on('click', function () {
        $(".pagination").delegate('a', 'click', function (event) {
            getwillmsglist($(this).html());
            $(this).parents('li').addClass('active');
            $(this).parents('li').siblings().removeClass("active");
            $.session.set('page', $(this).html());
            setInterval(function(){

                window.location.reload();

            },50)
        });
        clearInterval();
    });
    //结束
    $('.finish').on('click', function () {
        $(".pagination").delegate('a', 'click', function (event) {
            getfinishmsglist($(this).html());
            $(this).parents('li').addClass('active');
            $(this).parents('li').siblings().removeClass("active");
            $.session.set('page', $(this).html());
            setInterval(function(){

                window.location.reload();

            },50)
        });
        clearInterval();
    });
//学院

 function getMsgInstitute(){
          $("#institute").html("");
        $.ajax({
            type: 'get',
            url: "http://111.230.31.212/judgement/advancedSearch/getAllSchools",
            dataType: "json",
            async:true,
            success: function (data) {
                    var $institute1=$('<option value="00" class="first" >请选择学院</option>');
                    $(".institute ").append($institute1);
                $.each(data, function (index, value) {
                    var $institute = $("<option value='"+ value.schId + "'>"+ value.schName + "</option>");
                    // console.log(typeof($institute.val()));
                    $(".institute ").append($institute);

                });

                if (null != $.session.get('schoolId')) {
                        $("#institute ").val($.session.get('schoolId'));
                }
                else{
                    $("#institute ").val('00');
                }
                $("#institute").change(function() {
                    // console.log($("#institute").val());
                    var schoolId = $("#institute").val();
                     // $.cookie('schoolId', schoolId, {path: '/'});
                    $.session.set("schoolId",schoolId);
                    // console.log(typeof($.session.get("schoolId")));
                    //获取系
                    getMsgSystem(page);
                    getallmsglist(page);
                    getwillmsglist(page);
                    getgoingmsglist(page);
                    getfinishmsglist(page);
                })
            },
            error: function (xhr) {
                console.log(xhr.status);
            }

        });

 }
    //系
    function getMsgSystem(){
        $("#system").html("");

        $.ajax({
            type: 'get',
            url: "http://111.230.31.212/judgement/advancedSearch/getAllDepartments" ,
            data:{schoolId:$.session.get('schoolId')},
            dataType: "json",
            async:true,
            success: function (data) {
                var $institute1=$('<option value="00" class="first">请选择系</option>');
                $(".system ").append($institute1);
                $.each(data, function (index, value) {
                    var $system= $("<option value='"+ value.deptId + "'>"+ value.deptName + "</option>");
                    // console.log(typeof($institute.val()));
                    $(".system ").append($system);

                });
                if (null != $.session.get('departmentId')) {
                    $("#system ").val($.session.get('departmentId'));
                }
                else{
                    $("#system ").val('00');
                }
                $("#system").change(function() {
                    // console.log($("#institute").val());
                    var departmentId = $("#system").val();
                    $.session.set('departmentId', departmentId);
                    getallmsglist1(page);
                    getwillmsglist1(page);
                    getgoingmsglist1(page);
                    getfinishmsglist1(page);
                })
            },
            error: function (xhr) {
                console.log(xhr.status);
            }

        })
    }

 //搜索点击
    var $dom = $(".header-search button");
    //按键按下
    $($dom).keydown(function (event) {
        //回车键按下
        if (event.keyCode === 13) {
            search();
            // return false;

        }

    });
    $('.header-search button').on('click', function () {
        function search(){
            var $couName = $('header-search input').val();
            $.session.set("couName", $couName);
            // console.log($couName);
            getallmsglist2();
            getgoingmsglist2();
            getwillmsglist2();
            getfinishmsglist2();
        }

    });

    function createLesson(obj) {
        var html1 = ('<div class="u-clist f-bg f-cb f-pr j-href ga-click" value="'+obj.tcId+'">' +
            '<div class="g-sd1">' +
            '<div class="u-img f-f1">' +
            '<img src="' + obj.couFile + '" style="height: 150px;width: 265px;"/>' +
            '</div>' +
            '</div>' +
            '<div class="g-mn1" >' +
            '<div class="g-mn1c">' +
            '<div class="cnt f-pr">' +
            '<div class="div_class" ><div class="t1 f-f0 f-cb">' +


            '<span class="u-course-name f-thide">' + obj.tcName + '</span>' +

            '</div>' +
            '<div class="t2 f-fc3 f-nowrp f-f0">' +
            '<a class="t21 f-fc9" href="#">' + obj.schName + '</a>' +
            '<a class="f-fc9" href="#">' + obj.teaName + '</a>' +
            '</div>' +

            '<span class="p5 brief f-ib f-f0 f-cb ">' + obj.couIntro +
            '</span></div>' +

            '<div class="t2 f-fc3 f-nowrp f-f0 margin-top0">' +
            '<span class="u-icon-person f-fc9"><i class="fa fa-user-o"></i></span>' +
            '<span class="hot">'+obj.tcStunum+'人参加</span>' +
            '<div class="time not-open">' +
        '<span class="f-icon clock u-icon-clock2"><i class="fa fa-clock-o"></i></span>');
        if (obj.tcStatus===0) {
            var html2=('<span class="txt" style="color:#00CD00;">' + obj.tcStrdate + ' 开课</span></div>' );
        }
        else if(obj.tcStatus===1){
            var html2=('<span class="txt" style="color:#FD7531;">' + obj.tcStrdate + ' 开课</span></div>' );
        }
        else{
            var html2=('<span class="txt" style="color:#A6A6A6;">' + obj.tcStrdate + ' 开课</span></div>' );
        }
           var html3=( '<span class="join-in-course" id="UserLogout" >');
        if(obj.isJoined==true){
            if (obj.tcStatus===0) {
                var html4=( '<button type="button" value="'+obj.tcId+'" class="btn btn-warning attend_join" style="width: 80px; height: 25px;background-color: #00CD00;font-size: 12px;margin-right: -50px;line-height:7px;">开始学习</button>')
            }
            else if(obj.tcStatus===1){
                var html4=( '<button type="button" value="'+obj.tcId+'" class="btn btn-warning attend_join" style="width: 80px; height: 25px;background-color: #FD7531;font-size: 12px;margin-right: -50px;line-height:7px;">查看详情</button>')
            }
            else{
                var html4=( '<button type="button" value="'+obj.tcId+'" class="btn btn-warning attend_join" style="width: 80px; height: 25px;background-color: #A6A6A6;font-size: 12px;margin-right: -50px;line-height:7px;">查看详情</button>')
            }
        }
        //未参加
        else{
            if (obj.tcStatus===0) {
                var html4=( '<button type="button" value="'+obj.tcId+'" class="btn btn-warning attend_join" style="width: 80px; height: 25px;background-color: #00CD00;font-size: 12px;margin-right: -50px;line-height:7px;">立即参加</button>')
            }
            else if(obj.tcStatus===1){
                var html4=( '<button type="button" value="'+obj.tcId+'" class="btn btn-warning attend_join" style="width: 80px; height: 25px;background-color: #FD7531;font-size: 12px;margin-right: -50px;line-height:7px;">立即报名</button>')
            }
            else{
                var html4=( '<button type="button" value="'+obj.tcId+'" class="btn btn-warning attend_join" style="width: 80px; height: 25px;background-color: #A6A6A6;font-size: 12px;margin-right: -50px;line-height:7px;">查看详情</button>')
            }
        }

           var html5=( '</span>' +

            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '</div>');
        return html1+html2+html3+html4+html5;
    }
    function getallmsglist1(page) {
        $("#start .g-flow").html("");
        $.ajax({
            url: 'http://111.230.31.212/judgement/search/getAllTeachingClassList',
            type: 'get',
            dataType: 'json',
            async:true,
            data:{
                page:page,
                deparementId:$.session.get('departmentId'),
                schoolId:$.session.get('schoolId')
            },
            success: function (obj) {
                $("#start .g-flow").empty();
                var obj = obj.onGoingClasses;
                var num = obj.sumOfClasses;
                $.each(obj, function (key, value) {
                    var $lesson = createLesson(value);
                    $("#start .g-flow").append($lesson);
                });
                var num=Math.ceil(num/10);
                getmsgpage(num);
            },
            error: function (msg) {
                console.log(msg.status);
            }
        })

    }
    //正在进行

    function getgoingmsglist1(page) {
        $("#doing .g-flow").html("");
        $.ajax({
            url: 'http://111.230.31.212/judgement/search/getOnGoingTeachingClassList',
            type: 'get',
            dataType: 'json',
            async:true,
            data:{
                page:page,
                deparementId:$.session.get('departmentId'),
                schoolId:$.session.get('schoolId')
            },
            success: function (obj) {
                var obj = obj.onGoingClasses;
                var num = obj.sumOfClasses;
                $.each(obj, function (key, value) {
                    var $lesson = createLesson(value);
                    $("#doing .g-flow").append($lesson);
                });
                var num=Math.ceil(num/10);
                getmsgpage(num);
            },
            error: function (msg) {
                console.log(msg.status);
            }
        })
    }
    //将要进行

    function getwillmsglist1(page) {
        $("#will_start .g-flow").html("");
        $.ajax({
            url: 'http://111.230.31.212/judgement/search/getUnStartTeachingClassList',
            type: 'get',
            dataType: 'json',
            async:true,
            data:{
                page:page,
                deparementId:$.session.get('departmentId'),
                schoolId:$.session.get('schoolId')
            },
            success: function (obj) {
                var obj = obj.onGoingClasses;
                var num = obj.sumOfClasses;
                $.each(obj, function (key, value) {
                    var $lesson = createLesson(value);
                    $("#will_start .g-flow").append($lesson);
                });
                var num=Math.ceil(num/10);
                getmsgpage(num);
            },
            error: function (msg) {
                console.log(msg.status);
            }
        })
    }
    //已结束

    function getfinishmsglist1(page) {
        $("#finish .g-flow").html("");
        $.ajax({
            url: 'http://111.230.31.212/judgement/search/getTerminateTeachingClassList',
            type: 'get',
            dataType: 'json',
            async:true,
            data:{
                page:page,
                deparementId:$.session.get('departmentId'),
                schoolId:$.session.get('schoolId')
            },
            success: function (obj) {
                var obj = obj.onGoingClasses;
                var num = obj.sumOfClasses;
                $.each(obj, function (key, value) {
                    var $lesson = createLesson(value);
                    $("#finish .g-flow").append($lesson);
                });
                var num=Math.ceil(num/10);
                getmsgpage(num);
            },
            error: function (msg) {
                console.log(msg.status);
            }
        })
    }
    function getallmsglist2(page) {
        $("#start .g-flow").html("");
        $.ajax({
            url: 'http://111.230.31.212/judgement/search/getAllTeachingClassList',
            type: 'get',
            dataType: 'json',
            async:true,
            data:{
                page:page,
                couName:$.session.get('couName'),
                deparementId:$.session.get('departmentId'),
                schoolId:$.session.get('schoolId')
            },
            success: function (obj) {
                $("#start .g-flow").empty();
                var obj = obj.onGoingClasses;
                var num = obj.sumOfClasses;
                $.each(obj, function (key, value) {
                    var $lesson = createLesson(value);
                    $("#start .g-flow").append($lesson);
                });
                var num=Math.ceil(num/10);
                getmsgpage(num);
            },
            error: function (msg) {
                console.log(msg.status);
            }
        })

    }
    //正在进行

    function getgoingmsglist2(page) {
        $("#doing .g-flow").html("");
        $.ajax({
            url: 'http://111.230.31.212/judgement/search/getOnGoingTeachingClassList',
            type: 'get',
            dataType: 'json',
            async:true,
            data:{
                page:page,
                couName:$.session.get('couName'),
                deparementId:$.session.get('departmentId'),
                schoolId:$.session.get('schoolId')
            },
            success: function (obj) {
                var obj = obj.onGoingClasses;
                var num = obj.sumOfClasses;
                $.each(obj, function (key, value) {
                    var $lesson = createLesson(value);
                    $("#doing .g-flow").append($lesson);
                });
                var num=Math.ceil(num/10);
                getmsgpage(num);
            },
            error: function (msg) {
                console.log(msg.status);
            }
        })
    }
    //将要进行

    function getwillmsglist2(page) {
        $("#will_start .g-flow").html("");
        $.ajax({
            url: 'http://111.230.31.212/judgement/search/getUnStartTeachingClassList',
            type: 'get',
            dataType: 'json',
            async:true,
            data:{
                page:page,
                couName:$.session.get('couName'),
                deparementId:$.session.get('departmentId'),
                schoolId:$.session.get('schoolId')
            },
            success: function (obj) {
                var obj = obj.onGoingClasses;
                var num = obj.sumOfClasses;
                $.each(obj, function (key, value) {
                    var $lesson = createLesson(value);
                    $("#will_start .g-flow").append($lesson);
                });
                var num=Math.ceil(num/10);
                getmsgpage(num);
            },
            error: function (msg) {
                console.log(msg.status);
            }
        })
    }
    //已结束

    function getfinishmsglist2(page) {
        $("#finish .g-flow").html("");
        $.ajax({
            url: 'http://111.230.31.212/judgement/search/getTerminateTeachingClassList',
            type: 'get',
            dataType: 'json',
            async:true,
            data:{
                page:page,
                couName:$.session.get('couName'),
                deparementId:$.session.get('departmentId'),
                schoolId:$.session.get('schoolId')
            },
            success: function (obj) {
                var obj = obj.onGoingClasses;
                var num = obj.sumOfClasses;
                $.each(obj, function (key, value) {
                    var $lesson = createLesson(value);
                    $("#finish .g-flow").append($lesson);
                });
                var num=Math.ceil(num/10);
                getmsgpage(num);
            },
            error: function (msg) {
                console.log(msg.status);
            }
        })
    }
});