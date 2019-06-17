$(function(){
    if ($.cookie("headimg")) {
        // language=JQuery-CSS
        $(".head img").attr("src", $.cookie("headimg"));
    }
    getMsgbrow();
    function getMsgbrow(){
        $(".prog1").html("");
        var teachingClassId=parent.$('.div_hidden input').attr('value');
        $.ajax({
            url: 'http://111.230.31.212/judgement/announcement/getAllAnnouncements',
            type: 'get',
            dataType: 'json',
            async: true,
            data: {
                teachingClassId: teachingClassId
            },
            success: function (obj) {
                if(obj.code==401){
                    alert(obj.message);
                    window.location.href('../Home/homepage.html');
                }
                else if(obj.code==403){
                    alert(obj.message);
                }
                $.each(obj, function (key, value) {
                    var $brow = createBrow(value);
                    $(".prog1").append($brow);
                    // "tcStatus": 1,
                });

            },
            error: function (msg) {
                console.log(msg.message);
            }
        })
    }
    getMsgHot();
    function getMsgHot(){
        $(".hot .figure").html("");
        $.ajax({
            url: 'http://111.230.31.212/judgement/hotCourse/getHotCourses',
            type: 'get',
            dataType: 'json',
            async: true,
            // data: {
            //     limit: 3
            // },
            success: function (obj) {

                // console.log(obj);
                $.each(obj, function (key, value) {
                    var $figure = createHot(value);
                    $(".hot .figure").append($figure);

                });

            },
            error: function (msg) {
                console.log(msg.message);
            }
        })
    }
    $("body").delegate('.hot figure', 'click', function (event) {
        var obj=parseInt($(this).attr("value"));
        url = "../CourseInfo/infor3.html?teachingClassId="+obj;//此处拼接内容
        window.open (url) ;

    });
    function createBrow(obj){
            var $brow=$('<p class="text-left" style="color: #2b2b2b;font-size: 19px;"><strong>'+obj.annTitle+'</strong></p><br/>\n'+
                '<p class="text-left" style="color: #424042;font-size: 15px;">'+obj.annContent+'</p><br/>\n'+
                '<p class="text-lreght" style="color: #424042;font-size: 15px;">'+obj.annTime+'</p> <br/><hr/>');
            return $brow;
    }
    function createHot(obj){
            var $hot=$(' <figure value="'+obj.tcId+'">\n' +
                '                <img src="'+obj.hcPic+'">\n' +
                '                <figcaption>'+obj.couName+'</figcaption>\n' +
                '                </figure>');
            return $hot;
    }
});