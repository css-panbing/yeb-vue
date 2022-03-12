<template>
    <div>
        <template>
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="部门管理" name="DepManage">部门管理</el-tab-pane>
                <el-tab-pane label="职位管理" name="PosManage">职位管理</el-tab-pane>
                <el-tab-pane label="职称管理" name="JoblevelManage">职称管理</el-tab-pane>
                <el-tab-pane label="奖惩规则" name="EcManage">奖惩规则</el-tab-pane>
                <el-tab-pane label="权限组" name="AuthManage">权限组</el-tab-pane>
            </el-tabs>
        </template>
    </div>
</template>

<script>
import DepManage from "@/components/sys/basic/DepManage";
import EcManage from "@/components/sys/basic/EcManage";
import JoblevelManage from "@/components/sys/basic/JoblevelManage";
import AuthManage from "@/components/sys/basic/AuthManage";
import PosManage from "@/components/sys/basic/PosManage";
export default {
    name: "SysBasic",
    data(){
        return{
            activeName:'DepManage'
        }
    },
    components: {
        DepManage, EcManage, JoblevelManage, AuthManage, PosManage
    }
}
</script>

<style scoped>

</style>