import Vue from "vue";
import Vuex from "vuex"
import {getRequest} from "@/utils/api";
import SockJS from "sockjs-client"
import Stomp from "stompjs"

Vue.use(Vuex);

const store = new Vuex.Store({
    //全局的对象，用来保存所有组件的一个公共的数据
    state: {
        routes: [],
        sessions:[],
        admins:[],
        currentSessionId: -1,
        filterKey:'',
        stomp: null
    },
    //改变state里面值的方法
    mutations:{
        //初始化路由
        initRoutes(state, data){
            // console.log("初始化路由信息:"+JSON.stringify(data))
            state.routes = data;
        },
        changeCurrentSessionId(state,id) {
            state.currentSessionId = id;
        },
        addMessage(state,msg) {
            state.sessions[state.currentSessionId-1].messages.push({
                content:msg,
                date: new Date(),
                self:true
            })
        },
        // INIT_DATA (state) {
        //     // 浏览器本地的历史聊天记录
        //     let data = localStorage.getItem('vue-chat-session');
        //     if (data) {
        //         state.sessions = JSON.parse(data);
        //     }
        // },
        INIT_ADMINS(state, data) {
            state.admins = data;
        }
    },
    actions:{
        //建立WS连接
        connect(context){
            context.state.stomp = Stomp.over(new SockJS('/ws/ep'));
            let token = window.sessionStorage.getItem("tokenStr");
            context.state.stomp.connect({'Auth-Token': token}, success => {
                //订阅消息
                context.state.stomp.subscribe('/user/queue/chat', msg => {
                    console.log("消息体："+msg.body);
                })
            }, error => {

            })
        },
        //初始化聊天对象列表
        initAdmins(context) {
            getRequest("/chat/admin").then(resp=>{
                if(resp){
                    context.commit('INIT_ADMINS', resp);
                }
            })
        },
    }
})

store.watch(function (state) {
    return state.sessions
},function (val) {
    console.log('CHANGE: ', val);
    localStorage.setItem('vue-chat-session', JSON.stringify(val));
},{
    deep:true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})

export default store;