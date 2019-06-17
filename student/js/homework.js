
$(function(){

    // $(window.parent.document).find("#testIframe1").load(function () {
    //     var main = $(window.parent.document).find("#testIframe1");
    //     var thisheight = $(document).height() + 400;
    //     main.height(thisheight);
    // });
    var teachingClassId=parent.$('input[name="teachingClassId"]').attr('value');
    var chaId=$.session.get('charId');
    var chaName= $.session.get('charName');

    $('.prog .div_h2').html('<h2 style="color:red;font-size: 25px;display: inline;"><b>\n' +
        '                                           <span>'+chaName+'</span>——作业</b>\n' +
        '                                        </h2>');
    //创建索引
    $.ajax({
        type: 'get',
        url: "http://111.230.31.212/judgement/examination/getHomeworkQuestionIds",
        dataType: "json",
        data: {
            teachingClassId: parseInt(teachingClassId),
            chapterId:parseInt(chaId)
        },
        success: function (data) {
            if(data.code==401){
                alert(data.message);
                window.location.href('../Home/homepage.html');
            }
            else if(data.code==403){
                alert(data.message);
            }
            // console.log(data);
            var objt = data.partOfBlankQuestions;
            var objb = data.partOfProgrammingQuestions;
            var objx = data.partOfSelectionQuestions;
            var x=0;
            var t=0;
            var arr=[];
            $('.div_titleid ul').empty();
            if(objx!=null||objx!=undefined) {
                $.each(objx, function (index, value) {
                     var select=createContent(index+1, value);
                     x++;
                    $('.div_titleid ul').append(select);
                    arr.push(value.exeId);
                });

            }
            if(objt!=null||objt!=undefined) {
                $.each(objt, function (index, value) {
                    var blank=createContent(index+1+x, value);
                    t++;
                    $('.div_titleid ul').append(blank);
                    arr.push(value.exeId);
                });
            }
            if(objb!=null||objb!=undefined) {
                $('.div_program').empty();
                $.each(objb, function (index, value) {
                    var program=createContent(index+1+x+t, value);
                    $('.div_titleid ul').append(program);
                    arr.push(value.exeId);
                });

            }
            $('.input_hidden input[name="index"]').attr('value',arr);
            getFirstPage();
        },
        error: function (xhr) {
            console.log(xhr.status);
        }

    });
    //页码创建
  function createContent(index,value){
      if(value.state==0){
          var $page=$('<li value="'+value.exeType+'" ><a href="'+value.exeId+'"></a>'+index+'</li>');

      }
      else if(value.state==1){
          var $page=$('<li value="'+value.exeType+'" style="background-color: #ff2208;color: white;" ><a href="'+value.exeId+'"></a>'+index+'</li>');

      }
     else{
          var $page=$('<li value="'+value.exeType+'" style="background-color: #36b729;color: white;"><a href="'+value.exeId+'"></a>'+index+'</li>');

      }
      return $page;
  }
//默认第一页显示
  function getFirstPage(){
      var str=$('.input_hidden input[name="index"]').attr('value');
      // var exeId=$('.input_hidden input[name="1"]').attr('value');
      var arr=str.split(',');
      console.log(arr);
      console.log(str);
      var exeId=arr[0]
      $('.input_hidden input[name="exeId"]').attr('value',exeId);
      $.ajax({
          type: 'get',
          url: "http://111.230.31.212/judgement/examination/getExerciseDetailByExeId",
          dataType: "json",
          data: {
              teachingClassId: parseInt(teachingClassId),
              exeId: parseInt(exeId)
          },
          success: function (data) {
              if(data.code==401){
                  alert(data.message);
                  window.location.href('../Home/homepage.html');
              }
              else if(data.code==403){
                  alert(data.message);
              }
              else if(data.code==404){
                  alert(data.message);
              }
              // console.log($.session.get('questionId'));
              // console.log(typeof($.session.get('questionId')));
              // console.log(data);
              $('.div_question').empty();
              if (data != null && data != undefined) {
                  createSelect(1,data);
              }

          },
          error: function (xhr) {
              console.log(xhr.status);
          }
      });
      $('.div_titleid li').eq(0).addClass('active');
  }

  //点击页码获得题目，选择填空编程
    $('body').delegate('.div_titleid li','click',function (event) {
        var exeId = $(this).find('a').attr('href');
        // console.log(exeId);
        $('.input_hidden input[name="exeId"]').attr('value', exeId);
        // console.log($('.div_hidden input[name="exeId"]').attr('value'));
        var id=$(this).index();
        var state='';
        if (exeId != null) {
            $.ajax({
                type: 'get',
                url: "http://111.230.31.212/judgement/examination/getExerciseDetailByExeId",
                dataType: "json",
                data: {
                    teachingClassId: parseInt(teachingClassId),
                    exeId: parseInt(exeId)
                },
                success: function (data) {
                    if(data.code==401){
                        alert(data.message);
                        window.location.href('../Home/homepage.html');
                    }
                    else if(data.code==403){
                        alert(data.message);
                    }
                    else if(data.code==404){
                        alert(data.message);
                    }
                    // console.log($.session.get('questionId'));
                    // console.log(typeof($.session.get('questionId')));
                    // console.log(data);
                    $('.div_question').empty();
                    if (data != null && data != undefined) {
                         createSelect(id+1,data);
                         state=data.state;
                    }

                },
                error: function (xhr) {
                    console.log(xhr.status);
                }

            });
        }
        $(this).addClass('active');
        $(this).siblings('li').removeClass('active');

    })
        function createSelect(id,obj) {
            // console.log(obj);
            var content = obj.options;
            if(obj.exeType=="编程题"){
                var html='<div class="div_program"> <div class="question">\n' +
                    '                                    <label class="exe_order">'+id+'</label>\n' +
                    ' <label class="exe_type">'+obj.exeType+'</label><label class="score">(<span>'+obj.score+'</span>分)</label>';
                for(var i=0;i<obj.difficulty;i++){
                    html+='<span class="fa fa-star fa-2x " style="color:#FFC125;"></span>';
                }
                for(var i=0;i<5-obj.difficulty;i++){
                    html+='<span class="fa fa-star-o fa-2x" style="color:#FFC125;"></span>';
                }
                html+='                                <div class="button">\n' +
                    '                                <ul>\n' +
                    '                                    <li class="button_1"><i class="fa fa-angle-left fa-2x one"></i><a href="##">上一题</a></li>\n' +
                    '                                    <li class="button_2"><a href="##">下一题</a><i class="fa fa-angle-right fa-2x two"></i></li>\n' +
                    '                                </ul>\n' +
                    '                                </div>\n' +
                    '                            </div>\n' +
                    '                                <br>\n' +
                    '                            <div class="div_content">\n' +
                    '                                <strong style="font-size: 18px;">题目内容:</strong>\n' +
                    '                                <p style="font-size: 12px;margin-top: 6px; width:100%;background-color: #E3F8FF; min-height:30px;line-height:30px;">'+obj.content+'</p>\n' +
                    '                            </div>\n' +
                    '                            <div class="div_out" style="margin-top: 30px ;">\n' +
                    '                                <strong style="font-size: 18px;">输出样例:</strong>\n' +
                    '                                <p style="font-size: 12px;margin-top: 6px;color: #666;width:100%;background-color: #E3F8FF; min-height: 30px;line-height:30px;">'+obj.ioExplain+'</p>\n' +
                    '                            </div>\n' +
                    '                            <div class="div_edit" style="margin-top: 30px ;">\n' +
                    '                            <strong style="font-size: 18px;">代码编辑：</strong>\n' +
                    '                              <pre id="code" class="ace_editor" style="height:400px;">\n' +
                    '                              <textarea  class="ace_text-input" style="height:400px; width:688px;">\n' +
                    '                              </textarea></pre>\n' +
                    '                            </div>\n' +
                    '                            <div class="div_time">\n' +
                    '                                <strong style="font-size: 12px;">时间限制:</strong>\n' +
                    '                        <label style="font-size: 12px;margin-top: 6px;color: #666;">'+obj.timeLimit+'s</label>\n' +
                    '                                <strong style="margin-left:36px;font-size: 12px;">内存限制:</strong>\n' +
                    '                                <label style="font-size: 12px;margin-top: 6px;color: #666;">'+obj.memoryLimit+'k</label>\n' +
                    '                            </div>';

                if(obj.testInformation!=null){
                    var str='';
                    var arr=obj.testInformation.split('\n');
                    for(var i=0;i<arr.length;i++){
                        str+='<p class="exe_content">'+arr[i]+'</p>';
                    }
                    // console.log(arr);
                    // console.log(obj.testInformation);
                    html+='<div class="div_return" style="margin-top: 30px"><strong style="font-size: 18px;">代码反馈:</strong>'+str+'</div> ';
                }
                else{
                    html+='<div class="div_return" style="margin-top: 30px"></div> ';
                }
                html+='                                <div class="btn_reset">\n' +
                    '                                    <button class="btn_submit" type="submit">提交运行</button>\n' +
                    '                                    <button class="btn_res" type="submit">初始代码</button>\n' +
                    '                                </div></div>';
                $('.div_question').html(html);

                setAceEditor(obj);
            }
            else if(obj.exeType=="单选题"||obj.exeType=="多选题"||obj.exeType=="判断题"){
                var html1='';
                var html2='<div class="div_select"><div class="question">\n' +
                    '                                <label class="exe_order">'+id+'</label>\n' +
                    '                                <label class="exe_type">'+obj.exeType+'</label><label class="score">(<span>'+obj.score+'</span>分)</label>';
                for(var i=0;i<obj.difficulty;i++){
                    html1+='<span class="fa fa-star fa-2x " style="color:#FFC125;"></span>';
                }
                for(var i=0;i<5-obj.difficulty;i++){
                    html1+='<span class="fa fa-star-o fa-2x" style="color:#FFC125;"></span>';
                }
                html1+='                                <div class="button">\n' +
                    '                                <ul>\n' +
                    '                                    <li class="button_1"><i class="fa fa-angle-left fa-2x one"></i><a href="##">上一题</a></li>\n' +
                    '                                    <li class="button_2"><a href="##">下一题</a><i class="fa fa-angle-right fa-2x two"></i></li>\n' +
                    '                                </ul>\n' +
                    '                                </div>\n' +
                    '                            </div>\n' +
                    '                                <br>\n' +
                    '                                <label class="exe_order" style="font-size:18px; ">题目内容：</label>\n' +
                    '                                <br>\n' +
                    '                                <label class="exe_content">'+obj.content+'</label>\n' +
                    '                                <br>\n' +
                    '                                <label class="exe_order" style="font-size:18px; ">选项：</label>\n'+
                    ' <div class="xuan">\n' +
                    '                                <ul>';
                var html3='';
                if(content!=null && content!=undefined){
                    console.log(content);
                    $.each(content,function(index,value){
                        if(obj.exeType=="多选题"){
                            if(value.isSelected==true){
                                html3+=' <li>\n' +
                                    '<input name="radio_input" type="checkbox" value="'+value.optionId+'" checked="true" class="input_radio"/>\n'+
                                    '         <label class="order">'+value.optionCharacter+'</label>\n' +
                                    '         <label>'+value.optionContent+'</label>\n' +
                                    '    </li>';
                            }
                            else{
                                html3+=' <li>\n' +
                                    '<input name="radio_input" type="checkbox" value="'+value.optionId+'" class="input_radio"/>\n'+
                                    '         <label class="order">'+value.optionCharacter+'</label>\n' +
                                    '         <label>'+value.optionContent+'</label>\n' +
                                    '    </li>';
                            }
                        }
                        else{
                            if(value.isSelected==true){
                                html3+=' <li>\n' +
                                    '<input type="radio" name="radio_input" value="'+value.optionId+'" checked="true"  class="input_radio"/>\n'+
                                    '         <label class="order">'+value.optionCharacter+'</label>\n' +
                                    '         <label>'+value.optionContent+'</label>\n' +
                                    '    </li>';
                            }
                            else{
                                html3+=' <li>\n' +
                                    '<input type="radio" name="radio_input" value="'+value.optionId+'" class="input_radio"/>\n'+
                                    '         <label class="order">'+value.optionCharacter+'</label>\n' +
                                    '         <label>'+value.optionContent+'</label>\n' +
                                    '    </li>';
                            }

                        }
                    });
                }

                if(obj.state==0){
                    var html4=' </ul>\n' +
                        '<div class="div_answer"></div>\n'+
                        '<button class="btn_default">提交答案</button></div>';
                }
                else if(obj.state==1){
                    var html4=' </ul>\n' +
                        '<div class="div_answer"><div class="div_return" style="margin-top: 30px">\n' +
                        '                                <strong style="font-size: 18px;">答案反馈:</strong>\n' +
                        '                                <p class="exe_content">回答错误</p>\n' +
                        '                            </div></div>\n'+
                        '<button class="btn_default">提交答案</button></div>';
                }
                else{
                    var html4=' </ul>\n' +
                        '<div class="div_answer"><div class="div_return" style="margin-top: 30px">\n' +
                        '                                <strong style="font-size: 18px;">答案反馈:</strong>\n' +
                        '                                <p class="exe_content">回答正确</p>\n' +
                        '                            </div></div>\n'+
                        '<button class="btn_default">提交答案</button></div>';
                }

                $('.div_question').html(html2+html1+html3+html4);
            }
            else{
                var html2='';
                html2+='<div class="div_blank"><div class="question">\n' +
                    '                            <label class="exe_order">'+id+'</label>\n' +
                    '                            <label class="exe_type">'+obj.exeType+'</label><label class="score">(<span>'+obj.score+'</span>分)</label>';

                for(var i=0;i<obj.difficulty;i++){
                    html2+='<span class="fa fa-star fa-2x " style="color:#FFC125;"></span>';
                }
                for(var i=0;i<5-obj.difficulty;i++){
                    html2+='<span class="fa fa-star-o fa-2x" style="color:#FFC125;"></span>';
                }
                html2+='                                <div class="button">\n' +
                    '                                <ul>\n' +
                    '                                    <li class="button_1"><i class="fa fa-angle-left fa-2x one"></i><a href="##">上一题</a></li>\n' +
                    '                                    <li class="button_2"><a href="##">下一题</a><i class="fa fa-angle-right fa-2x two"></i></li>\n' +
                    '                                </ul>\n' +
                    '                                </div></div>' ;

                var html3='<br><label class="exe_order" style="font-size:18px; ">题目内容：</label>\n' +
                    '                                <br>\n' +
                    '                                <label class="exe_content">'+obj.content+'</label>\n'+
                    '<br>\n' +
                    '                            <label class="exe_order" style="font-size:18px; ">编辑：</label>\n' +
                    '                            <div>';
                if(obj.oldAnswer!=null){
                    html3+='                            <input autocomplete="off" value="'+obj.oldAnswer+'"  name="textarea" style="height: 30px;width: 100%;margin-top: 20px;font-size:14px;">\n' +
                        '                            </div>';
                }
                else{
                    html3+='                            <input autocomplete="off" placeholder="请输入答案"  name="textarea" style="height: 30px;width: 100%;margin-top: 20px;font-size:14px;">\n' +
                        '                            </div>';
                }

                if(obj.state==0){
                    var html4=' </ul>\n' +
                        '<div class="div_answer"></div>\n'+
                        '<button class="btn_default">提交答案</button></div>';
                }
                else if(obj.state==1){
                    var html4=' </ul>\n' +
                        '<div class="div_answer"><div class="div_return" style="margin-top: 30px">\n' +
                        '                                <strong style="font-size: 18px;">答案反馈:</strong>\n' +
                        '                                <p class="exe_content">回答错误</p>\n' +
                        '                            </div></div>\n'+
                        '<button class="btn_default">提交答案</button></div>';
                }
                else{
                    var html4=' </ul>\n' +
                        '<div class="div_answer"><div class="div_return" style="margin-top: 30px">\n' +
                        '                                <strong style="font-size: 18px;">答案反馈:</strong>\n' +
                        '                                <p class="exe_content">回答正确</p>\n' +
                        '                            </div></div>\n'+
                        '<button class="btn_default">提交答案</button></div>';
                }

                $('.div_question').html(html2+html3+html4);
            }

        }
        //监听选择提交
        $("body").delegate('.div_select .btn_default', 'click', function (event) {
            var exeId=$('.input_hidden input[name="exeId"]').attr('value');
            var chk_value =[];
            $('.div_select input[name="radio_input"]:checked').each(function(){
                chk_value.push(parseInt($(this).val()));
            });
            console.log(chk_value);
            $.ajax({
                type: 'post',
                url: "http://111.230.31.212/judgement/judge/judgeSelectQuestion",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async:true,
                data:JSON.stringify({
                    "selectedOptionIds":chk_value,
                    "teachingClassId": parseInt(teachingClassId),
                    "exeId": parseInt(exeId)
                }),
                success:function (obj) {
                    // console.log(obj);
                    // console.log(obj.correct);
                    // console.log(obj.correctAnswer);
                    if(obj.code==401){
                        alert( obj.message);
                        window.location.href('../Home/homepage.html');
                    }
                    else if(obj.code==403){
                        alert(obj.message);
                    }

                    if(obj.correct==true){
                        $('.div_select .div_answer').html('<div class="div_return" style="margin-top: 30px">\n' +
                            '                                <strong style="font-size: 18px;">答案反馈:</strong>\n' +
                            '                                <p class="exe_content">回答正确</p>\n' +
                            '                            </div>');
                        var str = $('.input_hidden input[name="index"]').attr('value');//变颜色
                        var arr = str.split(',');//exeid数组
                        for(var i=0;i<arr.length;i++){
                            if(arr[i]==exeId){
                                var id=i;
                            }
                        }
                        $('.div_titleid li').eq(id).css({"background-color":"#36b729",
                                                            "color":"white"});

                    }
                    else{
                        $('.div_select .div_answer').html('<div class="div_return" style="margin-top: 30px">\n' +
                            '                                <strong style="font-size: 18px;">答案反馈:</strong>\n' +
                            '                                <p class="exe_content">回答错误</p>\n' +
                            '                            </div>');
                        var str = $('.input_hidden input[name="index"]').attr('value');//变颜色
                        var arr = str.split(',');//exeid数组
                        for(var i=0;i<arr.length;i++){
                            if(arr[i]==exeId){
                                var id=i;
                            }
                        }
                        $('.div_titleid li').eq(id).css({"background-color":"#ff2208",
                            "color":"white"});
                    }

                },
                error:function (msg) {
                    console.log(msg.status);
                }
            }) ;
        });
  //监听填空提交
    $("body").delegate('.div_blank .btn_default', 'click', function (event) {
        var exeId=$('.input_hidden input[name="exeId"]').attr('value');
        var $text=$('.div_blank input[name="textarea"]').val();
        console.log($text);
        $.ajax({
            type: 'post',
            url: "http://111.230.31.212/judgement/judge/judgeBlankQuestion",
            dataType: "json",
            async: true,
            data: {
                "teachingClassId": parseInt(teachingClassId),
                "exeId": parseInt(exeId),
                "answer": $text
            },
            success: function (obj) {
                // console.log(obj);
                // console.log(obj.correct);
                // console.log(obj.correctAnswer);
                if(obj.code==401){
                    alert( obj.message);
                    window.location.href('../Home/homepage.html');
                }
                else if(obj.code==403){
                    alert(obj.message);
                }
                if (obj.correct == true) {
                    $('.div_blank .div_answer').html('<div class="div_return" style="margin-top: 30px">\n' +
                        '                                <strong style="font-size: 18px;">答案反馈:</strong>\n' +
                        '                                <p class="exe_content">回答正确</p>\n' +
                        '                            </div>');
                    var str = $('.input_hidden input[name="index"]').attr('value');
                    var arr = str.split(',');//exeid数组
                    for(var i=0;i<arr.length;i++){
                        if(arr[i]==exeId){
                            var id=i;
                        }
                    }
                    $('.div_titleid li').eq(id).css({"background-color":"#36b729",
                        "color":"white"});
                }
                else {
                    $('.div_blank .div_answer').html('<div class="div_return" style="margin-top: 30px">\n' +
                        '                                <strong style="font-size: 18px;">答案反馈:</strong>\n' +
                        '                                <p class="exe_content">回答错误</p>\n' +
                        '                            </div>');
                    var str = $('.input_hidden input[name="index"]').attr('value');
                    var arr = str.split(',');//exeid数组
                    for(var i=0;i<arr.length;i++){
                        if(arr[i]==exeId){
                            var id=i;
                        }
                    }
                    $('.div_titleid li').eq(id).css({"background-color":"#ff2208",
                        "color":"white"});
                }
            },
            error: function (msg) {
                console.log(msg.status);
            }
        });
    });
    //监听编程提交
    $('body').delegate('.div_program .btn_submit','click',function (event) {
        var exeId=$('.input_hidden input[name="exeId"]').attr('value');
        var editor = ace.edit("code");
        var $text=editor.getValue();
        console.log($text);
        $.ajax({
            type: 'post',
            url: "http://111.230.31.212/judgement/judge/judgeProgramQuestion",
            dataType: "json",
            async: true,
            data: {
                "teachingClassId": parseInt(teachingClassId),
                "exeId": parseInt(exeId),
                "studentProgram": $text
            },
            success: function (obj) {
                // console.log(obj);
                // console.log(obj.correct);
                // console.log(obj.correctAnswer);
                if(obj.code==401){
                    alert( obj.message);
                    window.location.href('../Home/homepage.html');
                }
                else if(obj.code==403){
                    alert(obj.message);
                }
                else if(obj.code==503){
                    alert(obj.message);
                }
                var str='';
                var a=obj.testInformation;
                var arr=a.split('\n');
                for(var i=0;i<arr.length;i++){
                    str+='<p class="exe_content">'+arr[i]+'</p>';
                }
                // console.log(arr);
                // console.log(obj.testInformation);
                $('.div_program .div_return ').html(' <strong style="font-size: 18px;">代码反馈:</strong>'+str);
                if (obj.correct == true) {
                    var str = $('.input_hidden input[name="index"]').attr('value');
                    var arr = str.split(',');//exeid数组
                    for(var i=0;i<arr.length;i++){
                        if(arr[i]==exeId){
                            var id=i;
                        }
                    }
                    $('.div_titleid li').eq(id).css({"background-color":"#36b729",
                        "color":"white"});
                }
                else {
                    var str = $('.input_hidden input[name="index"]').attr('value');
                    var arr = str.split(',');//exeid数组
                    for(var i=0;i<arr.length;i++){
                        if(arr[i]==exeId){
                            var id=i;
                        }
                    }
                    $('.div_titleid li').eq(id).css({"background-color":"#ff2208",
                        "color":"white"});
                }
            },
            error: function (msg) {
                console.log(msg.status);
            }
        });
    });
    //初始代码
    $('body').delegate('.div_program .btn_res','click',function (event) {
        var exeId=$('.input_hidden input[name="exeId"]').attr('value');
        var editor = ace.edit("code");
        $.ajax({
            type: 'get',
            url: "http://111.230.31.212/judgement/examination/getBaseCode",
            dataType: "json",
            async: true,
            data: {
                teachingClassId: teachingClassId,
                exeId: parseInt(exeId)
            },
            success: function (obj) {
                // console.log(obj.baseCode);
                if(obj.code==401){
                    alert( obj.message);
                    window.location.href('../Home/homepage.html');
                }
                else if(obj.code==403){
                    alert(obj.message);
                }
                var editorValue=obj.baseCode;
                editor.setValue(editorValue);
            },
            error: function (msg) {
                console.log(msg.status);
            }
        });
    });
    //上一题
    $("body").delegate('.button .button_1', 'click', function (event) {
        var str = $('.input_hidden input[name="index"]').attr('value');
        var exeId=$('.input_hidden input[name="exeId"]').attr('value');//目前题号
        var arr = str.split(',');//exeid数组
        for(var i=0;i<arr.length;i++){
            if(arr[i]==exeId){
               var id=i+1;
            }
        }
        if (id <= 1) {
            alert('已到第一题');
        }
        else {
            var exeId = arr[id - 2];
            $('.input_hidden input[name="exeId"]').attr('value',exeId);
            $('.div_titleid li').eq(id-2).addClass('active');
            $('.div_titleid li').eq(id-2).siblings('li').removeClass('active');
            $.ajax({
                type: 'get',
                url: "http://111.230.31.212/judgement/examination/getExerciseDetailByExeId",
                dataType: "json",
                data: {
                    teachingClassId: parseInt(teachingClassId),
                    exeId: parseInt(exeId)
                },
                success: function (data) {
                    // console.log($.session.get('questionId'));
                    // console.log(typeof($.session.get('questionId')));
                    // console.log(data);
                    if(data.code==401){
                        alert(data.message);
                        window.location.href('../Home/homepage.html');
                    }
                    else if(data.code==403){
                        alert(data.message);
                    }
                    else if(data.code==404){
                        alert(data.message);
                    }
                    $('.div_question').empty();
                    if (data != null && data != undefined) {
                        createSelect(id-1, data);
                    }

                },
                error: function (xhr) {
                    console.log(xhr.status);
                }
            });

        }
    })
    $("body").delegate('.button .button_2', 'click', function (event) {
        var str = $('.input_hidden input[name="index"]').attr('value');
        var exeId=$('.input_hidden input[name="exeId"]').attr('value');//目前题号
        var arr = str.split(',');//exeid数组
        for(var i=0;i<arr.length;i++){
            if(arr[i]==exeId){
                var id=i+1;
            }
        }
        if (id>=arr.length) {
            alert('已到最后一题');
        }
        else {

            var exeId = arr[id ];
            $('.input_hidden input[name="exeId"]').attr('value',exeId);
            $('.div_titleid li').eq(id).addClass('active');
            $('.div_titleid li').eq(id).siblings('li').removeClass('active');
            $.ajax({
                type: 'get',
                url: "http://111.230.31.212/judgement/examination/getExerciseDetailByExeId",
                dataType: "json",
                data: {
                    teachingClassId: parseInt(teachingClassId),
                    exeId: parseInt(exeId)
                },
                success: function (data) {
                    if(data.code==401){
                        alert(data.message);
                        window.location.href('../Home/homepage.html');
                    }
                    else if(data.code==403){
                        alert(data.message);
                    }
                    else if(data.code==404){
                        alert(data.message);
                    }
                    // console.log($.session.get('questionId'));
                    // console.log(typeof($.session.get('questionId')));
                    // console.log(data);
                    $('.div_question').empty();
                    if (data != null && data != undefined) {
                        createSelect(id+1, data);
                    }

                },
                error: function (xhr) {
                    console.log(xhr.status);
                }
            });
        }
    })
    function setAceEditor(obj){
        require("ace/ext/old_ie");
        ace.require("ace/ext/language_tools");
        var editor = ace.edit("code");
        var editorValue=obj.oldAnswer;
        if(obj.oldAnswer!=null){
            editor.setValue(editorValue);
        }
        else{
            editor.setValue(obj.baseCode);
        }
        editor.$blockScrolling = Infinity;
        //设置风格和语言（更多风格和语言，请到github上相应目录查看）
        theme = "clouds";
        language = "c_cpp";
        editor.setTheme("ace/theme/" + theme);
        editor.session.setMode("ace/mode/" + language);
        editor.setShowPrintMargin(false);
        //字体大小
        editor.setFontSize(18);

        //设置只读（true时只读，用于展示代码）
        editor.setReadOnly(false);

        //自动换行,设置为off关闭
        editor.setOption("wrap", "free");

        //启用提示菜单
        ace.require("ace/ext/language_tools");
        editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });

    }

});