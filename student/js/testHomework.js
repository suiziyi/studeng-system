$(function() {
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL);
    });
    // $(window.parent.document).find("#testIframe1").load(function () {
    //     var main = $(window.parent.document).find("#testIframe1");
    //     var thisheight = $(document).height() + 4500;
    //     main.height(thisheight < 1000 ? 1000 : thisheight);
    // });
    var teachingClassId=parent.$('input[name="teachingClassId"]').attr('value');
    $('.div_hidden input[name="teachingClassId"]').attr('value',teachingClassId);
    $('body').delegate('#div_title','click',function () {
        $(this).find("i").toggleClass("fa-caret-right").toggleClass("fa-caret-down");
        $("."+$(this).attr('value')).toggle();
        $.session.set('charId',$(this).attr('value'));
        $.session.set('charName',$(this).find('h3').text());
        var timeid=$(this).next('#title').find('.div_time').text();
        // console.log(timeid);
        // console.log($(this).find('.div_time').text());
        $.session.set('timeid',timeid);
    });
    $(".title1 .title2 .title3", parent.document).hide();

    getMsgTitle();

    function getMsgTitle() {
        $.ajax({
            type: 'get',
            url: "http://111.230.31.212/judgement/examination/getTestsAndHomeworksInfo",
            dataType: "json",
            data: {teachingClassId: parseInt(teachingClassId)},
            success: function (data) {
                if(data.code==401){
                    alert(data.message);
                    window.location.href('../Home/homepage.html');
                }
                else if(data.code==403){
                    alert(data.message);
                }
                // console.log(data);
                var str = '';
                $('.div_test_homework').empty();
                $.each(data, function (index, value) {
                    var arr=['第一章','第二章','第三章','第四章','第五章','第六章','第七章','第八章','第九章','第十章','第十一章','第十二章'];
                    var test=value.testInfos;
                    var homework=value.homeworkInfos;

                    str +='<div id="div_title" value="'+value.chaId+'" style="background-color:#eaeaea;">\n' +
                        '                <h3 style="color: #1B1B1B;font-size: 15px;padding: 10px;"><i class="fa fa-caret-right"></i>&nbsp;&nbsp;'+arr[index]+'&nbsp;&nbsp;'+value.chaName+'</h3>\n' +
                        '            </div>\n' +
                        '            <div id="title" class="'+value.chaId+'">\n' +
                        '                <div class="div_homework" >\n' +
                        '                    <ul>\n' +
                        '                        <li  style="margin-left: -20px;color:#719F00;">本章作业</li>\n' +
                        '                        <li>截止日期：<label>'+homework.endDate+'</label></li>';
                    if(homework.isTerminated==true){
                        str+='<li><a class="btn_default" href="##" style="color:white;background:gray; ">已结束</a></li>';
                    }
                    else{
                        str+='<li><a class="btn_default" href="homework_ch.html" >进入作业</a></li>';
                    }
                       str+= '                    </ul>\n' +
                        '                </div>\n' +
                        '                <div class="div_test">\n' +
                        '                    <ul>\n' +
                        '                        <li style="margin-left: -20px;color:#719F00;">本章测验</li>\n' +
                        '                        <li>截止日期：<label>'+test.endDate+'</label></li>\n' +
                        '                        <li>限定时间：<label class="div_time">'+test.timeLimit+'</label>分钟</li>\n' +
                        '                        <li>剩余测验次数：<label>'+test.remainTestCount+'</label></li>' ;

                    if(test.isTerminated==true){
                        str+='<li><a class="btn_default" href="##" style="color:white;background:gray; ">已结束</a></li>';
                    }
                    else{
                        if(test.remainTestCount!=0){
                            str+='<li><a class="btn_default" href="test.html" >进入测验</a></li>';
                        }
                        else{
                            str+='<li><a class="btn_default" href="##" style="color:white;background:gray; ">次数已完</a></li>';

                        }
                    }
                    str+=    '                    </ul>\n' +
                        '                </div>\n' +
                        '            </div>';

                });
                $('.div_test_homework').html(str);

            },
            error: function (xhr) {
                console.log(xhr.status);
            }

        });
    }

});
