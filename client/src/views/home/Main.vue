<template>
    <div class="game">
        <div class="menu">
            <WindowBarComponent :title="title" :show-icon="true" :show-max="false">
                <template v-slot:option>
                    <div style="display: flex;justify-content: center;align-items: center;height: 100%;">
                        <el-menu mode="horizontal" :ellipsis="false" router :default-active="$route.path">
                            <el-menu-item index="/games">游戏库 (Y)</el-menu-item>
                            <el-menu-item index="/mygame">我的游戏 (B)</el-menu-item>
                        </el-menu>
                    </div>
                </template>
            </WindowBarComponent>
        </div>
        <div style="flex:1;overflow: hidden;">
            <RouterView></RouterView>
        </div>
    </div>
</template>

<script setup lang="ts">
import WindowBarComponent from "@/src/components/WindowBar.vue"
import { title } from "@/src/models/config"
import { onMounted, onUnmounted } from "vue";
</script>

<style lang="scss">
.game {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: radial-gradient(var(--mm-color-primary-10), rgba(0, 0, 0, 0.8));

    .menu {
        background-color: var(--mm-color-body-secondary);
    }

    .container {
        flex: 1;
        overflow: auto;
        padding: 20px 20px 20px 20px;
        box-sizing: border-box;

        .item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: rgba(0, 0, 0, 0.3);
            box-shadow: 0px 0px 1px rgba(255, 255, 255, 0.3);
            border-radius: 7px;
            overflow: hidden;
            position: relative;

            .cover {
                overflow: hidden;
                flex: 1;

                .el-image {
                    width: 100%;
                    //height: 100%;
                }
            }

            .title {
                height: 40px;
                display: flex;
                justify-content: center;
                align-items: center;
                -webkit-app-region: drag;
            }
        }

        .item:hover {
            box-shadow: 0px 0px 5px rgba(255, 255, 255, 0.5);
        }

        .item.active {
            box-shadow: 0px 0px 5px rgba(255, 255, 255, 0.9);
        }
    }
}
</style>