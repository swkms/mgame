<template>
    <div class="login">
        <div class="form">
            <div class="title">
                {{ title }}
            </div>
            <el-form :model="user">
                <el-form-item>
                    <el-input :prefix-icon="UserIcon" v-model="user.LoginName" placeholder="登录用户" />
                </el-form-item>
                <el-form-item>
                    <el-input :prefix-icon="Lock" v-model="user.LoginPwd" placeholder="登录密码" />
                </el-form-item>
                <el-form-item>
                    <div style="display: flex;flex-direction: column;width: 100%;">
                        <div>
                            <el-button type="primary" @click="login" style="width: 100%;" :disabled="isLoading">
                                登录
                            </el-button>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<style lang="scss">
.login {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    >.form {
        justify-content: center;
        align-items: center;
        display: flex;
        flex-direction: column;
        flex: 1;

        .title {
            font-size: 40px;
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
        }

        >.el-form {
            width: 320px;
            flex: 1;
        }
    }
}
</style>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { ElMessage } from "element-plus"
import { Lock, User as UserIcon } from '@element-plus/icons-vue'
import { title } from "@/src/models/config"
import { User } from "@/src/models/user"
import userService from "@/src/services/userservice"
import { useRouter } from 'vue-router'

const isLoading = ref(false)
const user = ref(new User())
const router = useRouter()

async function login() {
    isLoading.value = true
    const result = await userService.login(user.value.LoginName, user.value.LoginPwd)
    if (result.isSuccess) {
        localStorage.setItem("TOKEN", result.content.Token)
        router.push('/admin').then(() => {
            location.reload()
        });
    } else {
        ElMessage.error("登录系统失败:" + result.error)
    }
    isLoading.value = false
}


</script>