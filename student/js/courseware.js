$(function () {
    if ($.cookie("headimg")) {
        $(".head img").attr("src", $.cookie("headimg"));
    }
    $(".title1 .title2 .title3", parent.document).hide();
    var teachingClassId = parent.$('input[name="teachingClassId"]').attr('value');
    getmsgpage();

    function getmsgpage() {
        $.ajax({
            type: 'get',
            url: "http://111.230.31.212/judgement/courseWare/getChaptersWithStates",
            dataType: "json",
            data: {
                teachingClassId: parseInt(teachingClassId)
            },
            success: function (obj) {
                if(obj.code==401){
                    alert(obj.message);
                    window.location.href('../Home/homepage.html');
                }
                else if(obj.code==403){
                    alert(obj.message);
                }
                $('.panel-group').empty();
                $.each(obj, function (index, value) {
                    var $title = createTitle(value);
                    $('.panel-group').append($title);
                })
            },
            error: function (xhr) {
                console.log(xhr.status);
            }

        });
    }

    $('body').delegate('.panel-heading', 'click', function () {
        var id = $('.input_hidden').attr('value');
        $('#' + id).parents('.panel-default').find('i').attr('class', 'fa fa-caret-right');
        // $($.session.get('chapterId')).parents('.panel-default').find('i').attr('class','fa fa-caret-right');
        var chapterId = $(this).attr('value');
        var $this = $(this);
        // $('.input_hidden').append('<input type="hidden" name="chapterId" value="'+chapterId+'"/>');
        $('.input_hidden').attr('value', chapterId);
        var chapterName = $(this).find('a').text();
        parent.$('.div_hidden input[name="chapterName"]').attr('value', chapterName);
        parent.$('.div_hidden input[name="chapterId"]').attr('value', chapterId);

        $.ajax({
            type: 'get',
            url: "http://111.230.31.212/judgement/courseWare/getSectionsWithAllInfo",
            dataType: 'json',
            data: {
                teachingClassId: parseInt(teachingClassId),
                chapterId: parseInt(chapterId)
            },
            success: function (obj) {
                if(obj.code==401){
                    alert(obj.message);
                    window.location.href('../Home/homepage.html');
                }
                else if(obj.code==403){
                    alert(obj.message);
                }
                $('.panel-collapse').empty();
                var str = '';
                $.each(obj, function (index, value) {
                    str += createVideo(value);
                })
                $this.parents('.panel-default').append('<div id="' + chapterId + '" class="panel-collapse collapse in">\n' +
                    '                                        <div class="panel-body">' + str + '</div></div>');
            },
            error: function (msg) {
                console.log(msg.status);
            }
        })
        $this.find('i').attr('class', 'fa fa-caret-down');

    });

    $('body').delegate('.accordion-a', 'click', function () {
        var sectionId = parseInt($(this).attr('value'));
        var sectionName = $(this).text();
        parent.$('.div_hidden input[name="sectionName"]').attr('value', sectionName);
        $('input[name="sectionId"]').attr('value', sectionId);
        url = "learnvideo.html?sectionId=" + sectionId;//此处拼接内容
        window.location.href = url;
    })
    $('body').delegate('.div_video span', 'click', function () {
        event.stopPropagation();
        var sectionId = parseInt($(this).parents('.div_video').prev('a').attr('value'));
        var sectionName = $(this).parents('.accordion-a').text();
        parent.$('.div_hidden input[name="sectionName"]').attr('value', sectionName);
        url = "learnvideo.html?sectionId=" + sectionId + "&videoid=" + $(this).attr('name');//此处拼接内容
        // console.log(url);
        window.location.href = url;
    })

    //章
    function createTitle(obj) {
        var arr = ['第一章', '第二章', '第三章', '第四章', '第五章', '第六章', '第七章', '第八章', '第九章', '第十章', '第十一章', '第十二章'];
        var html = '<div class="panel panel-default">';
        if (obj.status == 0) {
            html += '<div class="panel-heading" value="' + obj.chaId + '">';
        }
        else if (obj.status == 1) {
            html += '<div class="panel-heading" style="background-color: #fdf701" value="' + obj.chaId + '>';
        }
        else {
            html += '<div class="panel-heading" style="background-color: #00CD00" value="' + obj.chaId + '>';
        }
        html += '                                        <h4 class="panel-title">\n' +
            '                                            <a role="button" data-toggle="collapse" data-parent="#accordion" href="#' + obj.chaId + '"><i class="fa fa-caret-right"></i>\n' +
            '                                                ' + arr[obj.chaId - 1] + '&nbsp;&nbsp;' + obj.chaName + '\n' +
            '                                            </a>\n' +
            '                                        </h4>\n' +
            '                                    </div>\n' +
            '                                </div>';
        return html;
    }

    //节
    function createVideo(obj) {
        var ppt = obj.studies;
        var video = obj.videos;
        var html = '<div><a class="accordion-a" href="##" value="' + obj.secId + '">';
        if (obj.status == 0) {
            //节前面元
            html += '<span class="fa fa-circle-o" style="color:#b6babb;"></span>&nbsp;&nbsp;&nbsp;&nbsp;' + obj.secName + '</a> <div class="div_video">';
        }
        else if (obj.status == 1) {
            html += '<span class="fa fa-adjust" style="color:#00CD00;"></span>&nbsp;&nbsp;&nbsp;&nbsp;' + obj.secName + '</a> <div class="div_video">';

        }
        else {
            html += '<span class="fa fa-circle" style="color:#00CD00;"></span>&nbsp;&nbsp;&nbsp;&nbsp;' + obj.secName + '</a> <div class="div_video">';

        }
        //小图标
        $.each(video, function (index, value) {
            if (value.status == 0) {
                html += '<span name="' + (index + 1) + '" value="' + value.lastWatchTime + '" title="' + value.vidName + '" data-id="' + value.vidUuid + '"  class="glyphicon glyphicon-play-circle" style="color:#b6babb;"></span>&nbsp;';

            }
            else if (value.status == 1) {
                html += '<span  name="' + (index + 1) + '" value="' + value.lastWatchTime + '" title="' + value.vidName + '" data-id="' + value.vidUuid + '" class="glyphicon glyphicon-play-circle" style="color:#fdf701;"></span>&nbsp;';

            }
            else {
                html += '<span  name="' + (index + 1) + '" value="' + value.lastWatchTime + '" title="' + value.vidName + '" data-id="' + value.vidUuid + '" class="glyphicon glyphicon-play-circle" style="color:#00cd00;"></span>&nbsp;';

            }

        })
        $.each(ppt, function (index, value) {
            html += '<span  name="' + (video.length + index + 1) + '" title="' + value.studName + '" data-id="' + value.studUuid + '"  class="fa fa-file-text-o" style="color:#b6babb;"></span>';
        })
        html += '</div>';
        return html;

    }

});