<template>
    <div>
        <div>
            <el-input size="small" placeholder='请输入部门名称' v-model="queryParams.name"
                      style="width: 300px; margin-right: 10px;" clearable></el-input>
            <el-button type="primary" size="small" @click="query">查询</el-button>
            <el-button type="primary" size="small" @click="openAddDeptDialog">新增部门</el-button>
        </div>
        <div style="margin-top: 10px;">
            <el-table size="small"
                :data="deptData"
                row-key="id"
                style="width: 60%;"
                border stripe
                default-expand-all
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column prop="name" label="部门名称" align="left" width="300"></el-table-column>
                <el-table-column prop="enabled" label="状态" align="center" width="206">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enabled ? '' : 'danger'">{{ scope.row.enabled ? '正常' : '停用' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createDate" label="创建时间" align="center" width="200"></el-table-column>
                <el-table-column label="操作" align="center" width="300">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="openAddDeptDialog(scope.$index, scope.row)">新增子部门</el-button>
                        <el-button size="mini" type="danger" @click="deleteDept(scope.$index, scope.row)">删除部门</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog title="新增部门" :visible.sync="dialogFormVisible" width="600px" >
            <el-form ref="deptForm" :model="dept" :rules="rules" label-width="80px">
                <el-row>
                    <el-col>
                        <el-form-item label="上级部门" prop="parentId">
                            <treeselect v-model="dept.parentId"  :disabled="disabled" :options="deptSelectTree" :normalizer="normalizer" placeholder="请选择上级部门" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item label="部门名称" prop="name">
                            <el-input v-model="dept.name" placeholder="请输入部门名称" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="text-align: right;">
                    <el-button size="small" type="primary" @click="addDept">确 定</el-button>
                    <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
                </el-row>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import {deleteRequest, getRequest, postRequest} from "@/utils/api";
import {Message, MessageBox} from "element-ui";
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
    name: "DepManage",
    components: { Treeselect },
    data(){
        return{
            queryParams: {
                name: ''
            },
            dept:{
              name: '',
              parentId: null,
            },
            deptData: [],
            deptSelectTree: [],
            dialogFormVisible: false,
            rules:{
                name: [{required: true, message: '请输入部门名称', trigger: 'blur'}],
                parentId: [{required: true, message: '请选择上级部门', trigger: 'blur'}],
            },
            disabled: false,
            normalizer(node) {
                return {
                    id: node.value,
                    label: node.label,
                    children: node.children && node.children.length > 0 ? node.children : 0,
                }
            },
        }
    },
    watch:{

    },
    methods:{
        query(){
          if(this.queryParams.name == ''){
              this.initDeptData();
          } else if(this.queryParams.name != ''){
              this.queryDeptByParams();
          }
        },
        //通过查询条件查询部门
        queryDeptByParams(){
            getRequest("/system/basic/department/list", this.queryParams).then(resp=>{
               this.deptData = resp;
            });
        },
        //初始化部门数据
        initDeptData(){
            getRequest("/system/basic/department/").then(resp=>{
                this.deptData = resp;
            })
        },
        //打开新增部门页面
        openAddDeptDialog(index, data){
            if(data != undefined){//新增子部门
                this.dept.parentId = data.id;
                this.disabled = true;
            }else {//新增部门
                this.dept.name = null;
                this.dept.parentId = null;
                this.disabled = false;
            }
            this.dialogFormVisible = true;
            //初始化部门下拉树
            getRequest("/system/basic/department/selectTree").then(resp=>{
                this.deptSelectTree = resp;
            })
        },
        //新增部门
        addDept(){
            this.$refs.deptForm.validate((valid) => {
                if (valid) {
                    postRequest("/system/basic/department/", this.dept).then(resp=>{
                        if(resp){
                            this.initDeptData();
                            this.dialogFormVisible = false;
                        }
                    });
                }
            });
        },
        //删除部门
        deleteDept(index, data){
            MessageBox.confirm('此操作将永久删除【'+data.name+'】部门，是否继续？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                if(data.isParent){
                    Message.error("该部门存在子部门，无法删除！")
                }else {
                    deleteRequest("/system/basic/department/"+data.id).then(resp=>{
                        if(resp){
                            this.initDeptData();
                        }
                    })
                }
            }).catch(() => {
                Message.info({type: 'info', message: '已取消删除'})
            });
        },
    },
    mounted() {
        this.initDeptData();
    }
}
</script>

<style scoped>

</style>