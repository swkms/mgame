<template>
    <div style="display: flex;height: 100%;padding: 20px;box-sizing: border-box;">
        <!--用户-->
        <div style="flex:1;height: 100%;">
            <ModuleComponent title="用户列表" :page-size="pageSize" :pageTotal="pageTotal" :show-pagination="true"
                :currentPageChanged="getUsers">
                <template v-slot:option>
                    <div style="text-align: right;">
                        <el-space wrap :size="5">
                            <el-input v-model="searchContent" placeholder="用户名称"></el-input>
                            <el-button type="primary" @click="getUsers(1)">查询</el-button>
                            <el-button type="primary" @click="addUser" :disabled="!selectedOrganization">添加</el-button>
                            <el-button type="danger" @click="removeUsers"
                                :disabled="!users?.some(f => f.IsSelected)">删除</el-button>
                        </el-space>
                    </div>
                </template>
                <el-table stripe ref="userTableElement" :data="users" style="width: 100%;width:100%;" height="100%"
                    highlight-current-row empty-text="暂无数据">
                    <el-table-column type="index" width="80" label="序号" align="center" header-align="center" />
                    <el-table-column width="50">
                        <template #header>
                            <el-checkbox @change="selectedChangeAll"></el-checkbox>
                        </template>
                        <template #default="scope">
                            <el-checkbox v-if="scope.row.CanRemoved" v-model="scope.row.IsSelected"></el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column prop="Name" label="用户名称" width="*" align="center" header-align="center">
                    </el-table-column>
                    <el-table-column prop="OrganizationName" label="所属机构" width="*" align="center"
                        header-align="center">
                    </el-table-column>
                    <el-table-column prop="RoleName" label="用户角色" width="*" align="center" header-align="center">
                    </el-table-column>
                    <el-table-column #default="scope" label="重置密码" width="100" align="center" header-align="center">
                        <el-button type="warning" circle @click="resetPwd(scope.row)">
                            <Key></Key>
                        </el-button>
                    </el-table-column>
                    <el-table-column #default="scope" label="修改" width="60" align="center" header-align="center">
                        <el-button type="warning" circle @click="modifyUser(scope.row)">
                            <Write></Write>
                        </el-button>
                    </el-table-column>
                </el-table>
            </ModuleComponent>
        </div>

        <el-dialog :title="selectedUser?.UserID == 0 ? '添加用户' : '修改用户'" :destroy-on-close="true"
            v-model="visiableAddUser" width="500" align-center :close-on-click-modal="false"
            :close-on-press-escape="false">
            <AddUserComponent @success="modeifyUserSuccess" :user="selectedUser">
            </AddUserComponent>
        </el-dialog>
    </div>

</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import ModuleComponent from "@/src/components/Module.vue"
import userService from "@/src/services/userservice";
import { ElLoading, ElMessage, ElMessageBox } from "element-plus";
import { User } from "@/src/models/user"
import AddUserComponent from "./AddUser.vue"
import { Write, Key } from "@icon-park/vue-next"
import { Md5 } from 'ts-md5';

//#region 用户

const users = ref(new Array<User>())
const selectedUser = ref<User>()
const visiableAddUser = ref(false)
const searchContent = ref("")
const currentPage = ref(1)
const pageSize = ref(50)
const pageTotal = ref(50)

async function getUsers(page = 1) {
    currentPage.value = page
    const loading = ElLoading.service({
        text: "正在获取用户",
        background: "var(--mm-loading-background)"
    })
    let ids = new Array<number>
    if (selectedOrganization.value!.OrganizationID != 0) {
        ids = getOrganizationIDs(selectedOrganization.value!)
    }
    const result = await userService.getUsers(page, pageSize.value, ids, searchContent.value)
    if (result.isSuccess) {
        users.value = result.content.Datas
        pageTotal.value = result.content.Count
    } else {
        ElMessage.error("获取用户失败:" + result.error)
    }
    loading.close()
}

function addUser() {
    selectedUser.value = new User()
    selectedUser.value.OrganizationID = selectedOrganization.value!.OrganizationID
    selectedUser.value.OrganizationName = selectedOrganization.value!.Name
    visiableAddUser.value = true
}

function modifyUser(user: User) {
    selectedUser.value = user
    visiableAddUser.value = true
}

async function resetPwd(user: User) {

    const loading = ElLoading.service({
        text: "正在重置密码",
        background: "var(--mm-loading-background)"
    })

    const md5: any = new Md5()
    md5.appendAsciiStr("123456")
    user.LoginPwd = md5.end()

    const result = await userService.resetPwd(user)
    if (result.isSuccess) {
        ElMessage.success("重置" + user.Name + "的密码为123456")
    } else {
        ElMessage.error("删除失败:" + result.error)
    }
    loading.close()
}

function modeifyUserSuccess() {
    visiableAddUser.value = false
    getUsers()
}

async function removeUsers() {
    ElMessageBox.confirm('是否删除用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
    }).then(async () => {

        const loading = ElLoading.service({
            text: "正在删除用户",
            background: "var(--mm-loading-background)"
        })

        const ids = new Array<number>()
        users.value.forEach(f => {
            if (f.IsSelected) {
                ids.push(f.UserID)
            }
        })
        const result = await userService.removeUsers(ids)
        if (result.isSuccess) {
            getUsers()
        } else {
            ElMessage.error("删除失败:" + result.error)
        }
        loading.close()
    })
}

function selectedChangeAll(isSelected: boolean) {
    users.value.forEach(f => {
        if (f.CanRemoved) {
            f.IsSelected = isSelected
        }
    })
}

//#endregion

onMounted(() => {

})

</script>