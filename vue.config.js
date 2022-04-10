/**
 * 解决跨域请求
 */

let proxyObj={}

proxyObj['/']={
    ws: false,//websocket
    target: 'http://127.0.0.1:8081',//代理目标地址
    changeOrigin: true,//发送请求头host会被设置成target
    //不重写请求地址
    pathRewrite: {
        '^/':'/'
    }
}

proxyObj['/ws'] = {
    ws: true,
    target: 'ws://127.0.0.1:8081'
}

module.exports={
    lintOnSave: false,
    devServer:{
        host: '127.0.0.1',
        port: 8080,
        //通过代理转发到8081
        proxy: proxyObj
    }
}