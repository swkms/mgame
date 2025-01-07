<template>
    <div class="admin">
        <div class="menu">
            <div class="title">
                {{ title }}
            </div>
            <div style="height: 100%;display: flex;flex:1;justify-content: center;align-items: end;">
                <el-menu mode="horizontal" :ellipsis="false" router :default-active="$route.path">
                    <el-menu-item index="/admin/home">游戏管理</el-menu-item>
                    <el-menu-item index="/admin/users">用户管理</el-menu-item>
                </el-menu>
            </div>
        </div>
        <div style="flex:1;overflow: hidden;padding: 20px;box-sizing: border-box;">
            <RouterView></RouterView>
        </div>
    </div>
</template>

<script setup lang="ts">
import { title } from "@/src/models/config"
</script>

<style lang="scss">
.admin {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    
    .menu {
        display: flex;
        align-items: center;
        background-color: var(--mm-color-body-secondary);
        padding: 0px 10px;
        height: 60px;

        .el-menu{
            height: 50px !important;
        }

        >.title {
            font-size: 16px;
            font-weight: bold;
            color: white;
            margin-right: 30px;
        }
    }
}
</style>