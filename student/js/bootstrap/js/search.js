$(function(){
    //图片
if ($.cookie("headimg")) {
     $(".head img").attr("src",$.cookie("headimg"));
};    //获取页码
        function getmsgpage(num){
        $(".pagination").html("");
        $(".pagination").append('<li><a href="javascript::">&laquo;</a></li>');
                for(var i=0;i<num;i++){
                    var $a=$('<li><a href="javascript::">'+(i+1)+'</a></li>');
                    if (i===(num-1)) {
                        $a.addClass('active');
                    };
                    $(".pagination").append($a);
                }
         $(".pagination").append(' <li><a href="javascript::">&raquo;</a></li>');

        })

//所有课程1
$('.all').on('click', function() {
    //获取点击页码
$("body").delegate('.pagination>a', 'click', function(event) {
       getallmsglist($(this).html());
       $(this).addClass('active');
       $(this).siblings().removeClass("active");
       $.cookie('page', '$(this).html()');
});
     var page=$.cookie("page")||1;//点击哪页刷新还在哪页
    getallmsglist(page);
    function getallmsglist(number){
        $("#start .g-flow").html("");
        $.ajax({
            url: 'http://localhost:8080/getAllTeachingClassList',
            type: 'get',
            dataType: 'json',
            data: {"page="+number+"&content="+content+"&departmentId="+departmentId+"&schoolId="+schoolId},
            success:function(obj){
                var obj=obj.onGoingClasses;
                var num=obj.sumOfClasses;
                $.each(obj,function(key,value){
               var $lesson=createLesson(value);
                $("#start>.g-flow").append($lesson);
                })
                getmsgpage(num);
            }
            error:function(msg){
                alert(msg.status);
            }
        })
})
//正在开课
$('.going').on('click', function() {

    //获取点击页码
$("body").delegate('.pagination>a', 'click', function(event) {
       getgoingmsglist($(this).html());
       $(this).addClass('active');
       $(this).siblings().removeClass("active");
       $.cookie('page', '$(this).html()');
});
     var page=$.cookie("page")||1;//点击哪页刷新还在哪页
    getgoingmsglist(page);
    function getgoingmsglist(number){
        $("#doing .g-flow").html("");
        $.ajax({
            url: 'http://localhost:8080/getOnGoingTeachingClassList',
            type: 'get',
            dataType: 'json',
            data: {"page="+number+"&content="+content+"&departmentId="+departmentId+"&schoolId="+schoolId},
            success:function(obj){
                var obj=obj.onGoingClasses;
                var num=obj.sumOfClasses;
                $.each(obj,function(key,value){
               var $lesson=createLesson(value);
                $("#doing .g-flow").append($lesson);
                })
                getmsgpage(num);
            }
            error:function(msg){
                alert(msg.status);
            }
        })
})
$('.will').on('click', function() {
$("body").delegate('.pagination>a', 'click', function(event) {
       getwillmsglist($(this).html());
       $(this).addClass('active');
       $(this).siblings().removeClass("active");
       $.cookie('page', '$(this).html()');
});
     var page=$.cookie("page")||1;//点击哪页刷新还在哪页
    getwillgmsglist(page);
    function getwillmsglist(number){
        $("#will_start .g-flow").html("");
        $.ajax({
            url: 'http://localhost:8080/getUnStartTeachingClassList',
            type: 'get',
            dataType: 'json',
            data: {"page="+number+"&content="+content+"&departmentId="+departmentId+"&schoolId="+schoolId},
            success:function(obj){
                var obj=obj.onGoingClasses;
                var num=obj.sumOfClasses;
                $.each(obj,function(key,value){
               var $lesson=createLesson(value);
                $("#will_start .g-flow").append($lesson);
                })
                getmsgpage(num);
            }
            error:function(msg){
                alert(msg.status);
            }
        })
})
$('.finish').on('click', function() {
$("body").delegate('.pagination a', 'click', function(event) {
       getfinishmsglist($(this).html());
       $(this).addClass('active');
       $(this).siblings().removeClass("active");
       $.cookie('page', '$(this).html()');
});
     var page=$.cookie("page")||1;//点击哪页刷新还在哪页
    getfinishgmsglist(page);
    function getfinishmsglist(number){
        $("#finish .g-flow").html("");
        $.ajax({
            url: 'http://localhost:8080/getUnStartTeachingClassList',
            type: 'get',
            dataType: 'json',
            data: {"page="+number+"&content="+content+"&departmentId="+departmentId+"&schoolId="+schoolId},
            success:function(obj){
                var obj=obj.onGoingClasses;
                var num=obj.sumOfClasses;
                $.each(obj,function(key,value){
               var $lesson=createLesson(value);
                $("#finish .g-flow").append($lesson);
                })
                getmsgpage(num);
            }
            error:function(msg){
                alert(msg.status);
            }
        })
})
//学院
$('.institute').on('click', function() {
    if ( $.cookie('homeinstitute')) {
    $("#institute").val($.cookie('homeinstitute'));
    };
    else{
        $("#institute").val("");
    }
    $.ajax({
        type:'get',
        url:"http://localhost:8080/getAllSchools",
        dataType:"json",
        success:function(data){
          // console.log(data);
          $.each(obj, function(index, value) {
               var $institute=createEle(value);

                $(".institute").append($institute);
                var schoolId = $("#institute").get(0).selectedIndex;
                $.cookie("schoolId",schoolId);
          });
        },
        error:function(xhr){
            console.log(xhr.status);
        }

    }

});
    //系
$('.system').on('click', function() {
    $("#system").val("");
    var schoolId=$.cookie("schoolId");
    $.ajax({
        type:'get',
        url:"http://localhost:8080/getAllDepartments",
        dataType:"json",
        data:{"schoolId="+schoolId},
        success:function(data){
          // console.log(data);
          $.each(obj, function(index, value) {
               var $system=createEle(value);

                $(".system").append($system);
              var  departmentId = $("#system").get(0).selectedIndex;
              $.cookie("departmentId",departmentId);
          });
        },
        error:function(xhr){
            console.log(xhr.status);
        }
    }

});
$('.header-search button').on('click', function() {
    var $couName=$('header-search>input').val();
    $.cookie("couName",$couName);
})
    function createEle(obj){
        var $institute=$('<option value='+obj.deptId+'>'+obj.deptName+'</option>');
        return $institute;
    }
    function createLesson(obj){
        var $lesson=$('<div class="u-clist f-bg f-cb f-pr j-href ga-click">'+
                                '<div class="g-sd1">'+
                                    '<div class="u-img f-f1">'+

                                        '<img src="'+obj.couFile+'" style="height: 150px;width: 265px;"/>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="g-mn1"   onclick="window.open(\'information.html\')">'+
                                    '<div class="g-mn1c">'+
                                        '<div class="cnt f-pr">'+
                                            '<div class="t1 f-f0 f-cb">'+


                                                    '<span class="u-course-name f-thide">'+obj.tcName+'</span>'+

                                            '</div>'+
                                            '<div class="t2 f-fc3 f-nowrp f-f0">'+
                                                '<a class="t21 f-fc9" href="#">'+obj.schName+'</a>'+
                                                '<a class="f-fc9" href="#">'+obj.teaName+'</a>'+
                                            '</div>'+

                                                '<span class="p5 brief f-ib f-f0 f-cb ">'+obj.couIntro+
                                                '</span>'+

                                            '<div class="t2 f-fc3 f-nowrp f-f0 margin-top0">'+
                                                '<span class="u-icon-person f-fc9"><i class="fa fa-user-o"></i></span>'+
                                                '<span class="hot">3938人参加</span>'+
                                                '<div class="time not-open">'+
                                                    '<span class="f-icon clock u-icon-clock2"><i class="fa fa-clock-o"></i></span>'+
                                                    '<span class="txt">'+obj.tcStrdate+' 开课</span></div>'+
                                                    '<span class="join-in-course" id="UserLogout" >'+
                                                        '<button type="button" class="btn btn-warning attend_join" style="width: 80px; height: 25px;background-color: #FD7531;font-size: 12px;margin-right: -50px;line-height:7px;">立即参加</button>'+
                                                    '</span>'+

                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+

                        '</div>');
        return $lesson;
    }

})