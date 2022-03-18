<template>
    <div>
        <template>
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="部门管理" name="DepManage">
                    <dep-manage></dep-manage>
                </el-tab-pane>
                <el-tab-pane label="职位管理" name="PosManage">
                    <pos-manage></pos-manage>
                </el-tab-pane>
                <el-tab-pane label="职称管理" name="JoblevelManage">
                    <joblevel-manage></joblevel-manage>
                </el-tab-pane>
                <el-tab-pane label="奖惩规则" name="EcManage">
                    <ec-manage></ec-manage>
                </el-tab-pane>
                <el-tab-pane label="权限管理" name="PermissionManage">
                    <permission-manage></permission-manage>
                </el-tab-pane>
            </el-tabs>
        </template>
    </div>
</template>

<script>
import DepManage from "@/components/sys/basic/DepManage";
import EcManage from "@/components/sys/basic/EcManage";
import JoblevelManage from "@/components/sys/basic/JoblevelManage";
import PermissionManage from "@/components/sys/basic/PermissionManage";
import PosManage from "@/components/sys/basic/PosManage";
export default {
    name: "SysBasic",
    data(){
        return{
            activeName:'PermissionManage'
        }
    },
    components: {
        DepManage, EcManage, JoblevelManage, PermissionManage, PosManage
    }
}
</script>

<style scoped>

</style>