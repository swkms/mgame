<template>
    <div class="content">
        <WindowBarComponent :title="title" :show-icon="true" :show-max="false"
            style="background-color: var(--mm-color-body-secondary);">
            <template v-slot:option>
                <!--
            <div style="display: flex;justify-content: center;align-items: center;height: 100%;">
                <el-menu mode="horizontal" :ellipsis="false" router :default-active="$route.path">
                    <el-menu-item index="/games">游戏库 (Y)</el-menu-item>
                    <el-menu-item index="/mygame">我的游戏 (B)</el-menu-item>
                </el-menu>
            </div>
            -->
            </template>
        </WindowBarComponent>
        <div class="router">
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
.content {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    .router {
        flex: 1;
        overflow: hidden;
        padding: 20px;
        box-sizing: border-box;
    }
}

.module {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: radial-gradient(var(--mm-color-primary-10), rgba(0, 0, 0, 0.8));

    >.container {
        flex: 1;
        overflow: auto;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        align-content: baseline;

        >.game_item {
            flex: 0 0 20%;
            overflow: hidden;
            padding: 10px;
            box-sizing: border-box;
            position: relative;

            >.content {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background-color: var(--mm-color-body-secondary);
                border: 1px solid var(--mm-color-primary-20);
                border-radius: 7px;
                overflow: hidden;
                position: relative;

                >.cover {
                    overflow: hidden;
                    width: 100%;
                    border-bottom: 1px solid var(--mm-color-border-primary);
                    cursor: pointer;

                    .el-image {
                        width: 100%;
                        height: 100%;
                    }
                }

                >.title {
                    padding: 5px;
                    overflow: hidden;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                }


                >.detail {
                    background-color: rgba(0, 0, 0, 0.8);
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    visibility: hidden;

                    .detail_opt {
                        position: absolute;
                        right: 10px;
                        bottom: 10px;
                    }
                }

                >.detail_gamepad {
                    background-color: rgba(0, 0, 0, 0.8);
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

            }


        }

        >.game_item:hover .detail {
            visibility: visible;
        }


    }
}
</style>