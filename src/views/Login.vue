<template>
    <div>
        <el-form :rules="rules"
                 v-loading="loading"
                 element-loading-text="正在登录..."
                 element-loading-spinner="el-icon-loading"
                 element-loading-svg-view-box="-10, -10, 50, 50"
                 element-loading-background="rgba(0, 0, 0, 0.8)"
                 ref="loginForm"
                 :model="loginForm"
                 class="loginContainer">
            <h3 class="loginTitle">系统登录</h3>
            <el-form-item prop="username">
                <!--prop中的名称与校验规则中的属性名称相对性-->
                <el-input type="text" autocomplete="false" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" autocomplete="false" v-model="loginForm.password"
                          placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input type="text" autocomplete="false" v-model="loginForm.code" placeholder="点击图片刷新验证码"
                          style="width: 250px;margin-right: 5px"></el-input>
                <img :src="captchaUrl" @click="updateCaptcha">
            </el-form-item>
            <el-checkbox v-model="checked" class="loginRemember">记住我</el-checkbox>
            <el-button type="primary" style="width: 100%" @click="submitLogin">登录</el-button>
        </el-form>
    </div>
</template>

<script>
import {postRequest} from "@/utils/api";

export default {
    name: "Login",
    data() {
        return {
            loading: false,
            captchaUrl: '/yeb/captcha?time=' + new Date(),
            loginForm: {
                username: 'admin',
                password: '123',
                code: ''
            },
            checked: true,
            rules: {
                username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                password: [{required: true, message: '请输入密码', trigger: 'blur'}],
                code: [{required: true, message: '请输入验证码', trigger: 'blur'}]
            }
        }
    },
    methods: {
        // 刷新验证码
        updateCaptcha() {
            this.captchaUrl = '/yeb/captcha?time=' + new Date()
        },
        // 登录
        submitLogin() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    postRequest("/login", this.loginForm).then(resp => {
                        if (resp) {
                            //存储用户token
                            const tokenStr = resp.data.tokenHead + resp.data.token;
                            window.sessionStorage.setItem("tokenStr", tokenStr);
                            //跳转到首页
                            // this.$router.replace('/home');
                            // 判断用户有没有直接输入访问地址，有则直接跳转，没有则跳转到首页
                            let path = this.$route.query.redirect;
                            this.$router.replace((path == '/' || path == undefined) ? '/home' : path)
                        }
                        this.loading = false;
                    })
                } else {
                    this.$message.error("请输入所有字段！")
                    return false;
                }
            })
        },
    }
}
</script>

<style>
.loginContainer {
    width: 350px;
    border-radius: 15px;
    background-clip: padding-box; /*规定背景的绘制区域*/
    margin: 200px auto;
    padding: 15px 35px;
    border: 1px solid #d7cdcd;
    box-shadow: 0 0 5px #b5b0b0;
}

.loginTitle {
    text-align: center;
}

.loginRemember {
    text-align: left;
    margin: 0px 0px 10px 0px;
}

.el-form-item__content {
    display: flex;
    align-items: center;
}
</style>