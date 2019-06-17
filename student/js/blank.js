$(function(){
    var teachingClassId=parent.$('input[name="teachingClassId"]').attr('value');
    var exeId=parent.$('input[name="exeId"]').attr('value');
    if(exeId!=null) {
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
                var $content = createBlank(data);
                $('.left-mn').html($content);
            },
            error: function (xhr) {
                console.log(xhr.status);
            }

        });
    }
    function createBlank(obj){
        console.log(obj);
        var html2='';
        html2+='<div class="question">\n' +
            '                            <label class="exe_order">'+obj.exeId+'</label>\n' +
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

        return html2+html3+html4;
    }

    $("body").delegate('.btn_default', 'click', function (event) {
        var $text=$('input[name="textarea"]').val();
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
                        $('.div_answer').html('<div class="div_return" style="margin-top: 30px">\n' +
                            '                                <strong style="font-size: 18px;">答案反馈:</strong>\n' +
                            '                                <p class="exe_content">回答正确</p>\n' +
                            '                            </div>');
                    }
                    else {
                        $('.div_answer').html('<div class="div_return" style="margin-top: 30px">\n' +
                            '                                <strong style="font-size: 18px;">答案反馈:</strong>\n' +
                            '                                <p class="exe_content">' + obj.correctAnswer + '</p>\n' +
                            '                            </div>');
                    }
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
});