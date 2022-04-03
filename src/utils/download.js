import {Message} from "element-ui";
import axios from "axios";

const service = axios.create({
    responseType: 'arraybuffer'
})

/**
 * 请求拦截器
 */
service.interceptors.request.use(config=>{
    if(window.sessionStorage.getItem("tokenStr")){
        config.headers["Authorization"] = window.sessionStorage.getItem("tokenStr");
    }
    return config;
}, error => {
    Message.error({message: "请求异常："+error, showClose: true, duration: 5000})
})

/**
 * 响应拦截器
 */
service.interceptors.response.use(resp=>{
    const headers = resp.headers;
    let reg = RegExp(/application\/json/);//定义正则表达式
    if(headers['content-type'].match(reg)){
        //普通接口请求
        resp.data = uintToString(resp.data);
    }else{
        //返回流
        let fileDownload = require('js-file-download');
        let fileName = headers['content-disposition'].split(';')[1].split('filename=')[1];
        let contentType = headers['content-type'];
        fileName = decodeURIComponent(fileName);
        fileDownload(resp.data, fileName, contentType);
    }
}, error => {
    Message.error({message: "响应异常："+error, showClose: true, duration: 5000})
})

function uintToString(uintArray){
    let encodedString = String.fromCharCode.apply(null, new Uint8Array(uintArray))
    let decodedString = decodeURIComponent(escape(encodedString));
    return JSON.parse(decodedString);
}

let base = '/yeb';
export const downloadRequest=(url, params)=>{
    return service({
        method: 'get',
        url: `${base}${url}`,
        data: params
    })
}

export default service;