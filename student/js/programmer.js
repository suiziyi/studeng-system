
$(function(){
    var teachingClassId=parent.$('input[name="teachingClassId"]').attr('value');
    var exeId=parent.$('input[name="exeId"]').attr('value');
    // console.log(typeof (exeId));
    if(exeId!=null){

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
                $('.left-mn').empty();
                createProgram(data);

            },
            error: function (xhr) {
                console.log(xhr.status);
            }

        });
    }
    function createProgram(obj){
        // console.log(obj);
        $('.left-mn').empty();
        var html='                           <div class="question">\n' +
            '                                    <label class="exe_order">'+obj.exeId+'</label>\n' +
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
             // console.log(str);
            // console.log(obj.testInformation);
            html+='<div class="div_return" style="margin-top: 30px"><strong style="font-size: 18px;">代码反馈:</strong>'+str+'</div> ';
            // console.log( $('.div_return ').html());
        }
        else{
            html+='<div class="div_return" style="margin-top: 30px"></div> ';
        }
        html+='                                <div class="btn_reset">\n' +
            '                                    <button class="btn_submit" type="submit">提交运行</button>\n' +
            '                                    <button class="btn_res" type="submit">初始代码</button>\n' +
            '                                </div>';
        $('.left-mn').html(html);

        setAceEditor(obj);

    }
   $('body').delegate('.btn_submit','click',function (event) {
        var editor = ace.edit("code");
        var $text=editor.getValue();
        console.log($text);
        $.ajax({
            type: 'post',
            url: " http://111.230.31.212/judgement/judge/judgeProgramQuestion",
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
                $('.div_return ').html(' <strong style="font-size: 18px;">代码反馈:</strong>'+str);
                var treeObj=parent.window.$.fn.zTree.getZTreeObj("tree");
                var node=treeObj.getNodeByParam("id", parseInt(exeId), null);
                // console.log(node);
                var icona='';
                if (obj.correct == true) {
                    icona = "../../css/img/green.jpg";
                }

                else{
                    icona = "../../css/img/red.jpg";
                }
                node.icon = icona;
                treeObj.updateNode(node);
            },
            error: function (msg) {
                console.log(msg.status);
            }
        });
    });
    $('body').delegate('.btn_res','click',function (event) {
        var editor = ace.edit("code");
        $.ajax({
            type: 'get',
            url: "http://111.230.31.212/judgement/examination/getBaseCode",
            dataType: "json",
            async: true,
            data: {
                teachingClassId: teachingClassId,
                exeId: exeId
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
    $("body").delegate('.button .button_1', 'click', function (event) {
        //题号exeId
        var titleid=parent.$('input[name="titleid"]').attr('value');
        // console.log(titleid);
        var arr=titleid.split(',');
        // console.log(arr);
        var id=parseInt(exeId);
        // console.log(id);
        for(var i=0;i<arr.length;i++){
            if(arr[i]==id){
                // parent.$('input[name="titleid"]').attr('value',arr[i-1]);
                var treeObj=parent.window.$.fn.zTree.getZTreeObj("tree");
                var node=treeObj.getNodeByParam("id", arr[i-1], null);
                console.log(node);
                if(node){
                    treeObj.selectNode(node,true);
                    treeObj.setting.callback.onClick(null,treeObj.setting.treeId,node)
                }
                else{
                    alert('已到顶部');
                }
            }
        }

    });
    $("body").delegate('.button .button_2', 'click', function (event) {
        //题号exeId
        var titleid=parent.$('input[name="titleid"]').attr('value');
        // console.log(titleid);
        var arr=titleid.split(',');
        // console.log(arr);
        var id=parseInt(exeId);
        // console.log(id);
        for(var i=0;i<arr.length;i++){
            if(arr[i]==id){
                // parent.$('input[name="titleid"]').attr('value',arr[i-1]);
                var treeObj=parent.window.$.fn.zTree.getZTreeObj("tree");
                var node=treeObj.getNodeByParam("id", arr[i+1], null);
                console.log(node);
                if(node){
                    treeObj.selectNode(node,true);
                    treeObj.setting.callback.onClick(null,treeObj.setting.treeId,node)
                }
                else{
                    alert('已到底部');
                }
            }
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