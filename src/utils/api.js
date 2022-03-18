/**
 * 封装请求响应
 */
import axios from "axios";
import {Message} from "element-ui";
import router from "@/router";

/**
 * 请求拦截器
 */
axios.interceptors.request.use(config => {
    //如果存在token，请求中携带token
    if(window.sessionStorage.getItem("tokenStr")){
        config.headers['Authorization'] = window.sessionStorage.getItem("tokenStr");
    }
    return config;
}, error => {
    //Message 拥有可控的duration，设置0为不会被自动关闭，默认为 3000 毫秒
    Message.error({message: "请求拦截异常："+error, showClose: true, duration: 10000})
})

/**
 * 响应拦截器
 */
axios.interceptors.response.use(success=>{
    //接口访问成功，但是业务逻辑错误
    if(success.status && success.status == 200){
        if(success.data.code==500||success.data.code==401||success.data.code==403){
            Message.error({message: success.data.message, showClose: true, duration: 10000});
            return;
        }
        if(success.data.message){
            Message.success({message: success.data.message})
        }
    }
    return success.data;
}, error => {
    //接口访问失败
    if(error.response.code==504||error.response.code==404){
        Message.error({message: "服务器宕机了", showClose: true, duration: 10000})
    }else if(error.response.code==403){
        Message.error({message: "权限不足，请联系管理员", showClose: true, duration: 10000})
    }else if(error.response.code==401){
        Message.error({message: "尚未登录，请登录", showClose: true, duration: 10000})
        router.replace("/").then()
    }else {
        if(error.response.data.message){
            Message.error({message: error.response.data.message, showClose: true, duration: 10000})
        }else{
            Message.error({message: "未知错误", showClose: true, duration: 10000})
        }
    }
    return;
});

let base = '/yeb';
//传送JSON格式的POST请求
export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    })
}

//传送JSON格式的PUT请求
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    })
}

//传送JSON格式的Get请求
export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        data: params
    })
}

//传送JSON格式的DELETE请求
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: params
    })
}