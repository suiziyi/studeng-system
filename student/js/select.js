$(function(){
    // console.log($.session.get('questionId'));
    // console.log(typeof($.session.get('questionId')));
    var teachingClassId=parent.$('input[name="teachingClassId"]').attr('value');
    var exeId=parent.$('.div_hidden input[name="exeId"]').attr('value');
    // console.log(exeId);
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
                // console.log($.session.get('questionId'));
                // console.log(typeof($.session.get('questionId')));
                // console.log(data);
                $('.m-notice .left-mn').empty();
                if (data != null && data != undefined) {
                    var $select = createSelect(data);
                    $('.m-notice .left-mn').append($select);
                }

            },
            error: function (xhr) {
                console.log(xhr.status);
            }

        });
    }
    function createSelect(obj){
        // console.log(obj);

        var content=obj.options;
        var html1='';
        var html2='                            <div class="question">\n' +
            '                                <label class="exe_order">'+obj.exeId+'</label>\n' +
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
                                     '<label><input name="radio_input" type="checkbox" value="'+value.optionId+'" checked="true" /></label>\n'+
                                     '         <label class="order">'+value.optionCharacter+'</label>\n' +
                                     '         <label>'+value.optionContent+'</label>\n' +
                                     '    </li>';
                             }
                             else{
                                 html3+=' <li>\n' +
                                     '<label><input name="radio_input" type="checkbox" value="'+value.optionId+'" /></label>\n'+
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

        return html2+html1+html3+html4;

    }
    $("body").delegate('.btn_default', 'click', function (event) {
        var chk_value =[];
        $('input[name="radio_input"]:checked').each(function(){
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
                    $('.div_answer').html('<div class="div_return" style="margin-top: 30px">\n' +
                        '                                <strong style="font-size: 18px;">答案反馈:</strong>\n' +
                        '                                <p class="exe_content">回答正确</p>\n' +
                        '                            </div>');
               }
               else{
                   $('.div_answer').html('<div class="div_return" style="margin-top: 30px">\n' +
                       '                                <strong style="font-size: 18px;">答案反馈:</strong>\n' +
                       '                                <p class="exe_content">'+obj.correctAnswer+'</p>\n' +
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
               // console.log(node.icon);
               // console.log(treeObj.updateNode(node));
           },
           error:function (msg) {
               console.log(msg.status);
           }
       }) ;
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