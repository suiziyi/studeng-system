$(function() {

    $(".title1 .title2 .title3", parent.document).hide();

    var zTree;
    var demoIframe;
    var teachingClassId=parent.$('.div_hidden input').attr('value');
    $('.div_hidden input[name="teachingClassId"]').attr('value',teachingClassId);
    var setting = {
        view: {
            dblClickExpand: false,
            showLine: true,
            selectedMulti: false,
            selectedMulti: false

        },
        async: {
            enable: true,
        },
            data: {
            keep:{
                parent:true
            },
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pId",
                rootPId: ""
            }
        },
        callback: {
            // beforeClick: function (treeId, treeNode) {
            //     var zTree = $.fn.zTree.getZTreeObj("tree");
            //     if (treeNode.isParent) {
            //         zTree.expandNode(treeNode);
            //         return false;
            //     } else {
            //         demoIframe.attr("src", treeNode.file);
            //         return true;
            //     }
            // },
            onClick : function(event, treeId, treeNode) {

                var zTree = $.fn.zTree.getZTreeObj("tree");
                // console.log(treeNode.level);
                // function filter(treeNode) {
                //     return (treeNode.level == 1);
                // }
                // var nodes = zTree.getNodesByFilter(filter); // 查找节点集合
                //     zTree.removeChildNodes(nodes);
                if(treeNode.level==0){
                    var id = treeNode.id;
                    $.session.set('chapterId', id);//章号
                    // console.log($.session.get('chapterId'));

                    // console.log("treeId自动编号：" + treeNode.tId + ", 节点id是：" + treeNode.id + ", 节点文本是：" + treeNode.name);

                    $.ajax({
                        type: 'get',
                        url: "http://111.230.31.212/judgement/examination/getPracticeQuestionIds",
                        dataType: "json",
                        data: {
                            teachingClassId: teachingClassId,
                            chapterId: $.session.get('chapterId')
                        },
                        success: function (data) {
                            if(data.code==401){
                                alert(data.message);
                                window.location.href('../Home/homepage.html');
                            }
                            else if(data.code==403){
                                alert(data.message);
                            }
                            var str1 = "";
                            var str2 = "";
                            var str3 = "";
                            var objt = data.partOfBlankQuestions;
                            var objb = data.partOfProgrammingQuestions;
                            var objx = data.partOfSelectionQuestions;
                            var arr=[];
                            // console.log(data);
                            $.each(objx, function (index, value) {
                                str1 += '{id:' + value.exeId + ', pId:' + (id * 100 + 1) + ', name:"' + value.exeId + '",';
                                if (value.state == 0) {
                                    str1 += 'icon:"../../css/img/gray.jpg", file:"exe.html"},';
                                }
                                else if (value.state == 1) {
                                    str1 += 'icon:"../../css/img/red.jpg", file:"exe.html"},';
                                }
                                else {
                                    str1 += 'icon:"../../css/img/green.jpg", file:"exe.html"},';
                                }
                                arr.push(value.exeId);
                            });
                                $.each(objt, function (index, value) {
                                    str2 += '{id:' + value.exeId + ', pId:' + (id * 100 + 2) + ', name:"' + value.exeId + '",';
                                    if (value.state == 0) {
                                        str2 += 'icon:"../../css/img/gray.jpg", file:"tiankong.html"},';
                                    }
                                    else if (value.state == 1) {
                                        str2 += 'icon:"../../css/img/red.jpg", file:"tiankong.html"},';
                                    }
                                    else {
                                        str2+= 'icon:"../../css/img/green.jpg", file:"tiankong.html"},';
                                    }
                                    arr.push(value.exeId);
                                });

                                $.each(objb, function (index, value) {
                                    str3 += '{id:' + value.exeId + ', pId:' + (id * 100 + 3) + ', name:"' + value.exeId + '",';
                                    if (value.state == 0) {
                                        str3 += 'icon:"../../css/img/gray.jpg", file:"biancheng.html"},';
                                    }
                                    else if (value.state == 1) {
                                        str3 += 'icon:"../../css/img/red.jpg", file:"biancheng.html"},';
                                    }
                                    else {
                                        str3 += 'icon:"../../css/img/green.jpg", file:"biancheng.html"},';
                                    }
                                    arr.push(value.exeId);
                                });
                            $('input[name="titleid"]').attr('value',arr);
                            // console.log("["+str+"]");
                            var zNodes1 = eval('(' + '[' + str1 + ']' + ')');
                            var zNodes2 = eval('(' + '[' + str2 + ']' + ')');
                            var zNodes3 = eval('(' + '[' + str3 + ']' + ')');
                            // console.log(zNodes1,zNodes2,zNodes3);
                            var treeObj = $.fn.zTree.getZTreeObj("tree");
                            var parentZNode = treeObj.getNodeByParam("id", id*100+1, null);//获取指定父节点
                            treeObj.removeChildNodes(parentZNode);
                             zNodes1=treeObj.addNodes(parentZNode,zNodes1, true);
                            var parentZNode2 = treeObj.getNodeByParam("id", id*100+2, null);//获取指定父节点
                            treeObj.removeChildNodes(parentZNode2);
                            zNodes2=treeObj.addNodes(parentZNode2,zNodes2, true);
                            var parentZNode3 = treeObj.getNodeByParam("id", id*100+3, null);//获取指定父节点
                            treeObj.removeChildNodes(parentZNode3);
                            zNodes3=treeObj.addNodes(parentZNode3,zNodes3, true);

                        },
                        error: function (xhr) {
                            console.log(xhr.status);
                        }
                    });

                    // refreshNode();
                    zTree.expandNode(treeNode);
                }
                else if(treeNode.level==1){
                        zTree.expandNode(treeNode);
                       //  var id = treeNode.id;
                       //  $.session.set('chapterId', id);

                }
                else if(treeNode.level==2){
                    demoIframe = $("#testIframe");
                    var id = parseInt(treeNode.id);
                    $('.div_hidden input[name="exeId"]').attr('value',id);
                    demoIframe.attr("src", treeNode.file);
                    // console.log( $.session.get('questionId'));
                    // $("#testIframe").contents().find(".btn_default").on("click",function(){
                    //     console.log('11');
                    //         var node = zTree.getNodeByParam("id", treeNode.id, null);
                    //         if ($.session.get('correct') == 'true') {
                    //             var icona = "../../css/img/green.jpg";
                    //         }
                    //         else if ($.session.get('correct') == 'false') {
                    //             var icona = "../../css/img/red.jpg";
                    //         }
                    //         else {
                    //             var icona = "../../css/img/gray.jpg";
                    //         }
                    //         node.icon = icona;
                    //         zTree.updateNode(node);
                    // });


                    // var a = zTree.getNodeByParam("id", treeNode.id, null);
                    // var index = zTree.getNodeIndex(a);
                    // console.log(index);

                }

            }

        }
    };

    getMsgLeft();

    function getMsgLeft() {
        $.ajax({
            type: 'get',
            url: "http://111.230.31.212/judgement/examination/getChapterIdsAndNames",
            dataType: "json",
            data: {teachingClassId: teachingClassId},
            success: function (data) {
                if(data.code==401){
                    alert(data.message);
                    window.location.href('../Home/homepage.html');
                }
                else if(data.code==403){
                    alert(data.message);
                }
                var str = "";
                $.each(data, function (index, value) {
                    str += "{id:" + value.chaId + ", pId:" + 0 + ", name:\"" + value.chaName + "\",open:false},\n" +
                        "        {id:" + (100 * value.chaId + 1) + ",pId:" + value.chaId + ", name:\"选择\", open:false},\n" +
                        "        {id:" + (100 * value.chaId + 2) + ",pId:" + value.chaId + ", name:\"填空\", open:false},\n" +
                        "        {id:" + (100 * value.chaId + 3) + ", pId:" + value.chaId + ", name:\"编程\", open:false},\n"+
                        "        {id:" + (1000 * value.chaId + 1) + ", pId:" + (100 * value.chaId + 1) + ", name:\"选择\", open:false},\n"+
                        "        {id:" + (1000 * value.chaId + 2) + ", pId:" + (100 * value.chaId + 2) + ", name:\"填空\", open:false},\n"+
                        "        {id:" + (1000 * value.chaId + 3) + ", pId:" + (100 * value.chaId + 3) + ", name:\"编程\", open:false},";
                });

                // console.log("["+str+"]");
                var zNodes = eval('(' + '[' + str + ']' + ')');
                // console.log(zNodes);
                $.fn.zTree.init($('#tree'), setting, zNodes);
                // var treeObj = $.fn.zTree.getZTreeObj("tree");
                // var parentZNode = treeObj.getNodeByParam("id", 101, null);//获取指定父节点
                // zNodes=treeObj.addNodes(parentZNode,zNodes1, false);

            },
            error: function (xhr) {
                console.log(xhr.status);
            }

        });
    }

});

    // var zNodes =[
    //     {id:1, pId:0, name:"第一章   绪论", open:true},
    //     {id:101, pId:1, name:"选择", open:true},
    //
    //     {id:103, pId:1, name:"填空", open:true},
    //     {id:104, pId:1, name:"编程", open:true},
    //
    //     {id:2, pId:0, name:"第二章  c++", open:false},
    //     {id:201, pId:2, name:"选择", file:"excheck/checkbox"},
    //
    //     {id:203, pId:2, name:"填空", file:"excheck/checkbox_chkDisabled"},
    //     {id:204, pId:2, name:"编程", file:"core/noicon"},
    //
    //
    //     {id:3, pId:0, name:"第三章  输出", open:false},
    //     {id:301, pId:3, name:"选择", file:"exedit/drag"},
    //
    //     {id:303, pId:3, name:"填空", file:"exedit/drag_fun"},
    //     {id:304, pId:3, name:"编程", file:"core/noicon"},
    //
    //     {id:4, pId:0, name:"第四章  输入", open:false},
    //     {id:401, pId:4, name:"选择", file:"bigdata/common"},
    //
    //     {id:403, pId:4, name:"填空", file:"bigdata/page"},
    //     {id:404, pId:4, name:"编程", file:"core/noicon"},
    //
    //
    //     {id:5, pId:0, name:"第五章  系统", open:false},
    //     {id:501, pId:5, name:"选择", file:"super/oneroot"},
    //
    //     {id:503, pId:5, name:"填空", file:"super/singlepath"},
    //     {id:504, pId:5, name:"编程", file:"core/noicon"},
    //
    //
    //     {id:6, pId:0, name:"第六章  总结", open:false},
    //     {id:601, pId:6, name:"选择", file:"exhide/common"},
    //
    //     {id:603, pId:6, name:"填空", file:"exhide/radio"},
    //     {id:604, pId:6, name:"编程", file:"core/noicon"},
    //
    //     {id:10101, pId:101, name:"10101 ",icon:"../../css/img/red.jpg", file:"exe.html"},
    //     // {id:10201, pId:102, name:"10201",icon:"../../css/img/green.jpg", file:"panduan.html"},
    //     {id:10301, pId:103, name:"10301",icon:"../../css/img/gray.jpg", file:"tiankong.html"},
    //
    //     {id:10401, pId:104, name:"10401 ",icon:"../../css/img/red.jpg", file:"biancheng.html"},
    //     {id:10402, pId:104, name:"10402",icon:"../../css/img/green.jpg", file:"biancheng.html"},
    //     {id:10403, pId:104, name:"10403",icon:"../../css/img/gray.jpg", file:"biancheng.html"},
    //
    //     {id:20101, pId:201, name:"20101 ",icon:"../../css/img/red.jpg", file:"exe.html"},
    //     // {id:20201, pId:202, name:"20201",icon:"../../css/img/green.jpg", file:"panduan.html"},
    //     {id:20301, pId:203, name:"20301",icon:"../../css/img/gray.jpg", file:"tiankong.html"},
    //
    //     {id:20401, pId:204, name:"20401 ",icon:"../../css/img/red.jpg", file:"biancheng.html"},
    //     {id:20402, pId:204, name:"20402",icon:"../../css/img/green.jpg", file:"biancheng.html"},
    //     {id:20403, pId:204, name:"20403",icon:"../../css/img/gray.jpg", file:"biancheng.html"},
    //
    //     {id:20101, pId:204,name:"20401 ",icon:"../../css/img/red.jpg", file:"exe.html"},
    //     // {id:20201, pId:204,name:"20402 ",icon:"../../css/img/green.jpg", file:"panduan.html"},
    //     {id:20303, pId:204,name:"20403 ",icon:"../../css/img/gray.jpg", file:"tiankong.html"},
    //
    //     {id:30101, pId:301, name:"30101 ",icon:"../../css/img/red.jpg", file:"biancheng.html"},
    //     // {id:30201, pId:302, name:"30201",icon:"../../css/img/green.jpg", file:"biancheng.html"},
    //     {id:30301, pId:303, name:"30301",icon:"../../css/img/gray.jpg", file:"biancheng.html"},
    //
    //     {id:30401, pId:304, name:"30401 ",icon:"../../css/img/red.jpg", file:"exe.html"},
    //     {id:30402, pId:304, name:"30402",icon:"../../css/img/green.jpg", file:"panduan.html"},
    //     {id:30403, pId:304, name:"30403",icon:"../../css/img/gray.jpg", file:"tiankong.html"},
    //
    //     {id:40101, pId:401, name:"40101 ",icon:"../../css/img/red.jpg", file:"core/standardData"},
    //     // {id:40201, pId:402, name:"40201",icon:"../../css/img/green.jpg", file:"core/simpleData"},
    //     {id:40301, pId:403, name:"40301",icon:"../../css/img/gray.jpg", file:"core/noline"},
    //
    //     {id:40401, pId:404, name:"40401 ",icon:"../../css/img/red.jpg", file:"core/standardData"},
    //     {id:40402, pId:404, name:"40402",icon:"../../css/img/green.jpg", file:"core/simpleData"},
    //     {id:40403, pId:404, name:"40403",icon:"../../css/img/gray.jpg", file:"core/noline"},
    //
    //     {id:50101, pId:501, name:"50101 ",icon:"../../css/img/red.jpg", file:"core/standardData"},
    //     // {id:50201, pId:502, name:"50201",icon:"../../css/img/green.jpg", file:"core/simpleData"},
    //     {id:50301, pId:503, name:"50301",icon:"../../css/img/gray.jpg", file:"core/noline"},
    //
    //     {id:50401, pId:504, name:"50401 ",icon:"../../css/img/red.jpg", file:"core/standardData"},
    //     {id:50402, pId:504, name:"50402",icon:"../../css/img/green.jpg", file:"core/simpleData"},
    //     {id:50403, pId:504, name:"50403",icon:"../../css/img/gray.jpg", file:"core/noline"},
    //
    //     {id:60101, pId:601, name:"60101 ",icon:"../../css/img/red.jpg", file:"core/standardData"},
    //     // {id:60201, pId:602, name:"60201",icon:"../../css/img/green.jpg", file:"core/simpleData"},
    //     {id:60301, pId:603, name:"60301",icon:"../../css/img/gray.jpg", file:"core/noline"},
    //
    //     {id:60401, pId:604, name:"60401 ",icon:"../../css/img/red.jpg", file:"core/standardData"},
    //     {id:60402, pId:604, name:"60402",icon:"../../css/img/green.jpg", file:"core/simpleData"},
    //     {id:60403, pId:604, name:"60403",icon:"../../css/img/gray.jpg", file:"core/noline"},
    // ];
// $(function(){
//    console.log($(".ztree").val()) ;
//    var zNodes=$(".ztree").val();
//     var t = $("#tree");
//     t = $.fn.zTree.init(t, setting, zNodes);
//     demoIframe = $("#testIframe");
//     demoIframe.bind("load", loadReady);
//     var zTree = $.fn.zTree.getZTreeObj("tree");
//     zTree.selectNode(zTree.getNodeByParam("id", 101));
//
// });
//
//     function loadReady() {
//         var bodyH = demoIframe.contents().find("body").get(0).scrollHeight,
//             htmlH = demoIframe.contents().find("html").get(0).scrollHeight,
//             maxH = Math.max(bodyH, htmlH), minH = Math.min(bodyH, htmlH),
//             h = demoIframe.height() >= maxH ? minH:maxH ;
//         if (h < 530) h = 530;
//         demoIframe.height(h);
//     }
