$(function () {
    $(".title1 .title2 .title3", parent.document).hide();
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  // 匹配目标参数
        if (r != null) return unescape(r[2]); return null; // 返回参数值
    }

    var teachingClassId=parent.$('input[name="teachingClassId"]').attr('value');
    // var sectionId=getUrlParam('sectionId');
    var sectionId = getUrlParam('sectionId');
    var videoid = getUrlParam('videoid');
    $('.input_hidden input[name="video"]').attr('value',videoid);
    var chapter=parent.$('.div_hidden input[name="chapterId"]').attr('value')||1;
    $('.input_hidden input[name="section"]').attr('value',sectionId);
    var videoEl=null;
    window.addEventListener("load",function () {
        videoEl=document.getElementById('videoid');
    })
    //课件点击节进入
    getMsgvideo();
    function getMsgvideo() {
            $.ajax({
                type: 'get',
                url: "http://111.230.31.212/judgement/courseWare/getInfoOfOneSection",
                dataType: 'json',
                data: {
                    teachingClassId: parseInt(teachingClassId),
                    sectionId: parseInt(sectionId)
                },
                success: function (obj) {
                    if (obj.code == 401) {
                        alert(obj.message);
                        window.location.href('../Home/homepage.html');
                    }
                    else if (obj.code == 403) {
                        alert(obj.message);
                    }
                    $('.u-learn-moduletitle ').empty();
                    var $video = createVideo(obj);
                    $('.u-learn-moduletitle ').html($video);
                    //默认播放第一个
                    if (videoid != null) {
                        $('.video li').eq(parseInt(videoid - 1)).addClass('current');
                        $('.video li').eq(parseInt(videoid - 1)).find('span').css('color', '#fff');
                        $('.video li').eq(0).removeClass('current');
                        $('.video li').eq(0).find('span').css('color', '#b6babb');
                    }
                    else {
                        $('.video li').eq(0).addClass('current');
                        $('.video li').eq(0).find('span').css('color', '#fff');

                    }
                    setTime();

                },
                error: function (msg) {
                    console.log(msg.status);
                }
            })

    }

    //章
    function getMsgchapter() {
        $.ajax({
            type:'get',
            url:"http://111.230.31.212/judgement/courseWare/getAllChaptersOfOneTeachingClass",
            dataType:'json',
            data:{
                teachingClassId:parseInt(teachingClassId)
            },
            success:function (obj) {
                if(obj.code==401){
                    alert(obj.message);
                    window.location.href('../Home/homepage.html');
                }
                else if(obj.code==403){
                    alert(obj.message);
                }
                $('.div_chapter ').empty();
                var arr=['第一章','第二章','第三章','第四章','第五章','第六章','第七章','第八章','第九章','第十章','第十一章','第十二章'];
                var str='';
                $.each(obj,function (index,value) {
                    str+='<li><a href="##" value="'+value.chaId+'">'+arr[index]+'&nbsp;'+value.chaName+'</a></li>';
                })
                $('.div_chapter ').html(str);
            },
            error:function (msg) {
                console.log(msg.status);
            }
        })
    }
    //节
    function getMsgsection() {

        var chapter=parent.$('.div_hidden input[name="chapterId"]').attr('value')||1;
        $.ajax({
            type:'get',
            url:"http://111.230.31.212/judgement/courseWare/getAllSectionsOfOneChapter",
            dataType:'json',
            data:{
                teachingClassId:parseInt(teachingClassId),
                chapterId:parseInt(chapter)
            },
            success:function (obj) {
                if(obj.code==401){
                    alert(obj.message);
                    window.location.href('../Home/homepage.html');
                }
                else if(obj.code==403){
                    alert(obj.message);
                }
                $('.div_section ').empty();
                var str='';
                $.each(obj,function (index,value) {
                    str+='<li><a  href="##" value="'+value.secId+'">'+value.secName+'</a></li>';
                })
                $('.div_section ').html(str);

            },
            error:function (msg) {
                console.log(msg.status);
            }
        })
    }
    //点击章
    $('body').delegate('.li_chapter .dropdown-toggle ','click',function () {
        getMsgchapter();
    })
    //点击节
    $('body').delegate('.li_section .dropdown-toggle ','click',function () {
        getMsgsection();
    })
    //点击章下方
    $('body').delegate('.div_chapter li','click',function () {
        // $('.input_hidden input[name="chapter"]').attr('value',$(this).find('a').attr('value'));
        parent.$('.div_hidden input[name="chapterId"]').attr('value',$(this).find('a').attr('value'));
        $(this).parents('.dropdown').find('.dropdown-toggle').text($(this).find('a').text());
    })
//点击节下方
    $('body').delegate('.div_section li','click',function () {
        $('.input_hidden input[name="section"]').attr('value',$(this).find('a').attr('value'));
        $(this).parents('.dropdown').find('.dropdown-toggle').text($(this).find('a').text());
        var sectionId=$('.input_hidden input[name="section"]').attr('value');
            $.ajax({
                type: 'get',
                url: "http://111.230.31.212/judgement/courseWare/getInfoOfOneSection",
                dataType: 'json',
                data: {
                    teachingClassId: parseInt(teachingClassId),
                    sectionId: parseInt(sectionId)
                },
                success: function (obj) {
                    $('.video').empty();
                    var $video = createSection(obj);
                    $('.video ').html($video);
                    if (videoid != null) {
                        $('.video li').eq(parseInt(videoid - 1)).addClass('current');
                        $('.video li').eq(parseInt(videoid - 1)).find('span').css('color', '#fff');
                        $('.video li').eq(0).removeClass('current');
                        $('.video li').eq(0).find('span').css('color', '#b6babb');
                    }
                    else {
                        $('.video li').eq(0).addClass('current');
                        $('.video li').eq(0).find('span').css('color', '#fff');

                    }
                    setTime();

                },
                error: function (msg) {
                    console.log(msg.status);
                }
            })

    })
    //点击视频
    $('body').delegate('.video li','click',function () {
        $('.input_hidden input[name="video"]').attr('value',$(this).index()+1);
        var lastWatchTime=$(this).attr('value');
        var address=$(this).attr('data-id');
        $('#videoid').find('source').attr('src',address);

        $(this).addClass('current');
        $(this).find('span').css('color','#fff');
        $(this).siblings('li').removeClass('current');
        $(this).siblings('li').find('span').css('color','#bab6bb');
        var video=document.getElementById("videoid");
        video.src=address ;
        setTime();
    })
    $('body').delegate('.ppt','click',function () {
        $('.videoPpt').empty();
        // $('.videoPpt').html("<iframe  src='https://view.officeapps.live.com/op/view.aspx?src="+$(this).attr('data-id')+"' scrolling='auto' width='820' height='440' >\n" +
        //     "</iframe>");
        $('.videoPpt').html('<a href="'+$(this).attr('data-id')+'"></a>');
    })
    //上传视频进度
    window.setInterval(function () {
        var currentTime=Math.floor(videoEl.currentTime);
        console.log(videoEl.currentTime);//不能捕捉当前时间
        console.log(currentTime);
        console.log(videoEl.duration);
        updateVideoTime(currentTime);
    },10000);
    //改变视频状态
    window.setInterval(function () {
        var videoStatus=0;
        var currentTime=Math.floor(videoEl.currentTime);
        var duration=videoEl.duration;//s

        if(currentTime==0){
            videoStatus=0;
        }
        else if(currentTime<duration){
            videoStatus=1;
        }
        else if(duration==currentTime){
            videoStatus=2;
        }
        updateStatus(videoStatus);
    },300000);
    //传过来的时间是HH:mm:ss格式
function updateVideoTime(currentTime) {
    var sectionId1=$('.input_hidden input[name="section"]').attr('value');
    var videoid1=parseInt($('.input_hidden input[name="video"]').attr('value'))||1;
    var current=transTime(currentTime);
    $.ajax({
        type:'get',
        url:"http://111.230.31.212/judgement/courseWare/updateVideoTime",
        data:{
            teachingClassId:parseInt(teachingClassId),
            sectionId:parseInt( sectionId1),
            chapterId:parseInt(chapter),
            videoId:videoid1,
            videoTime:current
        },
        success:function (obj) {
            console.log(obj);
        },
        error:function (msg) {
            console.log(msg.status);
        }
    })
}

    //videoStatus的0表示没看过，1表示看了一部分，2表示看完
    function updateStatus(videoStatus) {
        var sectionId1=$('.input_hidden input[name="section"]').attr('value');
        var videoid1=parseInt($('.input_hidden input[name="video"]').attr('value'))||1;
        $.ajax({
            type: 'get',
            url: "http://111.230.31.212/judgement/courseWare/updateStatus",
            dataType: 'json',
            data: {
                teachingClassId: parseInt(teachingClassId),
                sectionId: parseInt(sectionId1),
                chapterId: parseInt(chapter),
                videoId:videoid1,
                videoStatus: videoStatus
            },
            success: function (obj) {
                console.log(obj);
            },
            error: function (msg) {
                console.log(msg.status);
            }
        })
    }

    function createSection(obj) {
        var ppt=obj.studies;
        var video=obj.videos;
        var html= '<ul class="unitslist f-cb">' ;
        if(video!=null){
            $.each(video,function (index,value) {
                if(value.status==0){
                    html+='<li class="f-fl" value="'+value.lastWatchTime+'" title="'+value.vidName+'" data-id="'+value.vidUuid+'"  style="width:'+(100/(video.length+ppt.length))+'%;" ><span class="glyphicon glyphicon-play-circle" style="color:#b6babb;" ></span></li>' ;

                }
                else if(value.status==1){
                    html+='<li class="f-fl" value="'+value.lastWatchTime+'" title="'+value.vidName+'"  data-id="'+value.vidUuid+'" style="width:'+(100/(video.length+ppt.length))+'%;" ><span class="glyphicon glyphicon-play-circle" style="color:#fdf701;" ></span></li>' ;

                }
                else{
                    html+='<li class="f-fl " value="'+value.lastWatchTime+'" title="'+value.vidName+'" data-id="'+value.vidUuid+'"   style="width:'+(100/(video.length+ppt.length))+'%;" ><span class="glyphicon glyphicon-play-circle" style="color:#00cd00;" ></span></li>' ;

                }
            })
        }

        if(ppt!=null){
            $.each(ppt,function (index,value) {

                html+='<li class="f-fl " value="'+value.studId+'" title="'+value.vidName+'"  data-id="'+value.studUuid+'"  style="width:'+(100/(video.length+ppt.length))+'%;" ><span class="fa fa-file-text-o" style="color:#b6babb;"></span></li>' ;
            })
        }
        html+='                                        </ul><div class="videoPpt">\n'+
            '<video id="videoid" width="820" height="440" controls  value="'+video[0].lastWatchTime+'">\n' +
            '     <source src="'+video[0].vidUuid+'" type="video/mp4">\n' +
            '    <source src="'+video[0].vidUuid+'" type="video/mp3">\n' +

            '  </video></div>\n' +
            '                                    </div>\n' +
            '                                </div>';

        return html;
    }
    function createVideo(obj) {
        var chapterName= parent.$('input[name="chapterName"]').attr('value');
        // var chapterName= parent.$('input[name="sectionName]').attr('value');
        var ppt=obj.studies;
        var video=obj.videos;
        //章节
        var html='<div class="j-breadcb f-fl">\n' +
            '                                    <ul class="nav nav-tabs">\n' +
            '                                        <li class="dropdown li_chapter">\n' +
            '                                            <a class="dropdown-toggle" data-toggle="dropdown" href="#">\n' +
            '                                                    '+chapterName+' <span class="caret"></span>\n' +
            '                                                </a><ul class="dropdown-menu div_chapter"></ul>\n' +
            '                                        </li>\n' +
            '                                        <li class="dropdown li_section" >\n' +
            '                                            <a class="dropdown-toggle" data-toggle="dropdown" href="#">\n' +
            '                                                    '+obj.secName+' <span class="caret"></span>\n' +
            '                                                </a><ul class="dropdown-menu div_section"></ul>\n' +
            '                                        </li>\n' +
            '                                    </ul>\n'+
            '                                    <div class="video">\n' +
            '                                        <ul class="unitslist f-cb">' ;
        //视屏变绿
        if(video!=null){
            $.each(video,function (index,value) {
                if(value.status==0){
                    html+='<li class="f-fl" value="'+value.lastWatchTime+'" title="'+value.vidName+'" data-id="'+value.vidUuid+'"  style="width:'+(100/(video.length+ppt.length))+'%;" ><span class="glyphicon glyphicon-play-circle" style="color:#b6babb;" ></span></li>' ;

                }
                else if(value.status==1){
                    html+='<li class="f-fl" value="'+value.lastWatchTime+'" title="'+value.vidName+'"  data-id="'+value.vidUuid+'" style="width:'+(100/(video.length+ppt.length))+'%;" ><span class="glyphicon glyphicon-play-circle" style="color:#fdf701;" ></span></li>' ;

                }
                else{
                    html+='<li class="f-fl " value="'+value.lastWatchTime+'" title="'+value.vidName+'" data-id="'+value.vidUuid+'"   style="width:'+(100/(video.length+ppt.length))+'%;" ><span class="glyphicon glyphicon-play-circle" style="color:#00cd00;" ></span></li>' ;

                }
            })
        }

        if(ppt!=null){
            $.each(ppt,function (index,value) {

                html+='<li class="f-fl ppt" value="'+value.studId+'" title="'+value.vidName+'"  data-id="'+value.studUuid+'"  style="width:'+(100/(video.length+ppt.length))+'%;" ><span class="fa fa-file-text-o" style="color:#b6babb;"></span></li>' ;
            })
        }
        //视屏播放
        if(videoid!=null){
            if(videoid==ppt.length+video.length){
                html+='                                        </ul><div class="videoPpt">\n'+
                    '<a href="'+video[parseInt(videoid-1)].vidUuid+'"></a></div>\n' +
                    '                                    </div>\n' +
                    '                                </div>';
            }
            else{
                html+='                                        </ul><div class="videoPpt">\n'+
                    '<video id="videoid" width="820" height="440" controls value="'+video[parseInt(videoid-1)].lastWatchTime+'">\n' +
                    '     <source src="'+video[parseInt(videoid-1)].vidUuid+'" type="video/mp4">\n' +
                    '    <source src="'+video[parseInt(videoid-1)].vidUuid+'" type="video/mp3">\n' +
                    '  </video></div>\n' +
                    '                                    </div>\n' +
                    '                                </div>';
            }

            $('.input_hidden input[name="address"]').attr("src",video[parseInt(videoid-1)].vidUuid);
        }
        else{
            html+='                                        </ul><div class="videoPpt">\n'+
                '<video id="videoid" width="820" height="440" controls value="'+video[0].lastWatchTime+'" >\n' +
                '     <source src="'+video[0].vidUuid+'" type="video/mp4">\n' +
                '    <source src="'+video[0].vidUuid+'" type="video/mp3">\n' +
                '  </video></div>\n' +
                '                                    </div>\n' +
                '                                </div>';
            $('.input_hidden input[name="address"]').attr("src",video[0].vidUuid);
        }

        return html;
    }
    function setTime() {
        var video=document.getElementById("videoid");
        var lastWatchTime=$('#videoid').attr('value');
        var arr=lastWatchTime.split(":");
        var a=[];
        for(var i=0;i<arr.length;i++){
            a.push(parseInt(arr[i]));
        }
        // console.log(a);
        var time=3600*a[0]+60*a[1]+a[2];
        // console.log(time);
        video.currentTime=time;
        video.play();
    }

    function transTime(value) {
        var time = "";
        var h = parseInt(value / 3600);
        value %= 3600;
        var m = parseInt(value / 60);
        var s = parseInt(value % 60);
        if(h<10){
            h='0'+h;
        }
        if(m<10){
            m='0'+m;
        }
        if (s<10){
            s='0'+s;
        }
        time = h + ":" + m + ":" + s;
        return time;
    }
})