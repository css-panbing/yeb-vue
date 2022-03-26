<template>
    <div>
        <div style="display: flex;justify-content: center;margin-top: 10px;">
            <el-input size="small" type="text" placeholder="请输入用户名搜索..." prefix-icon="el-icon-search"
                style="width: 400px;margin-right: 15px;" v-model="queryParams.name" clearable></el-input>
            <el-button size="small" type="primary" @click="initAdmins">搜索</el-button>
        </div>
        <div>
            <el-col :span="8" v-for="(admin, index) in admins" :key="index" >
                <el-card class="box-card" shadow="hover">
                    <div slot="header" class="clearfix">
                        <span>{{ admin.name }}</span>
                        <el-button style="float: right; padding: 3px 0; color: red;" type="text" icon="el-icon-delete"
                            @click="deleteAdmin(admin)"></el-button>
                    </div>
                    <div class="userinfoContent">
                        <div class="image">
                            <img :src="admin.userFace" alt="用户头像" class="userFace">
                        </div>
                        <div class="textContext">
                            <div>用户名：{{admin.name}}</div>
                            <div>手机号码：{{admin.phone}}</div>
                            <div>电话号码：{{admin.telephone}}</div>
                            <div>地址：{{admin.address}}</div>
                            <div>用户状态：
                                <el-switch @change="enabledChange(admin)" v-model="admin.enabled" active-text="启用" inactive-text="禁用"></el-switch>
                            </div>
                            <div>用户角色：
                                <el-tag size="mini" type="success" v-for="(role, i) in admin.roles"
                                        :key="i" style="margin-right: 5px;">
                                    {{role.nameZh}}
                                </el-tag>
                                <el-popover
                                    placement="right"
                                    title="角色列表"
                                    width="240"
                                    @show="showSelectRoles(admin)"
                                    @hide="hideSelectRoles(admin)"
                                    trigger="click">
                                    <el-select v-model="selectRoles" multiple placeholder="请选择">
                                        <el-option
                                            v-for="item in allRoles"
                                            :key="item.id"
                                            :label="item.nameZh"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                    <el-button slot="reference" type="text" icon="el-icon-more"></el-button>
                                </el-popover>
                            </div>
                            <div>备注：{{admin.remark}}</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </div>
    </div>
</template>

<script>
import {deleteRequest, getRequest, putRequest} from "@/utils/api";
import {Message, MessageBox} from "element-ui";

export default {
    name: "SysAdmin",
    data(){
        return{
            queryParams: {
                name: ''
            },
            admins: [],
            allRoles: [],
            selectRoles: [],
        }
    },
    methods: {
        //通过用户名搜索操作员
        initAdmins(){
            getRequest("/system/admin/", this.queryParams).then(resp=>{
                if(resp){
                    this.admins = resp;
                }
            })
        },
        //删除操作员
        deleteAdmin(admin){
            MessageBox.confirm('此操作将永久删除【'+admin.name+'】操作员，是否继续？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                deleteRequest("/system/admin/"+admin.id).then(resp=>{
                    if(resp){
                        this.initAdmins();
                    }
                })
            }).catch(() => {
                Message.info({type: 'info', message: '已取消删除'})
            });
        },
        //更新操作员信息
        enabledChange(admin){
            putRequest("/system/admin/", admin).then(resp=>{
                if(resp){
                    this.initAdmins();
                }
            })
        },
        //获取所有角色信息
        initAllRoles(){
            getRequest("/system/admin/roles/").then(resp=>{
                if(resp){
                    this.allRoles = resp;
                }
            })
        },
        //展示用户角色信息
        showSelectRoles(admin){
            this.initAllRoles();
            let roles = admin.roles;
            this.selectRoles = [];
            roles.forEach(role=>{
                this.selectRoles.push(role.id);
            })
        },
        //更新用户角色信息
        hideSelectRoles(admin){
            let roleIds = [];
            admin.roles.forEach(role=>{
                roleIds.push(role.id);
            })
            console.log("角色是否发生改变:"+(JSON.stringify(roleIds.sort()) !== JSON.stringify(this.selectRoles.sort())));
            if(JSON.stringify(roleIds.sort()) !== JSON.stringify(this.selectRoles.sort())){//判断当角色信息发生变更时才触发
                putRequest("/system/admin/adminRoles?adminId="+admin.id+"&rids="+this.selectRoles).then(resp=>{
                    if(resp){
                        this.initAdmins();
                    }
                })
            }
        }
    },
    mounted() {
        this.initAdmins();
    }
}
</script>

<style>
.image{
    display: flex;
    justify-content: center;
    width: 30%;
    float: right;
}
.textContext{
    width: 70%;
    float: right;
    line-height: 25px;/*行间距*/
    margin-bottom: 30px;
}

.userinfoContent{
    font-size: 12px;
}

.userFace{
    width: 50px;
    height: 50px;
    border-radius: 50px;
}

.box-card {
    width: 480px;
    margin-bottom: 15px;
    margin-top: 15px;
}
</style>