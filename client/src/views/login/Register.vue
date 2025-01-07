<template>
    <div class="register">
        <div class="form">
            <el-form :model="user">
                <el-form-item>
                    <el-input :prefix-icon="UserIcon" v-model="user.LoginName" placeholder="登录用户" />
                </el-form-item>
                <el-form-item>
                    <el-input :prefix-icon="Lock" v-model="user.LoginPwd" placeholder="登录密码" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="register" style="width: 100%;" :disabled="isLoading">
                        注册
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<style lang="scss">
.register {
    height: 100%;
    display: flex;
    flex-direction: column;

    >.form {
        justify-content: center;
        align-items: center;
        display: flex;
        flex: 1;

        >.el-form {
            width: 320px;
        }
    }
}
</style>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { Lock, User as UserIcon } from '@element-plus/icons-vue'
import { User } from "@/src/models/user"
const remote = require('@electron/remote')

const user = ref<User>(new User())
const isLoading = ref(false)

function register() {
    isLoading.value = true
    remote.getCurrentWindow().close()
    isLoading.value = false
}

onMounted(() => {


})
</script>