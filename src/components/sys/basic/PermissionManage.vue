<template>
    <div>
        <el-input placeholder="请输入角色英文名称" v-model="role.name" size="small"
                  style="width: 300px;margin-right: 10px;" clearable>
            <template slot="prepend">ROLE_</template>
        </el-input>
        <el-input placeholder="请输入角色中文名称" v-model="role.nameZh" size="small"
                  style="width: 300px;margin-right: 10px;" clearable></el-input>
        <el-button type="primary" size="small" @click="addRole">添加角色</el-button>

        <!--折叠面板 accordion:手风琴模式，一次只能打开一个面板-->
        <el-collapse v-model="activeName" accordion style="margin-top: 20px;width: 700px;" @change="collapseChange">
            <el-collapse-item v-for="(item, index) in roleList" :key="index" :title="item.nameZh" :name="item.id">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>可访问资源</span>
                        <el-button style="float: right; padding: 0; color: red;" icon="el-icon-delete"
                                   title="删除角色" @click="deleteRole(item.nameZh)"></el-button>
                    </div>
                    <div>
                        <!--通过default-expanded-keys和default-checked-keys设置默认展开和默认选中的节点。需要注意的是，此时必须设置node-key，其值为节点数据中的一个字段名，该字段在整棵树中是唯一的。-->
                        <el-tree
                            ref="tree"
                            :data="allMenus"
                            node-key="id"
                            show-checkbox
                            default-expand-all
                            :default-checked-keys="defaultCheckedKeys"
                            :props="defaultProps">
                        </el-tree>
                        <div style="display: flex;justify-content: flex-end">
                          <el-button size="mini" @click="cancelUpdate">取消修改</el-button>
                          <el-button size="mini" type="primary" @click="doUpdate(item.id,index)">确认修改</el-button>
                        </div>
                    </div>
                </el-card>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
import {deleteRequest, getRequest, postRequest, putRequest} from "@/utils/api";
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
            activeName: -1,
            defaultCheckedKeys: [],
            roleId: '',//折叠面板当前展开的角色id
        }
    },
    mounted() {
        this.initRoles();
    },
    methods:{
        //新增角色
        addRole(){
            if(this.role.name == ''){
                Message.error({message: "角色英文名称不能为空！"});
            }else if(this.role.nameZh == ''){
                Message.error({message: "角色中文名称不能为空！"});
            }else{
                postRequest("/system/basic/permission/role/", this.role).then(resp=>{
                    if(resp){
                        this.role.name = '';
                        this.role.nameZh = '';
                        this.initRoles();
                    }
                })
            }
        },
        //取消修改，关闭下拉选
        cancelUpdate(){
            this.activeName = -1;
        },
        doUpdate(rid, index){
            let tree = this.$refs.tree[index];
            let checkedKeys = tree.getCheckedKeys(true);
            putRequest("/system/basic/permission/role/menus/?rid="+rid+"&mids="+checkedKeys);
        },
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
                this.allMenus = [];
                this.defaultCheckedKeys = [];
                this.initMenusByRole(rid);
            }
        },
        //初始化菜单树和角色关联菜单一起做
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