<!-- 后端动态获取路由 -->
<template>
    <div>
        <el-container>
            <el-header class="homeHeader">
                <div class="title">云E办</div>
                <el-dropdown class="userInfo" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ userInfo.name }}<i><img :src="userInfo.userFace"></i>
            <el-icon class="el-icon--right">
              <arrow-down/>
            </el-icon>
          </span>
                    <el-dropdown-menu>
                        <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
                        <el-dropdown-item command="setting">设置</el-dropdown-item>
                        <el-dropdown-item command="logout">注销</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>

            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu router unique-opened>
                        <el-submenu :index="index+''"
                                    v-for="(item, index) in routes" :key="index">
                            <template #title>
                                <li :class="item.iconCls" style="color: #2fc0ee;margin-right: 5px;"></li>
                                <span>{{ item.name }}</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item :index="children.path" v-for="(children, i) in item.children" :key="i">
                                    <span>{{ children.name }}</span>
                                </el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <el-breadcrumb separator-class="el-icon-arrow-right"
                                   v-if="this.$router.currentRoute.path != '/home'">
                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <div class="homeWelcome" v-if="this.$router.currentRoute.path == '/home'">
                        欢迎来到云E办系统
                    </div>
                    <router-view class="homeRouterView"/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import {Message, MessageBox} from "element-ui";
import {postRequest} from "@/utils/api";

export default {
    name: "Home",
    data() {
        return {
            userInfo: JSON.parse(window.sessionStorage.getItem("userInfo")),
        }
    },
    computed: {
        routes() {
            //console.log("路由："+JSON.stringify(this.$store.state.routes))
            return this.$store.state.routes;
        },
    },
    methods: {
        handleCommand(command) {
            if (command == 'userInfo') {
                Message.info("用户中心")
            } else if (command == 'setting') {
                Message.info("设置")
            } else if (command == "logout") {
                MessageBox.confirm('确认要注销用户吗？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    postRequest("/logout");
                    //清空session信息
                    window.sessionStorage.removeItem("userInfo");
                    window.sessionStorage.removeItem("tokenStr");
                    //清空菜单信息
                    this.$store.commit('initRoutes', []);
                    //跳转到登录
                    this.$router.replace('/');
                }).catch(() => {
                    Message.info({type: 'info', message: '已取消操作'})
                })

            }
        }
    }
}
</script>

<style scoped>
.homeHeader {
    background-color: lightblue;
    align-items: center;
    display: flex;
    /* 分配弹性元素方式 */
    justify-content: space-between; /* 均匀排列每个元素，首个元素放置于起点，末尾元素放置于终点 */
    padding: 0 15px;
    box-sizing: border-box;
}

.homeHeader .title {
    font-size: 36px;
    font-family: 楷体;
    color: white;
}

.homeHeader .userInfo {
    float: right;
    cursor: pointer;
}

.el-dropdown-link img {
    border-radius: 25px;
    width: 50px;
    height: 50px;
    margin-left: 5px;
}

.homeWelcome {
    text-align: center;
    font-size: 40px;
    font-family: 楷体;
    color: red;
}

.homeRouterView{
    margin-top: 15px;
}
</style>

<!-- 前端静态配置路由 -->
<!--
<template>
  <div>
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">
          &lt;!&ndash;router：启动vue的router模式&ndash;&gt;
          <el-menu router unique-opened>
            <el-submenu v-for="(item, index) in this.$router.options.routes"
                        :index="index+''" :key="item.path" v-show="!item.hidden">
              <template #title>
                <li class="el-icon-location"></li><span>{{item.name}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item :index="children.path" v-for="(children) in item.children"
                              :key="children.path"><span>{{children.name}}</span></el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home"
}
</script>-->
