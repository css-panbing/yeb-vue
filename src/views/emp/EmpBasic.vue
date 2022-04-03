<template>
    <div>
        <div>
            <div style="display: flex;justify-content: space-between">
                <div>
                    <el-input style="width: 300px;margin-right: 20px;"
                              size="small" prefix-icon="el-icon-search"
                              placeholder="请输入员工名进行搜索..."
                              v-model="name"
                              @keydown.enter.native="initEmpData"
                              @clear="initEmpData"
                              :disabled="showAdvanceSearchVisible"
                              clearable></el-input>
                    <el-button type="primary" size="small" icon="el-icon-search" @click="initEmpData" :disabled="showAdvanceSearchVisible">搜索</el-button>
                    <el-button type="primary" size="small" @click="showAdvanceSearchVisible = !showAdvanceSearchVisible">
                        <i :class="showAdvanceSearchVisible ? 'fa fa-angle-double-up' : 'fa fa-angle-double-down'" aria-hidden="true"></i>
                        高级搜索
                    </el-button>
                </div>
                <div>
                    <el-button type="primary" size="small" icon="el-icon-plus" @click="openAddEmpDialog">添加员工</el-button>
                    <el-upload style="display: inline-flex; margin: 0 10px 0 10px"
                        action="/yeb/employee/basic/import"
                        :headers="headers"
                        :show-file-list="false"
                        :before-upload="beforeUpload"
                        :on-success="onSuccess"
                        :on-error="onError"
                        :disabled="importDataBtnDisabled">
                        <el-button type="success" size="small" :icon="importDataBtnIcon">
                            {{importDataBtnText}}
                        </el-button>
                    </el-upload>
                    <el-button @click="exportData" type="success" size="small" icon="el-icon-download">
                        导出数据
                    </el-button>
                </div>
            </div>
        </div>
        <el-collapse-transition>
            <div v-show="showAdvanceSearchVisible" style="border: 1px solid lightblue; border-radius: 5px; box-sizing: border-box;padding: 5px;margin: 10px 0;">
                <el-row>
                    <el-col :span="5">
                        <label style="width: 90px;">政治面貌：</label>
                        <el-select style="width: 150px;" size="mini" v-model="queryParams.politicId" placeholder="请选择政治面貌" clearable>
                            <el-option
                                v-for="item in politicsStatus"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="5">
                        <label style="width: 100px;">民族：</label>
                        <el-select style="width: 150px;" size="mini" v-model="queryParams.nationId" placeholder="请选择民族" clearable>
                            <el-option
                                v-for="item in nations"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="5">
                        <label style="width: 100px;">职位：</label>
                        <el-select style="width: 150px;" size="mini" v-model="queryParams.posId" placeholder="请选择职位" clearable>
                            <el-option
                                v-for="item in positions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="5">
                        <label style="width: 100px;">职称：</label>
                        <el-select style="width: 150px;" size="mini" v-model="queryParams.jobLevelId" placeholder="请选择职称" clearable>
                            <el-option
                                v-for="item in jobLevels"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <label style="width: 100px;">聘用形式：</label>
                        <el-radio-group size="mini" v-model="queryParams.engageForm">
                            <el-radio label="劳动合同">劳动合同</el-radio>
                            <el-radio label="劳务合同">劳务合同</el-radio>
                        </el-radio-group>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 10px;">
                    <el-col :span="8">
                        <label style="width: 100px;">入职日期：</label>
                        <el-date-picker size="small"
                                        v-model="queryParams.beginDateScope"
                                        value-format="yyyy-MM-dd"
                                        type="daterange"
                                        unlink-panels
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期" clearable>
                        </el-date-picker>
                    </el-col>
                    <el-col :span="8" style="display: flex;justify-content: space-between;">
                        <label style="width: 100px;">所属部门：</label>
                        <treeselect style="width: calc(100%);"
                                    v-model="queryParams.departmentId"
                                    :options="deptSelectTree"
                                    :normalizer="normalizer"
                                    @input="departmentIdChange"
                                    placeholder="请选择所属部门" />
                    </el-col>
                    <el-col :span="4" :offset="4">
                        <el-button size="mini" type="primary" icon="el-icon-search" @click="initEmpData">搜索</el-button>
                        <el-button size="mini" @click="showAdvanceSearchVisible = false">取消</el-button>
                    </el-col>
                </el-row>
            </div>
        </el-collapse-transition>
        <div style="margin-top: 10px;">
            <el-table :data="empData" border style="width: 100%"
                      v-loading="loading"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-table-column type="selection" align="center" width="40"></el-table-column>
                <el-table-column fixed label="序号" align="center" width="50">
                    <template slot-scope="scope">
                        {{ (scope.$index+1 + page.pageSize*(page.currentPage-1)) }}
                    </template>
                </el-table-column>
                <el-table-column fixed prop="name" label="姓名" align="center" width="80"></el-table-column>
                <el-table-column prop="workID" label="工号" align="center" width="100"></el-table-column>
                <el-table-column prop="gender" label="性别" align="center" width="50"></el-table-column>
                <el-table-column prop="birthday" label="出生日期" align="center" width="100"></el-table-column>
                <el-table-column prop="idCard" label="身份证号" align="center" width="180"></el-table-column>
                <el-table-column prop="wedlock" label="婚姻状况" align="center" width="100"></el-table-column>
                <el-table-column prop="nation.name" label="民族" align="center" width="50"></el-table-column>
                <el-table-column prop="nativePlace" label="籍贯" align="center" width="100"></el-table-column>
                <el-table-column prop="politicsStatus.name" label="政治面貌" align="center" width="120"></el-table-column>
                <el-table-column prop="email" label="电子邮件" align="center" width="200"></el-table-column>
                <el-table-column prop="phone" label="电话号码" align="center" width="120"></el-table-column>
                <el-table-column prop="address" label="联系地址" align="left" width="250"></el-table-column>
                <el-table-column prop="department.name" label="所属部门" align="left" width="150"></el-table-column>
                <el-table-column prop="position.name" label="职位" align="center" width="150"></el-table-column>
                <el-table-column prop="joblevel.name" label="职级" align="center" width="150"></el-table-column>
                <el-table-column prop="engageForm" label="聘用形式" align="center" width="100"></el-table-column>
                <el-table-column prop="school" label="毕业院校" align="center" width="150"></el-table-column>
                <el-table-column prop="tiptopDegree" label="最高学历" align="center" width="100"></el-table-column>
                <el-table-column prop="specialty" label="专业" align="center" width="150"></el-table-column>
                <el-table-column prop="workState" label="在职状态" align="center" width="100"></el-table-column>
                <el-table-column prop="beginDate" label="入职日期" align="center" width="120"></el-table-column>
                <el-table-column prop="conversionTime" label="转正日期" align="center" width="120"></el-table-column>
                <el-table-column prop="beginContract" label="合同起始日期" align="center" width="120"></el-table-column>
                <el-table-column prop="endContract" label="合同终止日期" align="center" width="120"></el-table-column>
                <el-table-column label="合同期限" align="center" width="100">
                    <template slot-scope="scope">
                        <el-tag>{{scope.row.contractTerm}}年</el-tag>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" width="280">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="openEditDialog(scope.row)">编辑</el-button>
                        <el-button type="primary" size="mini">查看高级资料</el-button>
                        <el-button type="danger" size="mini" @click="deleteEmp(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="display: flex;justify-content: flex-end;">
                <el-pagination
                    background
                    @current-change="currentPageChange"
                    @size-change="sizeChange"
                    layout="prev, pager, next, sizes, jumper, ->, total"
                    :total="page.total"
                    :current-page="page.currentPage"
                    :page-size="page.pageSize">
                </el-pagination>
            </div>
        </div>
        <!--添加员工 弹框关闭前事件:before-close="beforeCloseDialog"-->
        <el-dialog :title="title"
                   :visible.sync="dialogFormVisible"
                   :close-on-click-modal="false"
                   width="70%">
            <el-form :model="employee" :rules="rules" ref="employeeForm" label-width="125px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="姓名：" prop="name">
                            <el-input style="width: 180px;" size="mini" type="text" v-model="employee.name" autocomplete="false" placeholder="请输入员工姓名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="性别：" prop="gender">
                            <el-radio-group class="radioLocation" size="mini" v-model="employee.gender">
                                <el-radio label="男">男</el-radio>
                                <el-radio label="女">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="出生日期：" prop="birthday">
                            <el-date-picker style="width: 180px;" size="mini" v-model="employee.birthday" type="date" value-format="yyyy-MM-dd" placeholder="请选择出生日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="政治面貌：" prop="politicId">
                            <el-select style="width: 180px;" size="mini" v-model="employee.politicId" placeholder="请选择政治面貌">
                                <el-option
                                    v-for="item in politicsStatus"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="民族：" prop="nationId">
                            <el-select style="width: 180px;" size="mini" v-model="employee.nationId" placeholder="请选择民族">
                                <el-option
                                    v-for="item in nations"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="籍贯：" prop="nativePlace">
                            <el-input style="width: 180px;" size="mini" type="text" v-model="employee.nativePlace" placeholder="请输入籍贯"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="电子邮箱：" prop="email">
                            <el-input style="width: 180px;" size="mini" type="text" v-model="employee.email" placeholder="请输入电子邮箱"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="联系地址：" prop="address">
                            <el-input style="width: 180px;" size="mini" type="text" v-model="employee.address" placeholder="请输入联系地址"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="职位：" prop="posId">
                            <el-select style="width: 180px;" size="mini" v-model="employee.posId" placeholder="请选择职位">
                                <el-option
                                    v-for="item in positions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="职称：" prop="jobLevelId">
                            <el-select style="width: 180px;" size="mini" v-model="employee.jobLevelId" placeholder="请选择职称">
                                <el-option
                                    v-for="item in jobLevels"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属部门：" prop="departmentId">
                            <treeselect style="width: calc(100% - 22px);"
                                        v-model="employee.departmentId"
                                        :options="deptSelectTree"
                                        :normalizer="normalizer"
                                        @input="departmentIdChange"
                                        placeholder="请选择所属部门" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="工号：" prop="workID">
                            <el-input style="width: 180px;" size="mini" type="text" v-model="employee.workID" placeholder="请输入工号" readonly></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="学历：" prop="tiptopDegree">
                            <el-select style="width: 180px;" size="mini" v-model="employee.tiptopDegree" placeholder="请选择学历">
                                <el-option
                                    v-for="item in degrees"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="毕业院校：" prop="school">
                            <el-input style="width: 180px;" size="mini" type="text" v-model="employee.school" placeholder="请输入毕业院校"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="专业名称：" prop="specialty">
                            <el-input style="width: 180px;" size="mini" type="text" v-model="employee.specialty" placeholder="请输入专业名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="入职日期：" prop="beginDate">
                            <el-date-picker style="width: 180px;" size="mini" v-model="employee.beginDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择入职日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="转正日期：" prop="conversionTime">
                            <el-date-picker style="width: 180px;" size="mini" v-model="employee.conversionTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择转正日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="合同起始日期：" prop="beginContract">
                            <el-date-picker style="width: 180px;" size="mini" v-model="employee.beginContract" type="date" value-format="yyyy-MM-dd" placeholder="请选择合同起始日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="合同终止日期：" prop="endContract">
                            <el-date-picker style="width: 180px;" size="mini" v-model="employee.endContract" type="date" value-format="yyyy-MM-dd" placeholder="请选择合同终止日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="身份证号码：" prop="idCard">
                            <el-input style="width: 180px;" size="mini" type="text" v-model="employee.idCard" placeholder="请输入身份证号码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="电话号码：" prop="phone">
                            <el-input style="width: 180px;" size="mini" type="text" v-model="employee.phone" placeholder="请输入电话号码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="婚姻状况：" prop="wedlock">
                            <el-radio-group class="radioLocation" size="mini" v-model="employee.wedlock">
                                <el-radio label="未婚">未婚</el-radio>
                                <el-radio label="已婚">已婚</el-radio>
                                <el-radio label="离异">离异</el-radio>
                                <el-radio label="其他">其他</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="聘用形式：" prop="engageForm">
                            <el-radio-group class="radioLocation" size="mini" v-model="employee.engageForm">
                                <el-radio label="劳动合同">劳动合同</el-radio>
                                <el-radio label="劳务合同">劳务合同</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="text-align: right;">
                    <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="saveEmp">确 定</el-button>
                </el-row>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import {deleteRequest, getRequest, postRequest, putRequest} from "@/utils/api";
