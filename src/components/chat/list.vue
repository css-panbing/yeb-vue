<template>
    <div class="list">
        <ul style="padding-left: 0px;">
            <li v-for="item in admins" :key="item.id" :class="{ active: item.id === currentSessionId }"
                v-on:click="changeCurrentSessionId(item.id)">
                <img class="avatar" :src="item.userFace" :alt="item.name">
                <p class="name">{{ item.name }}</p>
            </li>
        </ul>
    </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
    name: 'list',
    data() {
        return {}
    },
    computed: mapState([
        'admins',
        'currentSessionId'
    ]),
    methods: {
        changeCurrentSessionId: function (id) {
            this.$store.commit('changeCurrentSessionId', id)
        }
    }
}
</script>

<style scoped>
li {
    padding: 0px 15px;
    border-bottom: 1px solid #292C33;
    cursor: pointer;
}

hover {
    background-color: rgba(255, 255, 255, 0.03);
}

.active {
    background-color: rgba(255, 255, 255, 0.1);
}

.avatar {
    border-radius: 2px;
    width: 30px;
    height: 30px;
    vertical-align: middle;
}

.name {
    display: inline-block;
    margin-left: 15px;
}
</style>
