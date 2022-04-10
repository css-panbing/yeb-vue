<template>
    <div class="body">
        <div class="sidebar">
            <card></card>
            <list></list>
        </div>
        <div class="main">
            <message></message>
            <usertext></usertext>
        </div>
    </div>
</template>

<script>

import card from "@/components/chat/card";
import list from "@/components/chat/list";
import message from "@/components/chat/message";
import usertext from "@/components/chat/usertext";

export default {
    name: 'OnlineChat',
    data() {
        return {}
    },
    mounted: function () {
        //初始化聊天对象列表
        this.$store.dispatch('initAdmins');
    },
    components: {
        card,
        list,
        message,
        usertext
    }
}
</script>

<style scoped>
.body{
    margin: 20px auto;
    width: 800px;
    height: 600px;
    overflow: hidden;
    border-radius: 10px;
    border: 1px solid lightgray;
}
.sidebar{
    height: 100%;
    float: left;
    color: #f4f4f4;
    background-color: #2e3238;
    width: 200px;
}
.main{
    height: 100%;
    position: relative;
    overflow: hidden;
    background-color: #eee;
}
</style>
