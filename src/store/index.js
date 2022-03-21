import Vue from "vue";
import Vuex from "vuex"

Vue.use(Vuex);

export default new Vuex.Store({
    //全局的对象，用来保存所有组件的一个公共的数据
    state: {
        routes: [],
    },
    //改变state里面值的方法
    mutations:{
        //初始化路由
        initRoutes(state, data){
            console.log("初始化路由信息:"+JSON.stringify(data))
            state.routes = data;
        }
    }

})
