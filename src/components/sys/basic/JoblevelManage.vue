<template>
    <div>
        <div>
            <el-input size="small" placeholder='请填写职称名称' v-model="jobLevel.name"
                      style="width: 300px; margin-right: 10px;" clearable></el-input>
            <el-select v-model="jobLevel.titleLevel" size="small" style="margin-right: 10px;" clearable placeholder="请选择职称等级">
                <el-option
                    v-for="item in jobLevelOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-button type="primary" size="small" @click="addJobLevel">添加</el-button>

            <el-button type="danger" size="small"
                       :disabled="this.multipleSelection.length==0"
                       @click="multipleDelete">批量删除</el-button>
        </div>
        <div class="jobLevelTable">
            <el-table :data="jobLevels" style="width: 70%;"
                      @selection-change="handleSelectionChange"
                      border stripe size="small">
                <el-table-column type="selection" width="40" align="center"></el-table-column>
                <el-table-column prop="id" label="编号" width="50" align="center"></el-table-column>
                <el-table-column prop="name" label="职称名称" width="200" align="center"></el-table-column>
                <el-table-column prop="titleLevel" label="职称等级" width="200" align="center"></el-table-column>
                <el-table-column prop="createDate" label="创建时间" width="200" align="center"></el-table-column>
                <el-table-column prop="enabled" label="是否启用" width="200" align="center">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.enabled" active-color="" inactive-color="" disabled></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="showEditView(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="deleteJobLevel(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="编辑职称" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="25%">
            <div>
                <el-tag>职称名称</el-tag>
                <el-input v-model="updateJobLevel.name" size="small" style="width: 350px; margin-left: 10px;"></el-input>
            </div>
            <div style="margin-top: 10px;">
                <el-tag>职称等级</el-tag>
                <el-select v-model="updateJobLevel.titleLevel" size="small" style="width: 350px; margin-left: 10px;" clearable placeholder="请选择职称等级">
                    <el-option
                        v-for="item in jobLevelOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div style="margin-top: 10px;">
                <el-tag>是否启用</el-tag>
                <el-switch style="margin-left: 10px;" v-model="updateJobLevel.enabled" active-color="" inactive-color=""
                           active-text="已启用" inactive-text="已禁用"></el-switch>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {deleteRequest, getRequest, postRequest, putRequest} from "@/utils/api";
import {Message, MessageBox} from "element-ui";

export default {
    name: "JoblevelManage",
    data(){
        return{
            jobLevel: {
                name: '',
                titleLevel: '',
            },
            updateJobLevel:{
                name: '',
                titleLevel: '',
                enabled: false,
            },
            jobLevels: [],
            dialogFormVisible: false,
            multipleSelection: [],//多选选中的值
            jobLevelOptions: [
                {value: '正高级', label: '正高级'},
                {value: '副高级', label: '副高级'},
                {value: '中级', label: '中级'},
                {value: '初级', label: '初级'},
            ]
        }
    },
    mounted() {
        this.initJobLevels();//初始化职称数据
    },
    methods: {
        initJobLevels(){
            getRequest("/system/basic/joblevel/").then(resp=>{
                this.jobLevels = resp;
            })
        },
        showEditView(index, data){
            Object.assign(this.updateJobLevel, data);
            this.updateJobLevel.createDate = '';
            this.dialogFormVisible = true;
        },
        doUpdate(){
            putRequest("/system/basic/joblevel/", this.updateJobLevel).then(resp=>{
                if(resp){
                    this.initJobLevels();
                    this.dialogFormVisible = false;
                }
            });
        },
        addJobLevel(){
            if(this.jobLevel.name == ''){
                Message.error({message: '职称名称不能为空！'})
            }else if(this.jobLevel.titleLevel == ''){
                Message.error({message: '职称等级不能为空！'})
            }else{
                postRequest("/system/basic/joblevel/", this.jobLevel).then(resp=>{
                    if(resp){
                        this.jobLevel.name = '';
                        this.jobLevel.titleLevel = '';
                        this.initJobLevels();
                    }
                })
            }
        },
        deleteJobLevel(index, data){
            MessageBox.confirm('此操作将永久删除【'+data.name+'】职称，是否继续？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                deleteRequest("/system/basic/joblevel/"+data.id).then(resp=>{
                    if(resp){
                        this.initJobLevels();
                    }
                })
            }).catch(() => {
                Message.info({type: 'info', message: '已取消删除'})
            })
        },
        //多选改变事件
        handleSelectionChange(val){
            this.multipleSelection = val;
        },
        //批量删除
        multipleDelete(){
            MessageBox.confirm('此操作将永久删除 '+this.multipleSelection.length+'条 职称，是否继续？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                let ids = "";
                this.multipleSelection.forEach(joblevel=>{
                    ids += joblevel.id + ',';
                })
                deleteRequest("/system/basic/joblevel/?ids="+ids).then(resp=>{
                    if(resp){
                        this.initJobLevels();
                    }
                })
            }).catch(() => {
                Message.info({type: 'info', message: '已取消删除'})
            })
        }
    }
}
</script>

<style scoped>
.jobLevelTable{
    margin-top: 10px;
}
</style>