<template>
    <div>
        <el-input placeholder="请输入角色英文名称" v-model="role.name" size="small"
                  style="width: 300px;margin-right: 10px;" clearable>
            <template slot="prepend">ROLE_</template>
        </el-input>
        <el-input placeholder="请输入角色中文名称" v-model="role.nameZh" size="small"
                  style="width: 300px;margin-right: 10px;" clearable></el-input>
        <el-button type="primary" size="small">添加角色</el-button>

        <!--折叠面板 accordion:手风琴模式，一次只能打开一个面板-->
        <el-collapse accordion style="margin-top: 20px;width: 700px;" @change="collapseChange">
            <el-collapse-item v-for="(item, index) in roleList" :key="index" :title="item.nameZh" :name="item.id">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>可访问资源</span>
                        <el-button type="danger" style="float: right; padding: 0;" icon="el-icon-delete"
                                   title="删除角色" @click="deleteRole(item.nameZh)"></el-button>
                    </div>
                    <div>
                        <!--通过default-expanded-keys和default-checked-keys设置默认展开和默认选中的节点。需要注意的是，此时必须设置node-key，其值为节点数据中的一个字段名，该字段在整棵树中是唯一的。-->
                        <el-tree
                            :data="allMenus"
                            node-key="id"
                            show-checkbox
                            :default-expanded-keys="defaultExpandedKeys"
                            :default-checked-keys="defaultCheckedKeys"
                            :props="defaultProps">
                        </el-tree>
                    </div>
                </el-card>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
import {deleteRequest, getRequest} from "@/utils/api";
import {Message, MessageBox} from "element-ui";

export default {
    name: "PermissionManage",
    data(){
        return{
            roleList:{},
            role:{
                name: '',
                nameZh: ''
            },
            allMenus:[],
            defaultProps:{
                children: 'children',
                label: 'name'
            },
            defaultExpandedKeys: [],
            defaultCheckedKeys: [],
            roleId: '',//折叠面板当前展开的角色id
        }
    },
    mounted() {
        this.initRoles();
    },
    methods:{
        //删除角色信息
        deleteRole(name){
            MessageBox.confirm('此操作将永久删除【'+name+'】角色，是否继续？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                deleteRequest("/system/basic/permission/role/"+this.roleId).then(resp=>{
                    if(resp){
                        this.initRoles();
                    }
                })
            }).catch(() => {
                Message.info({type: 'info', message: '已取消删除'})
            });
        },
        //初始化所有的角色信息
        initRoles(){
            getRequest("/system/basic/permission/roles/").then(resp=>{
                if(resp){
                    this.roleList = resp;
                }
            })
        },
        //折贴面板改变事件(rid绑定的是手风琴的name属性，展开时有值、关闭时没有值)
        collapseChange(rid){
            if(rid){
                this.roleId = rid;
                this.initMenusByRole(rid);
            }else {
                this.defaultCheckedKeys = '';
                this.roleId = '';
            }
        },
        initMenusByRole(rid){
            getRequest("/system/basic/permission/menus/role/"+rid).then(resp=>{
                if(resp){
                    this.allMenus = resp.menus;
                    this.defaultCheckedKeys = resp.menuIds;
                }
            })
        }
        /*//初始化所有的菜单
        initAllMenus(){
            getRequest("/system/basic/permission/menus/").then(resp=>{
                this.allMenus = resp;
            })
        },
        //获取角色关联的菜单
        getMenusByRoles(rid){
            getRequest("/system/basic/permission/menuIds/"+rid).then(resp=>{
                this.defaultCheckedKeys = resp;
            })
        }*/
    }
}
</script>

<style scoped>

</style>