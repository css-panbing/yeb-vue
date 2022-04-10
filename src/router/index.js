/**
 * 静态路由的配置
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/views/Login";
import Home from "@/views/Home";
import OnlineChat from "@/views/chat/OnlineChat";

Vue.use(VueRouter)

const routes = [
    //外层路由默认跳转到App.vue下的<router-view/>
    {
        path: '/',
        name: 'Login',
        component: Login,
        hidden: true
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        children:[
            {
                path: '/chat',
                name: '在线聊天',
                component: OnlineChat
            }
        ]
    }
]

const router = new VueRouter({
    routes
})

export default router