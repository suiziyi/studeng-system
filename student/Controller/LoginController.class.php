<?php
namespace Home\Controller;
use Think\Controller;

class LoginController extends Controller{

    public function index()
    {
        $this->display();
    }

    public function login(){
        $this->display();
    }
    public function forgetpass(){
        $this->display();
    }
    public function userinfo(){
        $stu_id =  session(C('USER_AUTH_KEY'));
        $student = M('student');
        $info = $student -> where(array('stu_id'=>$stu_id))->find();
        $class = M('naturalclass');
        $class_info = $class->where(array('cla_id'=>$info['cla_id']))->getField('cla_name');
        $info['cla_name'] = $class_info;
        $this->assign('StuInfo',$info);
        $this->display();
    }

    public function check_login() {
        if (empty($_POST['form_username'])) {
            $this -> error('帐号必须');
        } else if (empty($_POST['form_password'])) {
            $this -> error('密码必须');
        }
        $map = array();
        $map['stu_id'] = $_POST['form_username'];
        $map['stu_password']=$_POST['form_password'];
        $Student = M("student");
        $is_exist = $Student -> where($map)->find();//select()
        if($is_exist){
//          header('Location: ' . U("Home/homepage"));
            session(C('USER_AUTH_KEY'), $is_exist['stu_id']);
            $result['state'] = true;
            $result['info']  = '登录成功';


        }else{
//          $this->error("");
            $result['state'] = false;
            $result['info']  = '账号和密码不匹配，请重新输入';
        }
        echo json_encode($result);
    }


}

?>