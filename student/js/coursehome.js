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
                    $("#header_wrap img").attr("src", $.cookie("headimg"));

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

    $("body").delegate('.alert_delete', 'click', function (event) {
        document.getElementById('operationDiagnosable').innerText = $(this).text();
        $("#deleteAlert").modal();
    });
    //删除课程
    $("body").delegate('.courseWindow_delete', 'click', function (event) {
            document.getElementById('operationDialogue').innerText = $(this).text();
        $("#deleteCourse").modal();
        var $this=$(this);
        var teachingClassId=parseInt($(this).attr('value'));

        $('#sureDdelete').one('click',function () {
            $.ajax({
                url: 'http://111.230.31.212/judgement/studentTeachingClass/quitTeachingClass',
                type: 'get',
                dataType: 'json',
                async:true,
                data:{
                    teachingClassId:teachingClassId
                },
                success: function (obj) {
                    if(obj.code==200){
                        $this.parents('.myclass-list_itm').remove();
                        alert(obj.message);
                    }
                    else if(obj.code==401){
                        alert(obj.message);
                        window.location.href('../Home/homepage.html');
                    }
                },
                error: function (msg) {
                    IsAjaxExecuting = false; // new code
                    console.log(msg.status);
                }
            })
        })

    });
    $('.search-btn').on('click',function(){
        $.session.set('schoolId','00');
        window.location.href='searchcourse.html';
    });
        //获取all页面内容
        var page = parseInt($.session.get("pagecourse")) || 1;//点击哪页刷新还在哪页
        getallmsglist(page);

        function getallmsglist(page) {

            $("#start .g-flow").html("");
            $.ajax({
                url: 'http://111.230.31.212/judgement/studentTeachingClass/getAllStudentCourseList',
                type: 'get',
                dataType: 'json',
                acync:true,
                data: {
                    page: page
                },
                success: function (obj) {
                if(obj.code==401){
                        alert(obj.message);
                        window.location.href('../Home/homepage.html');
                }
                    $("#start .myclass-list_ul").empty();
                    var objo = obj.onGoingClasses;
                    var num = obj.sumOfClasses;
                    var objf = obj.terminateClasses;
                    var obju = obj.unStartClasses;

                        $.each(obju, function (key, value) {
                            var $lesson = createLesson2(value);
                            $("#start .myclass-list_ul").append($lesson);
                            // "tcStatus": 1,
                        });

                        $.each(objo, function (key, value) {
                            var $lesson = createLesson(value);
                            $("#start .myclass-list_ul").append($lesson);
                            // "tcStatus": 1,
                        });

                        $.each(objf, function (key, value) {
                            var $lesson = createLesson(value);
                            $("#start .myclass-list_ul").append($lesson);
                            // "tcStatus": 1,
                        });

                    var num=Math.ceil(num/10);
                    getmsgpage(num);
                },
                error: function (msg) {
                    console.log(msg.message);
                    alert(msg.message);
                }
            })

        }

        //正在进行
        getgoingmsglist(page);

        function getgoingmsglist(page) {

            $("#doing .myclass-list_ul").html("");
            $.ajax({
                url: 'http://111.230.31.212/judgement/studentTeachingClass/getOnGoingStudentCourseList',
                type: 'get',
                dataType: 'json',
                async:true,
                data: {
                    page: page
                },
                success: function (obj) {
                    if(obj.code==401){
                        alert(obj.message);
                        window.location.href('../Home/homepage.html');
                    }
                    var obj = obj.onGoingClasses;
                    var num = obj.sumOfClasses;

                        $.each(obj, function (key, value) {
                            var $lesson = createLesson(value);
                            $("#doing .myclass-list_ul").append($lesson);
                        });

                    var num=Math.ceil(num/10);
                    getmsgpage(num);
                },
                error: function (msg) {
                    console.log(msg.message);
                    alert(msg.message);
                }
            })
        }

        //将要进行
        getwillmsglist(page);

        function getwillmsglist(page) {
            $("#will_start .myclass-list_ul").html("");
            $.ajax({
                url: 'http://111.230.31.212/judgement/studentTeachingClass/getUnStartStudentCourseList',
                type: 'get',
                dataType: 'json',
                async:true,
                data: {
                    page: page

                },
                success: function (obj) {
                    if(obj.code==401){
                        alert(obj.message);
                        window.location.href('../Home/homepage.html');
                    }
                    var obj = obj.unStartClasses;
                    var num = obj.sumOfClasses;

                        $.each(obj, function (key, value) {
                            var $lesson = createLesson2(value);
                            $("#will_start .myclass-list_ul").append($lesson);
                        });

                    var num=Math.ceil(num/10);
                    getmsgpage(num);
                },
                error: function (msg) {
                    console.log(msg.message);
                    alert(msg.message);
                }
            })
        }

        //已结束
        getfinishmsglist(page);

        function getfinishmsglist(page) {

            $("#finish .myclass-list_ul").html("");
            $.ajax({
                url: 'http://111.230.31.212/judgement/studentTeachingClass/getTerminateStudentCourseList',
                type: 'get',
                dataType: 'json',
                async:true,
                data: {
                    page: page
                },
                success: function (obj) {
                    if(obj.code==401){
                        alert(obj.message);
                        window.location.href('../Home/homepage.html');
                    }
                    var obj = obj.terminateClasses;
                    var num = obj.sumOfClasses;

                        $.each(obj, function (key, value) {
                            var $lesson = createLesson(value);
                            $("#finish .myclass-list_ul").append($lesson);
                        });

                    getmsgpage(num);
                },
                error: function (msg) {
                    console.log(msg.message);
                    alert(msg.message);
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
    //监听开始学习
    $("#myTabContent").delegate('#start_study', 'click', function (event) {
        var obj=parseInt($(this).attr("value"));
        // console.log(obj);
        // console.log($(this).parents('.uc-course-card').find('.course-card_title').text());
        // $('.div_hidden input').attr('value',obj);
        // $.session.set("teachingClassId",obj);
        $.session.set("classphoto",$(this).parents('.uc-course-card').find('img').attr('src'));
        $.session.set("classname",$(this).parents('.uc-course-card').find('.course-card_title').text());
        if($(this).attr('name')==1){
            url = "infor3.html?teachingClassId="+obj;//此处拼接内容
            window.location.href = url;
        }
        else{
            url = "../myclass/myclass.html?teachingClassId="+obj;//此处拼接内容
            window.location.href = url;
        }
    });
       // 页码监听
    $(".pagination").delegate('a', 'click', function (event) {
        // console.log("all");
        // console.log($(this).html());
        getallmsglist($(this).html());
        $(this).parents('li').addClass('active');
        $(this).parents('li').siblings().removeClass("active");
        // console.log($('.pagination').html());
        $.session.set('pagecourse', $(this).html());
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
            $.session.set('pagecourse', $(this).html());
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
            $.session.set('pagecourse', $(this).html());
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
            $.session.set('pagecourse', $(this).html());
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
            $.session.set('pagecourse', $(this).html());
            setInterval(function(){

                window.location.reload();

            },50)
        });
        clearInterval();
    });
        function createLesson2(obj) {
            var html1 = ('<li class="myclass-list_itm" >' +
                '<div class="uc-course-card">' +
                '<div style="position: relative;">' +
                '<img class="myclass_img" src="' + obj.couFile + '" />' +
                '<div class="course-card_closewrap">' +
                '<div class="course-card_close f-dn alert_delete" value="'+obj.tcId+'" ></div>' +
                '</div>' +
                '</div>' +
                '<div class="course-card_title">' + obj.tcName +

                '</div>' +
                '<div class="card_btn" >' +
                '<p class="uc-course-card-p" >');
            if (obj.tcStatus === 0) {
                var html2 = ('<button name="'+obj.tcStatus+'" type="button" value="'+obj.tcId+'" class="btn myclass_button" id="start_study" style="border:2px solid #337ab7; border-radius:20px;background-color:#00CD00;">开始学习</button>');
            }
            else if (obj.tcStatus === 1) {
                var html2 = ('<button name="'+obj.tcStatus+'"  type="button" value="'+obj.tcId+'" class="btn myclass_button" id="start_study" style="border:2px solid #337ab7; border-radius:20px;background-color: #FD7531;">查看详情</button>');
            }
            else {
                var html2 = ('<button name="'+obj.tcStatus+'"  type="button" value="'+obj.tcId+'" class="btn myclass_button" id="start_study" style="border:2px solid #337ab7; border-radius:20px;background-color: #FD7531;">查看详情</button>');
            }
            var html3 = ('</p>' +

                '</div>' +

                '</div>' +

                '</li>');

            return html1 + html2 + html3;
        }
    function createLesson(obj) {
        var html1 = ('<li class="myclass-list_itm" >' +
            '<div class="uc-course-card">' +
            '<div style="position: relative;">' +
            '<img class="myclass_img" src="' + obj.couFile + '" />' +
            '<div class="course-card_closewrap">' +
            '<div class="course-card_close f-dn courseWindow_delete" value="'+obj.tcId+'" ></div>' +
            '</div>' +
            '</div>' +
            '<div class="course-card_title">' + obj.tcName +

            '</div>' +
            '<div class="card_btn" >' +
            '<p class="uc-course-card-p" >');
        if (obj.tcStatus === 0) {
            var html2 = ('<button name="'+obj.tcStatus+'" type="button" value="'+obj.tcId+'" class="btn myclass_button" id="start_study" style="border:2px solid #337ab7; border-radius:20px;background-color:#00CD00;">开始学习</button>');
        }
        else if (obj.tcStatus === 1) {
            var html2 = ('<button name="'+obj.tcStatus+'"  type="button" value="'+obj.tcId+'" class="btn myclass_button" id="start_study" style="border:2px solid #337ab7; border-radius:20px;background-color: #FD7531;">查看详情</button>');
        }
        else {
            var html2 = ('<button name="'+obj.tcStatus+'"  type="button" value="'+obj.tcId+'" class="btn myclass_button" id="start_study" style="border:2px solid #337ab7; border-radius:20px;background-color: #FD7531;">查看详情</button>');
        }
        var html3 = ('</p>' +

            '</div>' +

            '</div>' +

            '</li>');

        return html1 + html2 + html3;
    }

});