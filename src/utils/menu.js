import {getRequest} from "@/utils/api";

export const initMenu = (router, store) =>{
    if(store.state.routes.length > 0){
        //如果路由存在则直接返回
        return;
    }
    getRequest("/system/cfg/menu").then(resp=>{
        if(resp){
            //格式化后端返回的路由信息
            let fmtRoutes = formatRoutes(resp);
            //添加到路由
            router.addRoutes(fmtRoutes);
            //将数据存入Vuex中(mutations中用commit)
            store.commit("initRoutes", fmtRoutes);
            //连接webSocket(actions中用dispatch)
            store.dispatch('connect');
        }
    })
}

export const formatRoutes = (routes) =>{
    let fmtRoutes = []
    routes.forEach(route=>{
        let {
            path,
            component,
            name,
            iconCls,
            children,
        } = route;
        if(children && children instanceof Array){
            // 递归
            children = formatRoutes(children);
        }
        let fmtRoute = {
            path: path,
            name: name,
            iconCls: iconCls,
            children: children,
            component(resolve){
                if(component.startsWith('Home')){
                    require([`@/views/`+component+`.vue`], resolve);
                } else if(component.startsWith('Emp')){
                    require([`@/views/emp/`+component+`.vue`], resolve);
                } else if(component.startsWith('Per')){
                    require([`@/views/per/`+component+`.vue`], resolve);
                } else if(component.startsWith('Sal')){
                    require([`@/views/sal/`+component+`.vue`], resolve);
                } else if(component.startsWith('Sta')){
                    require([`@/views/sta/`+component+`.vue`], resolve);
                } else if(component.startsWith('Sys')){
                    require([`@/views/sys/`+component+`.vue`], resolve);
                }
            }
        }
        fmtRoutes.push(fmtRoute);
    });
    return fmtRoutes;
}