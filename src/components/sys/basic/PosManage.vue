<template>
    <div>
        <div>
            <!-- @keydown.enter.native 键盘回车事件 -->
            <el-input size="small" placeholder='请填写职位名称'
                v-model="pos.name" class="addPosInput" clearable
                @keydown.enter.native="addPosition"></el-input>
            <el-button type="primary" size="small" @click="addPosition">添加</el-button>

            <el-button type="danger" size="small"
                       :disabled="this.multipleSelection.length==0"
                @click="multipleDelete">批量删除</el-button>
        </div>
        <div class="posTable">
            <el-table :data="positions" style="width: 55%; margin-bottom: 15px;"
                      @selection-change="handleSelectionChange"
                      border stripe size="small">
                <el-table-column type="selection" width="40" align="center"></el-table-column>
                <el-table-column prop="id" label="编号" width="50" align="center"></el-table-column>
                <el-table-column prop="name" label="职位" width="200" align="center"></el-table-column>
                <el-table-column prop="createDate" label="创建时间" width="200" align="center"></el-table-column>
                <el-table-column prop="enabled" label="是否启用" width="200" align="center">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.enabled" active-color="" inactive-color="" disabled></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="showEditView(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="deletePos(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="编辑职位" :visible.sync="dialogFormVisible" width="25%">
            <div>
                <el-tag>职位名称</el-tag>
                <el-input v-model="updatePos.name" size="small" style="width: 350px; margin-left: 10px;"></el-input>
            </div>
            <div style="margin-top: 10px;">
                <el-tag>是否启用</el-tag>
                <el-switch style="margin-left: 10px;" v-model="updatePos.enabled" active-color="" inactive-color=""
                           active-text="已启用" inactive-text="已禁用"></el-switch>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
                <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {deleteRequest, getRequest, postRequest, putRequest} from "@/utils/api";
import {Message, MessageBox} from "element-ui";

export default {
    name: "PosManage",
    data(){
        return{
            pos: {
                name: ''
            },
            updatePos:{
                name: '',
                enabled: false,
            },
            positions: [],
            dialogFormVisible: false,
            multipleSelection: [],//多选选中的值
        }
    },
    mounted() {
        this.initPositions();//初始化职位数据
    },
    methods:{
        //多选框改变事件
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //批量删除
        multipleDelete(){
            MessageBox.confirm('此操作将永久删除 '+this.multipleSelection.length+'条 职位，是否继续？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                let ids = "";
                this.multipleSelection.forEach(pos=>{
                    ids += pos.id + ',';
                })
                deleteRequest("/system/cfg/position/?ids="+ids).then(resp=>{
                    if(resp){
                        this.initPositions();
                    }
                })
            }).catch(() => {
                Message.info({type: 'info', message: '已取消删除'})
            })
        },
        initPositions(){
            getRequest("/system/cfg/position/").then(resp=>{
                if(resp){
                    this.positions = resp;
                }
            })
        },
        showEditView(index, data){
            // this.updatePos = data;
            Object.assign(this.updatePos, data);
            this.updatePos.createDate = '';
            this.dialogFormVisible = true;
        },
        doUpdate(){
          putRequest("/system/cfg/position/", this.updatePos).then(resp=>{
             if(resp){
                 this.initPositions();
                 this.dialogFormVisible = false;
             }
          });
        },
        deletePos(index, data){
            MessageBox.confirm('此操作将永久删除【'+data.name+'】职位，是否继续？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                deleteRequest("/system/cfg/position/"+data.id).then(resp=>{
                    if(resp){
                        this.initPositions();
                    }
                })
            }).catch(() => {
                Message.info({type: 'info', message: '已取消删除'})
            })
        },
        addPosition(){
            if(this.pos.name){
                postRequest("/system/cfg/position/", this.pos).then(resp=>{
                    if(resp){
                        this.initPositions();
                        this.pos.name = '';
                    }
                })
            }else {
                Message.error({message: '职位名称不能为空！！'})
            }
        },
        handleSizeChange(val){
            Message.info("改变每页条数为："+val);
        },
        handleCurrentChange(val){
            Message.info("跳转到"+val+"页");
        }

    }
}
</script>

<style>
.addPosInput{
    width: 300px;
    margin-right: 10px;
}
.posTable{
    margin-top: 10px;
}
</style>