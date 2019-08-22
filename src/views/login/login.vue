<template>
  <div class="box">
    <h2>跨境电商后台管理</h2>
    <div class="login">
      <el-form status-icon label-width="40px" class="demo-ruleForm">
          <el-form-item>
              <el-input type="text" v-model="FormData.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item>
              <el-input type="password" v-model="FormData.password" show-password placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click='checkUser' id="dl">登录</el-button>
          </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {userlogin} from '../../api/index.js'
  export default {
    data() {
      return {
        FormData: {
          username:'admin',
          password:'admin'
        },
      }
    },
    created () {
      
    },
    mounted(){

    },
    methods: {
      checkUser() {
        const params = { loginName: this.FormData.username, loginPasswd: this.FormData.password};
        userlogin(params).then((res) => {
          if (res != []) {
            this.$message({
              message: '登录成功',
              type: 'success'
            });
            this.$router.push('system/product');
          }else{
            this.$message({
              message: '登录失败',
              type: 'error'
            });
          }
        }).catch((error) => {

        }).then(() => {
          
        });
      }   
    }

  };
</script>

<style>
  .box{
    width: 100%;
    height: 100%;
    background-image:url('../../assets/login.jpg');
    background-repeat:no-repeat;background-size:100% 100%;
    color:#333;
  }
  .login{
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);   
    z-index:999;
    width:360px;
    height:auto;
    background:rgba(225,225,225,.2);
    padding:60px 40px 60px 0;
  }
  h2{
    color:#fff;
    text-align:center;
    padding-top:110px;
    padding-bottom:30px;
  }
  #dl{
        width:100%;
    }
</style>
