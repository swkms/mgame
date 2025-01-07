<template>
    <div style="height:340px;display: flex;flex-direction: column;overflow: hidden;">
        <div style="display: flex;justify-content: center;align-items: center;flex:1">
            <el-form ref="formElement" style="width:400px" label-width="100px" :model="model" :rules="rules">
                <el-form-item label="游戏名称" prop="Name">
                    <el-input v-model="model.Name" autocomplete="new-password" />
                </el-form-item>
                <el-form-item label="游戏封面" prop="Cover">
                    <div style="display: flex;width: 100%;">
                        <div style="flex:1">
                            <el-input v-model="model.Cover"></el-input>
                        </div>
                        <div>
                            <el-upload :on-change="uploadHddFileChange" :show-file-list="false" :accept="coverAccepts"
                                :multiple="false" :auto-upload="false">
                                <template #trigger>
                                    <el-button type="primary" style="margin-left: 5px;">选择</el-button>
                                </template>
                            </el-upload>
                        </div>
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
import { checkAcceptExt } from '@mm/mtools'

const emit = defineEmits(['success'])
const props = defineProps({
    game: {
        type: Object as PropType<Game>,
        default: null
    },
})

const model = ref<Game>(Object.assign({}, props.game))

//#region 游戏封面

const coverAccepts = ref(".jpg,.png")
let uploadFile: UploadFile | null = null

function uploadHddFileChange(_uploadFile: UploadFile, uploadFiles: UploadFiles) {
    if (_uploadFile.status == "ready") {
        const found = checkAcceptExt(coverAccepts.value, _uploadFile.raw?.name!)
        if (!found) {
            ElMessage.error("请选择指定格式范围文件: " + coverAccepts.value)
            return
        }
        uploadFile = _uploadFile
        model.value.Cover=uploadFile.name
    }
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
}

//#endregion

//#region 保存

const formElement = ref<HTMLFormElement>()
const isLoading = ref(false)

async function save() {
    isLoading.value = true
    try {
        await formElement.value?.validate()

        if (uploadFile) {
            const uploadResult = await gameService.upload("/api/game/upload", { SavePath: "cover" },
                uploadFile!.raw as File, null, null)
            if (uploadResult.isSuccess) {
                model.value.Cover = uploadResult.content
            } else {
                ElMessage.error('上传封面失败:' + uploadResult.error)
                return
            }
        }

        let result: any
        if (model.value.GameID != 0) {
            result = await gameService.modifyGame(model.value)
        } else {
            result = await gameService.addGame(model.value)
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

</script>