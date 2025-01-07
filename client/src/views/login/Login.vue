<template>
    <div class="login">
        <div class="form">
            <div class="title">
                {{ title }}
            </div>
            <el-form :model="config">
                <el-form-item>
                    <el-input :prefix-icon="UserIcon" v-model="config.LoginName" placeholder="登录用户" />
                </el-form-item>
                <el-form-item>
                    <el-input :prefix-icon="Lock" v-model="config.LoginPwd" placeholder="登录密码" />
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="isRemember">记住密码</el-checkbox>
                </el-form-item>
                <el-form-item>
                    <div style="display: flex;flex-direction: column;width: 100%;">
                        <div>
                            <el-button type="primary" @click="login" style="width: 100%;" :disabled="isLoading">
                                登录
                            </el-button>
                        </div>
                        <div style="text-align: right;">
                            <el-link @click="register">立即注册</el-link>
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
    flex-direction: column;

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
import { Config } from "@/src/models/config"
import { ElMessage } from "element-plus"
import { Lock, User as UserIcon } from '@element-plus/icons-vue'
import { title } from "@/src/models/config"

const fs = require("fs")
const path = require("path")
const remote = require('@electron/remote')
const window = require('@electron/remote').require('./window.js')

const isRemember = ref(false)
const config = ref(new Config())
const isLoading = ref(false)

//保存配置
function setConfig() {
    const rootPath = remote.app.getPath("userData")
    const fileName = path.join(rootPath, "config.data")
    fs.writeFile(fileName, JSON.stringify(config.value), { flag: 'w', encoding: 'utf-8' }, (err, data) => {
        if (err) {
            ElMessage.error(err)
        } else {

        }
    });
}

//获取配置
function getConfig() {
    try {
        const rootPath = remote.app.getPath("userData")
        const fileName = path.join(rootPath, "config.data")
        const exist = fs.existsSync(fileName)
        if (exist) {
            fs.readFile(fileName, { flag: 'r', encoding: 'utf-8' }, (err, data) => {
                let result = JSON.parse(data)
                config.value.LoginName = result.LoginName
                config.value.LoginPwd = result.LoginPwd
                config.value.Server = result.Server
                config.value.Port = result.Port
                if (config.value.LoginName) {
                    isRemember.value = true
                }
            });
        } else {
            config.value = new Config()
        }
    } catch (err) {
        ElMessage.error("获取配置文件失败:" + err)
    }
}

function register() {
    window.createWindow("register", 600, 400)
}

function login() {
    isLoading.value = true
    const w = window.createWindow("home", 800, 600)
    w.setFullScreen(true)
    if (!isRemember.value) {
        config.value.LoginName = ""
        config.value.LoginPwd = ""
    }
    setConfig()
    isLoading.value = false
    remote.getCurrentWindow().close()
}

onMounted(() => {
    getConfig()
})

</script>