import Treeselect from "@riophae/vue-treeselect";
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {Message, MessageBox} from "element-ui";
import {downloadRequest} from "@/utils/download";

export default {
    name: "EmpBasic",
    components:{ Treeselect },
    data(){
        return{
            page:{
                total: 0,
                currentPage: 1,
                pageSize: 10,
            },
            queryParams:{
                politicId: null,
                nationId: null,
                posId: null,
                jobLevelId: null,
                engageForm: null,
                departmentId: null,
                beginDateScope: []
            },
            headers: {
                Authorization: window.sessionStorage.getItem("tokenStr")
            },
            showAdvanceSearchVisible: false,
            importDataBtnText: '导入数据',
            importDataBtnIcon: 'el-icon-upload2',
            importDataBtnDisabled: false,
            empData: [],
            loading: false,
            title: '',
            name: '',
            dialogFormVisible: false,
            employee:{
                id: null,
                name: '',
                gender: '',
                birthday: '',
                idCard: '',
                wedlock: '',
                nationId: null,
                nativePlace: '',
                politicId: null,
                email: '',
                phone: '',
                address: '',
                departmentId: null,
                jobLevelId: null,
                posId: null,
                engageForm: '',
                tiptopDegree: '',
                specialty: '',
                school: '',
                beginDate: null,
                workState: '',
                workID: '',
                contractTerm: '',
                conversionTime: null,
                notWorkDate: null,
                beginContract: null,
                endContract: null,
                workAge: null,
                salaryId: null,
            },
            //政治面貌
            politicsStatus:[],
            //民族
            nations:[],
            //职位
            positions:[],
            //职称
            jobLevels:[],
            //部门
            deptSelectTree:[],
            //学历
            degrees:['博士','硕士','本科','大专','高中','初中','小学','其他'],
            normalizer(node) {
                return {
                    id: node.value,
                    label: node.label,
                    children: node.children && node.children.length > 0 ? node.children : 0,
                }
            },
            //表单校验规则
            rules: {
                name: [{required: true, message: '请输入员工姓名', trigger: 'blur'}],
                gender: [{required: true, message: '请选择性别', trigger: 'change'}],
                birthday: [{required: true, message: '请选择出生日期', trigger: 'blur'}],
                idCard: [
                    {required: true, message: '请输入身份证号', trigger: 'blur'},
                    {pattern: /^(([1-9][0-9]{5}(19|20)[0-9]{2}((0[1-9])|(1[0-2]))([0-2][1-9]|10|20|30|31)[0-9]{3}([0-9]|X|x))|([1-9][0-9]{5}[0-9]{2}((0[1-9])|(1[0-2]))([0-2][1-9]|10|20|30|31)[0-9]{3}))$/, message: '身份证号格式错误', trigger: 'blur'},
                ],
                wedlock: [{required: true, message: '请选择婚姻状况', trigger: 'change'}],
                nationId: [{required: true, message: '请选择民族', trigger: 'change'}],
                nativePlace: [{required: true, message: '请输入籍贯', trigger: 'blur'}],
                politicId: [{required: true, message: '请选择政治面貌', trigger: 'change'}],
                email: [
                    {required: true, message: '请输入电子邮箱', trigger: 'blur'},
                    {type: 'email', message: '电子邮箱格式错误', trigger: 'blur'},
                ],
                phone: [{required: true, message: '请输入电话号码', trigger: 'blur'}],
                address: [{required: true, message: '请输入联系地址', trigger: 'blur'}],
                departmentId: [{required: true, message: '请选择所属部门', trigger: 'change'}],
                jobLevelId: [{required: true, message: '请选择职称', trigger: 'change'}],
                posId: [{required: true, message: '请选择职位', trigger: 'change'}],
                engageForm: [{required: true, message: '请选择聘用形式', trigger: 'change'}],
                tiptopDegree: [{required: true, message: '请选择学历', trigger: 'change'}],
                specialty: [{required: true, message: '请输入专业', trigger: 'blur'}],
                school: [{required: true, message: '请输入毕业院校', trigger: 'blur'}],
                beginDate: [{required: true, message: '请选择入职日期', trigger: 'blur'}],
                workState: [{required: true, message: '请选择工作状态', trigger: 'blur'}],
                conversionTime: [{required: true, message: '请选择转正日期', trigger: 'blur'}],
                notWorkDate: [{required: true, message: '请选择离职日期', trigger: 'blur'}],
                beginContract: [{required: true, message: '请选择合同起始日期', trigger: 'blur'}],
                endContract: [{required: true, message: '请选择合同终止日期', trigger: 'blur'}],
            },
        }
    },
    methods:{
        //文件上传前事件
        beforeUpload(){
            this.importDataBtnIcon = 'el-icon-loading';
            this.importDataBtnText = '正在导入...'
            this.importDataBtnDisabled = true
        },
        //文件上传成功事件
        onSuccess(){
            this.importDataBtnIcon = 'el-icon-upload2';
            this.importDataBtnText = '导入数据';
            this.importDataBtnDisabled = false;
            this.initEmpData();
        },
        //文件上传失败事件
        onError(){
            this.importDataBtnIcon = 'el-icon-upload2';
            this.importDataBtnText = '导入数据';
            this.importDataBtnDisabled = false;
        },
        //初始化员工数据
        initEmpData(){
            this.loading = true;
            let url = "/employee/basic/?currentPage="+this.page.currentPage+"&pageSize="+this.page.pageSize;
            if(this.showAdvanceSearchVisible){//高级搜索
                if(this.queryParams.politicId){
                    url += '&politicId='+this.queryParams.politicId;
                }
                if(this.queryParams.nationId){
                    url += '&nationId='+this.queryParams.nationId;
                }
                if(this.queryParams.posId){
                    url += '&posId='+this.queryParams.posId;
                }
                if(this.queryParams.jobLevelId){
                    url += '&jobLevelId='+this.queryParams.jobLevelId;
                }
                if(this.queryParams.engageForm){
                    url += '&engageForm='+this.queryParams.engageForm;
                }
                if(this.queryParams.departmentId){
                    url += '&departmentId='+this.queryParams.departmentId;
                }
                if(this.queryParams.beginDateScope){
                    url += '&beginDateScope='+this.queryParams.beginDateScope;
                }
            }else {
                url += "&name="+this.name;
            }
            getRequest(url).then(resp=>{
                if(resp){
                    this.empData = resp.data;
                    this.page.total = resp.total;
                }
                this.loading = false;
            })
        },
        //currentPage改变时触发
        currentPageChange(currentPage){
            this.page.currentPage = currentPage;
            this.initEmpData();
        },
        //每页条数发生改变时触发
        sizeChange(pageSize){
            this.page.pageSize = pageSize;
            this.initEmpData();
        },
        //打开添加员工页面
        openAddEmpDialog(){
            this.title = '添加员工';
            this.dialogFormVisible = true;
            this.employee = {
                id: null,
                name: '',
                gender: '',
                birthday: '',
                idCard: '',
                wedlock: '',
                nationId: null,
                nativePlace: '',
                politicId: null,
                email: '',
                phone: '',
                address: '',
                departmentId: null,
                jobLevelId: null,
                posId: null,
                engageForm: '',
                tiptopDegree: '',
                specialty: '',
                school: '',
                beginDate: null,
                workState: '',
                workID: '',
                contractTerm: '',
                conversionTime: null,
                notWorkDate: null,
                beginContract: null,
                endContract: null,
                workAge: null,
                salaryId: null,
            }
        },
        //所属部门改变触发事件
        departmentIdChange(){
            this.$nextTick(() => {
                this.$refs.employeeForm.validateField('departmentId');
            })
        },
        //保存员工
        saveEmp(){
            this.$refs.employeeForm.validate(valid=>{
                if(valid){
                    if(this.employee.id == null){
                        postRequest("/employee/basic/", this.employee).then(resp=>{
                            if(resp){
                                this.initEmpData();
                                this.dialogFormVisible = false;
                            }
                        })
                    }else {
                        putRequest("/employee/basic/", this.employee).then(resp=>{
                            if(resp){
                                this.initEmpData();
                                this.dialogFormVisible = false;
                            }
                        })
                    }
                    // this.$refs.employeeForm.resetFields();
                }
            })
        },
        //打开员工编辑页面
        openEditDialog(data){
            this.title = '编辑员工'
            this.dialogFormVisible = true;
            // this.initSelectData();//初始化民族和政治面貌
            // this.initPositions();//初始化职位
            // this.initJobLevels();//初始化职称
            // this.initDepartments();//初始化部门下拉树
            this.employee = data;
        },
        //删除员工
        deleteEmp(data){
            MessageBox.confirm('此操作将永久删除【'+data.name+'】员工，是否继续？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                deleteRequest("/employee/basic/"+data.id).then(resp=>{
                    if(resp){
                        this.initEmpData();
                    }
                })
            }).catch(() => {
                Message.info({type: 'info', message: '已取消删除'})
            });
        },
        //自动生成工号
        generateWorkID(){
            getRequest("/employee/basic/generateWorkId").then(resp=>{
                this.employee.workID = resp.data;
            })
        },
        //初始化部门下拉树
        initDepartments(){
            getRequest("/system/basic/department/selectTree").then(resp=>{
                this.deptSelectTree = resp;
            })
        },
        //初始化职位
        initPositions() {
            getRequest("/employee/basic/positions").then(resp=>{
                if (resp){
                    this.positions = resp;
                }
            })
        },
        //初始化职称
        initJobLevels(){
            getRequest("/employee/basic/joblevels").then(resp=>{
                if(resp){
                    this.jobLevels = resp;
                }
            })
        },
        //初始化一些不易变动的下拉选数据(民族和政治面貌)
        initSelectData(){
            if(!window.sessionStorage.getItem("nations")){
                //查询民族
                getRequest("/employee/basic/nations").then(resp=>{
                    if(resp){
                        this.nations = resp;
                        window.sessionStorage.setItem("nations", JSON.stringify(resp));
                    }
                })
            }else {
                this.nations = JSON.parse(window.sessionStorage.getItem("nations"));
            }
            if(!window.sessionStorage.getItem("politicsStatus")){
                //查询政治面貌
                getRequest("/employee/basic/politicsStatus").then(resp=>{
                    if(resp){
                        this.politicsStatus = resp;
                        window.sessionStorage.setItem("politicsStatus", JSON.stringify(resp));
                    }
                })
            }else {
                this.politicsStatus = JSON.parse(window.sessionStorage.getItem("politicsStatus"));
            }
        },
        beforeCloseDialog(){
            // alert("关闭前事件！")
            return true;
        },
        //导出员工数据
        exportData(){
            MessageBox.confirm('此操作将导出所有员工数据，是否继续？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'info',
            }).then(() => {
                downloadRequest("/employee/basic/export");
            }).catch(() => {
                Message.info({type: 'info', message: '已取消操作'})
            });
        }
    },
    mounted() {
        this.initEmpData();
        this.initSelectData();//初始化民族和政治面貌
        this.initPositions();//初始化职位
        this.initJobLevels();//初始化职称
        this.initDepartments();//初始化部门下拉树
    }
}
</script>

<style scoped>
.radioLocation{
    padding-top: 13px;
}
</style>