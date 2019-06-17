$(function () {
    var teachingClassId=parent.$('input[name="teachingClassId"]').attr('value');
$.ajax({
    type:'get',
    url:"http://111.230.31.212/judgement/queryScore/getScores",
    dataType:'json',
    data:{
        teachingClassId:parseInt(teachingClassId)
    },
    success:function (obj) {
        // console.log(obj);
        $('.div_grade ').empty();
        var $video=createVideo(obj);
        $('.div_grade ').html($video);
    },
    error:function (msg) {
        console.log(msg.status);
    }
})

    function createVideo(obj) {
        var grade='<div>\n' +
            '                                <h4 style="color:red;font-size: 18px;text-align: left; ">综合总成绩</h4>\n' +
            '\n' +
            '                                <h4 style="color:black;font-size: 15px;margin-top: 15px;">&nbsp;&nbsp;'+obj.totalScore+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+obj.level+'</h4>\n' +
            '\n' +
            '                            </div>\n' +
            '                            <hr style="margin-bottom: 30px; "/>\n' +
            '                            <div>\n' +
            '                                <table class="table table-striped" >\n' +
            '                                    <thead>\n' +
            '                                        <tr>\n' +
            '                                            <th>课下作业</th>\n' +
            '                                            <th>单元测试</th>\n' +
            '                                            <th>课下练习</th>\n' +
            '                                            <th>课堂活跃</th>\n' +
            '                                            <th>期中考试</th>\n' +
            '                                            <th>期末考试</th>\n' +
            '                                            <th>综合成绩</th>\n' +
            '                                        </tr>\n' +
            '                                    </thead>\n' +
            '                                    <tbody>\n' +
            '                                        <tr>\n' +
            '                                            <td>'+obj.homeworkScore+'</td>\n' +
            '                                            <td>'+obj.testScore+'</td>\n' +
            '                                            <td>'+obj.practiceScore+'</td>\n' +
            '                                            <td>'+obj.bbsScore+'</td>\n' +
            '                                            <td>'+obj.midScore+'</td>\n' +
            '                                            <td>'+obj.lastScore+'</td>\n' +
            '                                            <td style="color: #E31818;">'+obj.totalScore+'</td>\n' +
            '                                        </tr>\n' +
            '                                    </tbody>\n' +
            '                                </table>\n' +
            '\n' +
            '                            </div>\n' +
            '                           <!--<hr style="margin-bottom: 40px; dotted"/>-->\n' +
            '\n' +
            '                            <div class="cnt" style="margin-top:70px ;">\n' +
            '                                <h1 style="color: red;font-size: 25px;"><b>评分标准</b></h1>\n' +
            '                            </div>\n' +
            '                            <hr style="margin-bottom: 30px; "/>\n' +
            '                               <p style="margins-bottom: 50px;">本课程的成绩由课下作业、单元测验、期中考试、期末考试四部分组成。其中课下作业占20%，单元测验占30%，期中考试占20%，期末考试占30%。采用百分制计分，60分以下为“不及格”，60分及以上为“及格”，85分及以上为“优秀”。\n' +
            '                               </p>\n' +
            '                            <hr style="margin-top: 80px; "/>';
        return grade;
    }
})