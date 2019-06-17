
$(function(){
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL);
    });
    //
    // $(window.parent.document).find("#testIframe1").load(function () {
    //     var main = $(window.parent.document).find("#testIframe1");
    //     var thisheight = $(document).height() + 1000;
    //     main.height(thisheight);
    // });
    var teachingClassId=parent.$('input[name="teachingClassId"]').attr('value');

    $.ajax({
        type: 'get',
        url: "http://111.230.31.212/judgement/examination/generateExamPaper",
        dataType: "json",
        data: {
            teachingClassId: parseInt(teachingClassId),
            examType:$.session.get('examType')
        },
        success: function (data) {
            if(data.code==401){
                alert(data.message);
                window.location.href('../Home/homepage.html');
            }
            else if(data.code==403){
                alert(data.message);
            }

            console.log(data);
            var objt = data.blankQuestions;
            var objb = data.programmingQuestions;
            var objx = data.selectQuestions;
            // console.log(objt);
            // console.log(objb);
            console.log(objx);
            var str1 = "";
            var str2 = "";
            var str3 = "";
            var t=0;
            var x=0;
            parent.$('input[name="paperId"]').attr('value',data.paperId);

            if(objx!=null||objx!=undefined) {
                $.each(objx, function (index, value) {
                    str1 += createSelect(index+1, value);
                    x++;
                });
            }
            $('.div_select').html(str1);
            if(objt!=null||objt!=undefined) {
                $.each(objt, function (index, value) {
                    str2 += createBlank(index+1 + x, value);
                    t++;
                });
            }
            $('.div_blank').html(str2);
            if(objb!=null||objb!=undefined) {
                $('.div_program').empty();
                $.each(objb, function (index, value) {
                    str3 += createProgram(index,index+1 + x + t, value);

                });
            }
            $('.div_button').html('<button class="btn_default">提交答案</button>');
        },
        error: function (xhr) {
            console.log(xhr.status);
        }

    });
    function createBlank(index,obj){
        var html1='                            <div>\n' +
            '                                <label class="exe_order">'+index+'</label>\n' +
            '                                <label class="exe_content">&nbsp;'+obj.content+'</label>\n' +
            '                                <label class="score">(<span>'+obj.score+'</span>分)</label>\n' +
            '                            </div>\n' +
            '                            <div>\n' +
            '                                <input name="'+obj.exeId+'" type="text" autocomplete="off" placeholder="您还没有填写答案"  style="height: 30px;width: 722px;margin-left:20px;font-size:13px;"/>\n' +
            '                            </div>';
        return html1;
    }
    function createProgram(id,index,obj){

        var html2='<div class="div_title"><div>\n' +
            '                                        <label class="exe_order" value="'+obj.exeId+'">'+index+'</label>\n' +
            '                                        <label class="exe_content">&nbsp;'+obj.exeType+'</label>\n' +
            '                                        <label class="score">(<span>'+obj.score+'</span>分)</label>\n' +
            '                                    </div>\n' +
            '                                    <div>\n' +
            '                                        <strong style="font-size: 13px;">('+(id+1)+')&nbsp;题目内容:</strong>\n' +
            '                                        <p style="margin-left: 20px;font-size: 13px;margin-top: 4px;">'+obj.content+'</p>\n' +
            '                                    </div>\n'+
            '  <div style="margin-top: 15px">\n' +
            '                                    <strong style="margin-left: 20px;font-size: 13px;">输出样例:</strong>\n' +
            '                                    <p style="width: 750px; margin-left: 20px;font-size: 13px;margin-top: 4px;color: #666;">'+obj.ioExplain+'</p>\n' +
            '                                </div></div>\n'+
            '<div class="div_edit">\n' +
            '                                 <pre name="'+obj.exeId+'" id="code" class="ace_editor" style="width:722px;height:400px;margin-left:20px;margin-top:25px;">\n' +
            '                                  <textarea class="ace_text-input">\n' +
            '                                  </textarea></pre>\n' +
            '                                </div>\n'+
            '<div calss="div_time"><strong style="margin-left: 20px;font-size: 15px;">时间限制:</strong>\n' +
            '                                    <label style="margin-left: 5px;font-size: 13x;color: #666;">'+obj.timeLimit+'s</label>\n' +
            '                                    <strong style="margin-left: 20px;font-size: 13px;">内存限制:</strong>\n' +
            '                                    <label style="margin-left: 5px;font-size: 13px;color: #666;">'+obj.memoryLimit+'k</label>\n' +
            '                                    <div class="btn_reset">\n'+
            '<button class="btn_submit" type="submit">提交运行</button>\n'+
            ' <button class="btn_res" type="submit">初始代码</button>\n'+
            '</div></div><div class="div_return" style="margin-top: 40px"></div>';
        if(obj.testInformation!=null){
            var str='';
            var a=obj.testInformation;
            var arr=a.split('\n');
            for(var i=0;i<arr.length;i++){
                str+='<p class="exe_content" style=" width: 750px;margin-left: 20px;font-size: 12px;margin-top: 4px;color: #666;">'+arr[i]+'</p>';
            }
            // console.log(arr);
            // console.log(obj.testInformation);
            $('.div_return ').html(' <strong style="margin-left: 20px;font-size: 13px;">代码反馈:</strong>'+str);
        }
        else{
            $('.div_return ').html("");
        }
        $('.div_program').html(html2);
        setAceEditor(obj);
    }
    function createSelect(index,obj){
        var content=obj.options;
        var html1='                         <div> <div>\n' +
            '                                <label class="exe_order">'+index+'</label>\n' +
            '                                <label class="exe_content">&nbsp;'+obj.content+'</label>\n' +
            '                                <label class="score">(<span>'+obj.score+'</span>分)</label>\n' +
            '                            </div>\n' +
            '                            <div class="xuan" >\n' +
            '                                <ul>' ;
        var html2='';
        $.each(content,function(index,value){

            if(obj.exeType=="多选题"){
                html2+=' <li>\n' +
                    '<input type="checkbox" name="'+obj.exeId+'" value="'+value.optionId+'" class="input_radio"/>\n'+
                    '         <label class="order">'+value.optionCharacter+'</label>\n' +
                    '         <label>'+value.optionContent+'</label>\n' +
                    '    </li>';
            }
            else{
                html2+=' <li>\n' +
                    '<input type="radio" name="'+obj.exeId+'" value="'+value.optionId+'" class="input_radio"/>\n'+
                    '         <label class="order">'+value.optionCharacter+'</label>\n' +
                    '         <label>'+value.optionContent+'</label>\n' +
                    '    </li>';
            }
        });
        var html3=' </ul></div></div>';
        // console.log(html1+html2+html3);
        return html1+html2+html3;

    }

    $('body').delegate('.btn_submit','click',function (event) {
        var editor = ace.edit("code");
        // console.log('ee');
        var $text=editor.getValue();
        // console.log($text);
        var exeId=$(' .div_title .exe_order').attr('value');
        $.ajax({
            type: 'post',
            url: " http://111.230.31.212/judgement/judge/judgeProgramQuestion",
            dataType: "json",
            async: true,
            data: {
                "exeId": exeId,
                "teachingClassId": parseInt(teachingClassId),
                "studentProgram": $text
            },
            success: function (obj) {
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
                // console.log(obj);
                // console.log(obj.correct);
                // console.log(obj.correctAnswer);
                $.session.set('correct', obj.correct);
                var str='';
                var arr=obj.testInformation.split('\n');
                for(var i=0;i<arr.length;i++){
                    str+='<p class="exe_content" style="width: 750px;margin-left: 20px;font-size: 12px;margin-top: 4px;color: #666;">'+arr[i]+'</p>';
                }
                // console.log(arr);
                // console.log(obj.testInformation);
                $('.div_return ').html(' <strong style="margin-left: 20px;font-size: 13px;">代码反馈:</strong>'+str);
            },
            error: function (msg) {
                console.log(msg.status);
            }
        });
    });
