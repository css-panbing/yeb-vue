/**
 * 入口函数
 */
import Vue from 'vue'
import App from './App.vue'
import router from "@/router"
import store from "@/store"
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '/public/css/public.css'
import 'font-awesome/css/font-awesome.css'
import {initMenu} from "@/utils/menu";
import {getRequest} from "@/utils/api";

//全局路由前置守卫（点击菜单路由跳转之前会经过这里）[to:要去的路由 from:离开的路由 next()实现跳转]
router.beforeEach((to, from, next) => {
    if (window.sessionStorage.getItem("tokenStr")) {
        initMenu(router, store);
        //判断用户信息是否存在
        if (!window.sessionStorage.getItem("userInfo")) {
            return getRequest("/admin/info").then(resp => {
                if (resp) {
                    // console.log("用户信息：" + JSON.stringify(resp));
                    //存入用户信息
                    window.sessionStorage.setItem("userInfo", JSON.stringify(resp))
                    next();
                }
            })
        }
        next();
    } else {
        if(to.path == '/'){
            next();
        }else {
            next("/?redirect="+to.path);
        }
    }
})

Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
