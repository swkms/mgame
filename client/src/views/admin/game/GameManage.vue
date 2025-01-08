<template>
    <div style="height: 100%;">
        <!--游戏-->
        <div style="flex:1;height: 100%;">
            <ModuleComponent title="游戏管理" :page-size="pageSize" :pageTotal="pageTotal" :show-pagination="true"
                :currentPageChanged="getGames">
                <template v-slot:option>
                    <div style="text-align: right;">
                        <el-space wrap :size="10">
                            <el-input v-model="searchContent" placeholder="游戏名称"></el-input>
                            <el-button type="primary" @click="getGames(1)">查询</el-button>
                            <el-button type="primary" @click="addGame">添加</el-button>
                            <el-button type="danger" @click="removeGames"
                                :disabled="selectedGames.length == 0">删除</el-button>
                        </el-space>
                    </div>
                </template>
                <el-table stripe :data="games" highlight-current-row empty-text="暂无数据"
                    @selection-change="selectChanged">
                    <el-table-column type="index" width="80" label="序号" align="center" header-align="center" />
                    <el-table-column type="selection" width="55" />
                    <el-table-column prop="Name" label="游戏名称" width="*" align="center" header-align="center">
                    </el-table-column>
                    <el-table-column #default="scope" label="时间" width="*" align="center" header-align="center">
                        {{ timestamp2date(scope.row.CreateTime) }}
                    </el-table-column>
                    <el-table-column #default="scope" label="封面" width="*" align="center" header-align="center">
                        <el-popover placement="right" width="300px" height="428px" trigger="hover">
                            <template #reference>
                                <el-button type="primary" circle>
                                    <Pic></Pic>
                                </el-button>
                            </template>
                            <div>
                                <el-image style="width:100%;height:100%" :src="'/files/' + scope.row.Cover"></el-image>
                            </div>
                        </el-popover>
                    </el-table-column>
                    <el-table-column #default="scope" label="修改" width="60" align="center" header-align="center">
                        <el-button type="warning" circle @click="modifyGame(scope.row)">
                            <Write></Write>
                        </el-button>
                    </el-table-column>
                </el-table>
            </ModuleComponent>
        </div>

        <el-dialog :title="selectedGame?.GameID == 0 ? '添加游戏' : '修改游戏'" :destroy-on-close="true"
            v-model="visiableAddGame" width="500" align-center :close-on-click-modal="false"
            :close-on-press-escape="false">
            <AddGameComponent @success="modeifyGameSuccess" :game="selectedGame">
            </AddGameComponent>
        </el-dialog>
    </div>

</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import ModuleComponent from "@/src/components/Module.vue"
import gameService from "@/src/services/gameservice";
import { ElLoading, ElMessage, ElMessageBox } from "element-plus";
import { Game } from "@/src/models/game"
import { timestamp2date } from "@mm/mtools"
import AddGameComponent from "./AddGame.vue"
import { Write, Pic } from "@icon-park/vue-next"

//#region 游戏

const games = ref(new Array<Game>())
const selectedGame = ref<Game>()
const visiableAddGame = ref(false)
const searchContent = ref("")
const currentPage = ref(1)
const pageSize = ref(50)
const pageTotal = ref(50)
let selectedGames = new Array<Game>()

async function getGames(page = 1) {
    currentPage.value = page
    const loading = ElLoading.service({
        text: "正在获取游戏",
        background: "var(--mm-loading-background)"
    })
    const result = await gameService.getGames(page, pageSize.value, searchContent.value)
    if (result.isSuccess) {
        games.value = result.content.Datas
        pageTotal.value = result.content.Count
    } else {
        ElMessage.error("获取游戏失败:" + result.error)
    }
    loading.close()
}

function addGame() {
    selectedGame.value = new Game()
    visiableAddGame.value = true
}

function modifyGame(game: Game) {
    selectedGame.value = game
    visiableAddGame.value = true
}

function modeifyGameSuccess() {
    visiableAddGame.value = false
    getGames()
}

async function removeGames() {
    ElMessageBox.confirm('是否删除游戏?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
    }).then(async () => {

        const loading = ElLoading.service({
            text: "正在删除游戏",
            background: "var(--mm-loading-background)"
        })

        const ids = new Array<number>()
        selectedGames.forEach(f => {
            ids.push(f.GameID)
        })
        const result = await gameService.removeGames(ids)
        if (result.isSuccess) {
            selectedGames = new Array<Game>()
            getGames()
        } else {
            ElMessage.error("删除失败:" + result.error)
        }
        loading.close()
    })
}

function selectChanged(games: Array<Game>) {
    selectedGames = games
}

//#endregion

onMounted(() => {
    getGames()
})

</script>