//初始代码
    $('body').delegate('.btn_res','click',function (event) {
        var editor = ace.edit("code");
        var exeId=$(' .div_title .exe_order').attr('value');
        $.ajax({
            type: 'get',
            url: "http://111.230.31.212/judgement/examination/getBaseCode",
            dataType: "json",
            async: true,
            data: {
                teachingClassId: parseInt(teachingClassId),
                exeId:exeId
            },
            success: function (obj) {
                if(obj.code==401){
                    alert( obj.message);
                    window.location.href('../Home/homepage.html');
                }
                else if(obj.code==403){
                    alert(obj.message);
                }

                // console.log(obj.baseCode);

                var editorValue=obj.baseCode;
                editor.setValue(editorValue);
            },
            error: function (msg) {
                console.log(msg.status);
            }
        });
    });

    $('body').delegate('.btn_default','click',function (event) {
        getSubmit();


    });
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
    //时间
    var oBox = document.getElementById("box");
    var oBar = document.getElementById("box");
    startDrag(oBar, oBox);
    var flag=setInterval(timer,1000);
    var ts = parseInt($.session.get('timemid'))*60;//计算剩余的毫秒数
    // var ts=10;
    function timer()
    {
        //var dd = parseInt(ts / 1000 / 60 / 60 / 24, 10);//计算剩余的天数
        //var hh = parseInt(ts / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
        var mm = parseInt(ts/ 60 );//计算剩余的分钟数
        var ss = parseInt(ts%60);//计算剩余的秒数
        //dd = checkTime(dd);
        // hh = checkTime(hh);
        mm = checkTime(mm);
        ss = checkTime(ss);
        // document.getElementById("timer").innerHTML =  mm + ":" + ss ;
        $('#timer').html(mm + ":" + ss) ;

        if(ts<=0){
            clearInterval(flag);
            alert("时间到，结束!");
            getSubmit();
            location.replace('examination.html');
            history.pushState(null, null, document.URL);
            window.addEventListener('popstate', function () {
                history.pushState(null, null, document.URL);
            });
        }
        ts--;

    }
    function checkTime(i)
    {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
    function getSubmit(){
        var editor;
        var chk_value = [];
        var exeId=[];
        var selectQuestions=[];
        var select_data=new Object();
        var blank_data=new Object();
        var program_data=new Object();
        var blankQuestions=[];
        var programmingQuestions=[];
        var paperId=parent.$('input[name="paperId"]').attr('value');
        $('input[type="checkbox"]:checked').each(function(){
            console.log($(this).val());
            chk_value.push(parseInt($(this).val()));
            exeId.push(parseInt($(this).attr('name')));
        });

        $('input[type="radio"]:checked').each(function(){
            console.log($(this).val());
            chk_value.push(parseInt($(this).val()));
            exeId.push(parseInt($(this).attr('name')));
        });
        // console.log(exeId);
        // console.log(chk_value);
        var str=[];
        for(var i=0;i<exeId.length;i++){
            if(exeId[i]!=exeId[i+1]){
                str.push(chk_value[i]);
                $('.input_hidden').append('<input type="hidden" name="'+exeId[i]+'" value="'+str+'">');
                str=[];
            }
            else {
                str.push(chk_value[i]);
            }
        };
        $('.input_hidden input').each(function () {
            var selected=$(this).attr('value');
            // console.log(selected);
            // var a=selected.split(',');
            let a = JSON.parse('[' + selected + ']');
            // console.log(a);
            select_data={
                "selectedOptionIds":a,
                "exeId":parseInt($(this).attr('name'))
            };
            selectQuestions.push(select_data);
        })

        console.log(selectQuestions);

//
//填空
        var chk_value = [];
        var exeId=[];
        $('.input_hidden').empty();
        $('input[type="text"]').each(function(){
            var $text=$('input[type="text"]').val();
            console.log($text);
            chk_value.push($text);
            exeId.push(parseInt($(this).attr('name')));
            console.log(chk_value);
            console.log(exeId);
        });
        for(var i=0;i<exeId.length;i++){
            $('.input_hidden').append('<input type="hidden" name="'+exeId[i]+'" value="'+chk_value[i]+'">');
        };
        $('.input_hidden input').each(function () {
            blank_data={
                "answer":$(this).attr('value'),
                "exeId":parseInt($(this).attr('name'))
            };
            blankQuestions.push(blank_data);
        })
        console.log(blankQuestions);

//编程
        var chk_value = [];
        var exeId=[];
        $('.input_hidden').empty();
        $('#code').each(function(index) {
            editor = ace.edit(this);
            var text=editor.getValue();
            console.log(text);
            chk_value.push(text);
            exeId.push(parseInt($(this).attr('name')));
            console.log(chk_value);
            console.log(exeId);
        });
        for(var i=0;i<exeId.length;i++){
            $('.input_hidden').append('<input type="hidden" name="'+exeId[i]+'" value="'+chk_value[i]+'">');
        };
        // console.log($text);
        $('.input_hidden input').each(function () {
            program_data = {
                "answer":$(this).attr('value'),
                "exeId":parseInt($(this).attr('name'))
            };
            programmingQuestions.push(program_data);
        });
        console.log( programmingQuestions);
        $.ajax({
            type: 'post',
            url: "http://111.230.31.212/judgement/judge/judgeAll",
            dataType: "json",
            async: true,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                "paperId":parseInt(paperId),
                "teachingClassId": parseInt(teachingClassId),
                "blankQuestions":blankQuestions,
                "programmingQuestions":programmingQuestions,
                "selectQuestions":selectQuestions
            }),
            success: function (obj) {
                if(obj.code==401){
                    alert( obj.message);
                    window.location.href('../Home/homepage.html');
                }
                else if(obj.code==403){
                    alert(obj.message);
                }

                alert('提交成功');
                location.replace('examination.html');
                history.pushState(null, null, document.URL);
                window.addEventListener('popstate', function () {
                    history.pushState(null, null, document.URL);
                });
            },
            error: function (msg) {
                console.log(msg.status);
            }
        });
    }
});