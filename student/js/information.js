$(function () {
    $.ajax({
        type:'get',
        url:'http://111.230.31.212/judgement/login/checkLogin',
        dataType:'json',
        success:function (obj) {
            if(obj.code==200){
                $('.nav ul').html(
                    '                    <li class="active"><a href="../Home/homepage.html">首页</a></li>\n' +
                    '                    <li class="exit"><a href="#">退出登录</a></li>');
                if ($.cookie("headimg")) {
                    $(".head img").attr("src", $.cookie("headimg"));
                }
                $('.nav ul').removeClass('left_title');
                $(".head").attr("style","display:block;");
                getmsgperson();
            }
            else{
                $('.nav ul').html(
                    '                    <li class="active"><a href="../Home/homepage.html">首页</a></li>\n' +
                    '                    <li class="login_join"><a href="#">登录</a></li>');
                $('.nav ul').addClass('left_title');
                $(".head").attr("style","display:none;");
                $(".person-basic").html('');
            }
        },
        error:function (msg) {
            console.log(msg.state);
        }
    })

    //退出登录
    $('body').delegate('.exit','click',function () {
        $('#exit').modal();
        $('.btn-success').on('click',function () {
            $.ajax({
                type: "get",
                url: "http://111.230.31.212/judgement/login/logout",
                async: true,       //异步提交
                // dataType: "json",  //javascript object
                success: function (result) {
                    // console.log(result);
                    // $('.nav ul').html(
                    //     '                    <li class="active"><a href="../Home/homepage.html">首页</a></li>\n' +
                    //     '                    <li class="login_join"><a href="#">登录</a></li>');
                    // $('.nav ul').addClass('left_title');
                    //
                    // $(".head").attr("style","display:none;");
                    window.location.href="../Home/homepage.html";
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest,textStatus,errorThrown);
                }
            });
        })
    })


    function getmsgperson() {
        $.ajax({
            type: "get",
            url: "http://111.230.31.212/judgement/studentInfo/getStuInfo",
            async: true,       //异步提交
             // data: { TJUFE-SESSION-ID : $.session.set('SessionID')},//键值对
            xhrFields   : {withCredentials: true},
            crossDomain : true,
            dataType: "json",  //javascript object
            success: function (data) {
                console.log(data);
                $(".person-basic").html('<span>' + data.schoolName + '&nbsp;&nbsp;&nbsp;' + data.departmentName +
                    '&nbsp;&nbsp;&nbsp;  ' + data.professionName + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    data.stuId + ':001&nbsp;&nbsp;&nbsp;姓名:' + data.nickName + '</span>');
                $(".nickName").val(data.nickName);
                $(".email").val(data.email);
                $(".headphoto img").attr("src", data.stuImage);
                $(".sex1").val(data.stuSex);
                $(".qq1").val(data.stuQq);
                $(".wechat1").val(data.stuWechat);
                $(".phone1").val(data.stuTel);
                if(data.code==401){
                    alert(data.message);
                    window.location.href('../Home/homepage.html');
                }

            },
            error: function (xhr) {

                alert("未登录");
                console.log(xhr.status);
            }
        });
    }
    getImg();
    function getImg(){
        var file_btn=$('input[name="file"]')[0];
        file_btn.onchange=function () {
            var file=this.files[0];
            var filename=file.name.substring(file.name.lastIndexOf("."));
            var imgs=[".png",".jpg","gif",".ico"];
            var flag=false;

            for(var i=0; i<imgs.length; i++) {
                if(imgs[i]==filename) {
                    flag=true;
                    break;
                }
            }
            if(flag) {
                var reader=new FileReader();
                reader.readAsDataURL(file);

                reader.onload=function() {
                    $(".headphoto img").attr("src", reader.result);
                }

            }else {
                alert("文件类型不正确，请重新选择");
            }


        }
    }

    $('body').delegate('.save','click',function () {
        var formData = new FormData();//必须是new FormData后台才能接收到
        var file=$('input[name="file"]')[0].files[0];
        if(file!=null&&file!=undefined){
            formData.append("file", file);
        }
        else{
            var img = $(".headphoto img").attr("src");
            var image = new Image();
            image.crossOrigin = '';
            image.src = img;
            image.onload = function(){
             var base64 = getBase64Image(image);
             console.log(base64);
             var file1=convertBase64UrlToBlob(base64);
             console.log(file1);
             formData.append("file",file1);
            }
        }
        var nickName= $(".nickName").val();
        var email=$(".email").val();
        var sex= $(".sex1").val();
        var qq= $(".qq1").val();
        var wechat=$(".wechat1").val();
        var tel=  $(".phone1").val();
        formData.append("nickName", nickName);
        formData.append("email", email);
        formData.append("sex", sex);
        formData.append("qq", qq);
        formData.append("wechat", wechat);
        formData.append("tel", tel);
        $.ajax({
            url: 'http://111.230.31.212/judgement/studentInfo/updateStuInfo',
            type: 'POST',
            cache: false, //上传文件不需要缓存
            data: formData,
            processData: false, // 告诉jQuery不要去处理发送的数据
            contentType: false, // 告诉jQuery不要去设置Content-Type请求头
            success: function (data) {
                if(data.code==401){
                    alert(data.message);
                    window.location.href('../Home/homepage.html');
                }
                else if(data.code==500){
                    alert(data.message);
                    var formData = new FormData();//必须是new FormData后台才能接收到
                        var nickName= $(".nickName").val();
                        var email=$(".email").val();
                        var sex= $(".sex1").val();
                        var qq= $(".qq1").val();
                        var wechat=$(".wechat1").val();
                        var tel=  $(".phone1").val();
                        var img = $(".headphoto img").attr("src");
                        var image = new Image();
                        image.crossOrigin = '';
                        image.src = img;
                        image.onload = function(){
                            var base64 = getBase64Image(image);
                            var file1=convertBase64UrlToBlob(base64);
                            formData.append("file",file1);
                        }

                        formData.append("nickName", nickName);
                        formData.append("email", email);
                        formData.append("sex", sex);
                        formData.append("qq", qq);
                        formData.append("wechat", wechat);
                        formData.append("tel", tel);
                        $.ajax({
                            url: 'http://111.230.31.212/judgement/studentInfo/updateStuInfo',
                            type: 'POST',
                            cache: false, //上传文件不需要缓存
                            data: formData,
                            processData: false, // 告诉jQuery不要去处理发送的数据
                            contentType: false, // 告诉jQuery不要去设置Content-Type请求头
                            success: function (data) {
                                if(data.code==401){
                                    alert(data.message);
                                    window.location.href('../Home/homepage.html');
                                }
                                else if(data.code==500){
                                    alert(data.message);

                                }
                            },
                            error: function (data) {
                                console.log(data.status);
                            }

                    })

                }
            },
            error: function (data) {
               console.log(data.status);
            }
        })

    })
    $('.search-btn').on('click',function(){
        $.session.set('schoolId','00');
        window.location.href='../CourseInfo/searchcourse.html';
    });
    function convertBase64UrlToBlob(base64){
        var urlData =  base64.dataURL;
        var type = base64.type;
        var bytes = window.atob(urlData.split(',')[1]); //去掉url的头，并转换为byte
        //处理异常,将ascii码小于0的转换为大于0
        var ab = new ArrayBuffer(bytes.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }
        return new Blob( [ab] , {type : type});
    }
    /*
      * 图片的绝对路径地址 转换成base64编码 如下代码：
      */
    function getBase64Image(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
        var dataURL = canvas.toDataURL("image/"+ext);
        return {
            dataURL: dataURL,
            type: "image/"+ext
        };
    }
});