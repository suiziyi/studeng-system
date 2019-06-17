$(function(){
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL);
    });
    var teachingClassId=parent.$('input[name="teachingClassId"]').attr('value');
    $('.div_hidden input[name="teachingClassId"]').attr('value',teachingClassId);

    // console.log(teachingClassId);
   $.ajax({
       type: 'get',
       url: "http://111.230.31.212/judgement/examination/getExamsInfo",
       dataType: "json",
       async: true,
       data: {
           "teachingClassId": parseInt(teachingClassId)
       },
       success: function (obj) {
           if(obj.code==401){
               alert(obj.message);
               window.location.href('../Home/homepage.html');
           }
           else if(obj.code==403){
               alert(obj.message);
           }

           // var obj1=obj.examInfos;
          // console.log(obj);
           $('#mid .div_end').find('label').text(obj[0].endDate);
           $('#mid .div_time').find('label').text(obj[0].timeLimit);
           $('#mid .div_left').find('label').text(obj[0].remainExamCount);
           $('#end .div_end').find('label').text(obj[1].endDate);
           $('#end .div_time').find('label').text(obj[1].timeLimit);
           $('#end .div_left').find('label').text(obj[1].remainExamCount);
           $.session.set('timemid',obj[0].timeLimit);
           $.session.set('timeend',obj[1].timeLimit);
           if(obj[0].isTerminated==true){
              $('#mid .mid_btn').html('<a class="btn_default" href="##" style="color:white;background:gray; ">已结束</a></li>');
           }
           else{
               if(obj[0].remainTestCount!=0){
                   $('#mid .mid_btn').html('<a class="btn_default" href="midsemester.html" >进入考试</a></li>');
               }
               else{
                   $('#mid .mid_btn').html('<a class="btn_default" href="##" style="color:white;background:gray; ">次数已用完</a></li>');

               }
           }
           if(obj[1].isTerminated==true){
               $('#end .end_btn').html('<a class="btn_default" href="##" style="color:white;background:gray; ">已结束</a></li>');
           }
           else{
               if(obj[1].remainTestCount!=0){
                   $('#end .end_btn').html('<a class="btn_default" href="endsemester.html" >进入考试</a></li>');
               }
               else{
                   $('#end .end_btn').html('<a class="btn_default" href="##" style="color:white;background:gray; ">次数已用完</a></li>');

               }
           }
       },
       error: function (msg) {
           console.log(msg.status);
       }
   }) ;

});