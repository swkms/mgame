<template>
    <div style="height:570px;display: flex;flex-direction: column;overflow: hidden;">
        <div style="display: flex;justify-content: center;align-items: center;flex:1">
            <el-form ref="formElement" style="width:400px" label-width="100px" :model="model" :rules="rules"
                label-position="top">
                <el-form-item label="游戏名称" prop="Name">
                    <el-input v-model="model.Name" autocomplete="new-password" />
                </el-form-item>
                <el-form-item label="游戏路径" prop="APP">
                    <div style="display: flex;width: 100%;">
                        <div style="flex:1">
                            <el-input :disabled="true" v-model="model.APP"></el-input>
                        </div>
                        <div>
                            <el-button type="primary" style="margin-left: 5px;" @click="selectAPP">选择</el-button>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="游戏封面" prop="Cover">
                    <div style="display: flex;justify-content: center;align-items: center;width: 100%;">
                        <el-image @click="selectFile"
                            style="width:380px;height:214px;border-radius: 5px;cursor: pointer;" fit="fill"
                            :src="model.Cover"></el-image>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <div style="height:40px;display: flex;justify-content: center;align-items: center;">
            <el-button type="primary" @click="save" :disable="isLoading"> 保存</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, PropType, onMounted } from "vue"
import { Game } from "@/src/models/game"
import { ElMessage, UploadFile, UploadFiles } from "element-plus"
import gameService from "@/src/services/gameservice"
const path = require('path');
const fs = require('fs');
const remote = require('@electron/remote')
import db from "@/src/tools/db"

const emit = defineEmits(['success'])
const props = defineProps({
    game: {
        type: Object as PropType<Game>,
        default: null
    },
})

const model = ref<Game>(Object.assign({}, props.game))

//#region 游戏封面

let alreadySelectedFile = false

function selectFile() {
    remote.dialog.showOpenDialog({
        filters: [
            { name: 'Images', extensions: ['jpg', 'png', 'webp'] }
        ]
    }).then(result => {
        if (result.filePaths && result.filePaths.length > 0) {
            model.value.Cover = result.filePaths[0]
            alreadySelectedFile = true
        }
    })
}

//#endregion

//#region 应用路径

function selectAPP() {
    remote.dialog.showOpenDialog({
        filters: [
            { name: '游戏程序', extensions: ['exe'] }
        ]
    }).then(result => {
        if (result.filePaths && result.filePaths.length > 0) {
            model.value.APP = result.filePaths[0]
        }
    })
}

//#endregion

//#region 验证规则

const rules = {
    Name: [
        {
            required: true,
            message: '请输入游戏名称',
            trigger: 'blur',
        },
        {
            min: 1,
            max: 50,
            message: '游戏名称小于50个字符',
            trigger: 'blur',
        },
    ],
    Cover: [
        {
            required: true,
            message: '请选择封面',
            trigger: 'blur',
        }
    ],
    APP: [
        {
            required: true,
            message: '请选择游戏执行程序',
            trigger: 'blur',
        }
    ],
}

//#endregion

//#region 保存

const formElement = ref<HTMLFormElement>()
const isLoading = ref(false)

function getFileExtension(filename) {
    // 检查文件名是否包含点
    const lastIndex = filename.lastIndexOf('.');

    // 如果没有点或者点是文件名的第一个字符（例如 ".hiddenfile"），则返回空字符串
    if (lastIndex === -1 || lastIndex === 0) {
        return '';
    }

    // 返回点之后的部分作为扩展名
    return filename.substring(lastIndex + 1);
}

async function save() {
    isLoading.value = true
    try {
        await formElement.value?.validate()
        if (alreadySelectedFile) {
            try {
                const rootPath = remote.app.getPath("userData")
                let dstPath = path.join(rootPath, "cover")
                if (!fs.existsSync(dstPath)) {
                    fs.mkdirSync(dstPath, { recursive: true });
                }
                dstPath = path.join(dstPath, new Date().getTime().toString() + "." + getFileExtension(model.value.Cover))
                fs.copyFileSync(model.value.Cover, dstPath);
                model.value.Cover = dstPath
            } catch (err) {
                return
            }
        }
        if (model.value.GameID != 0) {
            await gameService.modifyGame(model.value)
        } else {
            await db.createGame(model.value)
        }
        emit('success', model.value)
    } catch (ex) {
        ElMessage.error('保存数据失败:' + ex)
    } finally {
        isLoading.value = false
    }
}

//#endregion

</script>