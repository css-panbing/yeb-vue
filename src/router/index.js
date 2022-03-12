/**
 * 静态路由的配置
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/views/Login";

Vue.use(VueRouter)

const routes = [
    //外层路由默认跳转到App.vue下的<router-view/>
    {
        path: '/',
        name: 'Login',
        component: Login,
        hidden: true
    },
]

const router = new VueRouter({
    routes
})

export default router