<template>
    <div style="height:340px;display: flex;flex-direction: column;overflow: hidden;">
        <div style="display: flex;justify-content: center;align-items: center;flex:1">
            <el-form ref="formElement" style="width:400px" label-width="100px" :model="model" :rules="rules">
                <el-form-item label="所属部门">
                    <span>{{ model.OrganizationName }}</span>
                </el-form-item>
                <el-form-item label="用户姓名" prop="Name">
                    <el-input v-model="model.Name" autocomplete="new-password" />
                </el-form-item>
                <el-form-item label="登录名称" prop="LoginName">
                    <el-input v-model="model.LoginName" autocomplete="new-password" />
                </el-form-item>
                <el-form-item label="登录密码" prop="LoginPwd" v-if="model.UserID == 0">
                    <el-input v-model="model.LoginPwd" autocomplete="new-password" />
                </el-form-item>
                <el-form-item label="用户角色">
                    <el-select v-model="model.RoleID" style="width:100%">
                        <el-option v-for="item in roles" :key="item.RoleID" :label="item.Name" :value="item.RoleID" />
                    </el-select>
                </el-form-item>
                <el-form-item label="启用账号">
                    <el-checkbox v-model="model.Enabled"></el-checkbox>
                </el-form-item>
            </el-form>
        </div>
        <div style="height:40px;display: flex;justify-content: center;align-items: center;">
            <el-button type="primary" @click="save"> {{ isLoading ? '正在保存...' : "保存" }}</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, PropType, onMounted } from "vue"
import { Role, User } from "@/src/models/model"
import { ElMessage } from "element-plus"
import userService from "@/src/services/userservice"
import { convertPY } from '@mm/mtools'
import { Md5 } from 'ts-md5';

const emit = defineEmits(['success'])
const props = defineProps({
    user: {
        type: Object as PropType<User>,
        default: null
    },
})

const model = ref<User>(Object.assign({}, props.user))

//#region 角色
const roles = ref(new Array<Role>())

async function getRoles() {
    let result = await userService.getRoles()
    if (result.isSuccess) {
        roles.value = result.content
        if (model.value.UserID == 0 && result.content && result.content.length > 0) {
            model.value.RoleID = result.content[0].RoleID
        }
    } else {
        ElMessage.error("获取角色失败:" + result.error)
    }
}

//#endregion

//#region 验证规则

const checkName = (rule: any, value: string, callback: any) => {
    let isSuccess = false
    if (value && value.length > 0 && value.length < 20) {
        isSuccess = true
        if (model.value.LoginName == "") {
            model.value.LoginName = convertPY(value)
        }
    }
    if (isSuccess) {
        callback()
    } else {
        callback(new Error('姓名不能为空,并且小于20个字符'))
    }
}

const rules = {
    Name: [
        {
            required: true,
            message: '请输入用户名称',
            trigger: 'blur',
        },
        {
            min: 1,
            max: 10,
            message: '用户名称小于10个字符',
            trigger: 'blur',
        },
        {
            validator: checkName,
            trigger: 'blur',
        },
    ],
    LoginName: [
        {
            required: true,
            message: '请输入登录名称',
            trigger: 'blur',
        },
        {
            min: 1,
            max: 10,
            message: '登录名称小于10个字符',
            trigger: 'blur',
        },
    ],
    LoginPwd: [
        {
            required: true,
            message: '请输入登陆密码',
            trigger: 'blur',
        },
        {
            min: 1,
            max: 20,
            message: '登陆密码小于20个字符',
            trigger: 'blur',
        },
    ],
}

//#endregion

//#region 保存

const formElement = ref<HTMLFormElement>()
const isLoading = ref(false)

async function save() {
    isLoading.value = true
    try {
        await formElement.value?.validate()

        model.value.CanRemoved = true

        let result: any
        if (model.value.UserID != 0) {
            result = await userService.modifyUser(model.value)
        } else {
            const md5: any = new Md5()
            md5.appendAsciiStr(model.value.LoginPwd)
            model.value.LoginPwd = md5.end()
            model.value.Enabled = true
            result = await userService.addUser(model.value)
        }
        if (result.isSuccess) {
            emit('success', model.value)
        } else {
            ElMessage.error('保存数据失败:' + result.error)
        }
    } catch (ex) {
        console.log(ex)
    } finally {
        isLoading.value = false
    }
}

//#endregion

onMounted(() => {
    getRoles()
})

</script>