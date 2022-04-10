<template>
    <div>
        <h2>这里临时引入百度富文本编辑器样例</h2>
        <u-editor editor-id="demo" ref="ue"></u-editor>
    </div>
</template>

<script>
import UEditor from "@/components/ueditor/UEditor";

export default {
    name: "EmpAdv",
    components:{UEditor},
    data(){
        return{

        }
    },
    methods: {
        getUEContent() {
            let content = this.$refs.ue.getUEContent();
            this.$notify({
                title: '获取成功，可在控制台查看！',
                message: content,
                type: 'success'
            });
            console.log(content)
        },
    }
}
</script>

<style scoped>

</style>