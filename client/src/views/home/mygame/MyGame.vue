<template>
    <div class="module">
        <div style="display: flex;padding: 10px;">
            <el-space style="flex:1">
                <el-input v-model="searchContent" placeholder="游戏名称"></el-input>
                <el-button type="primary" @click="getGames">查询</el-button>
            </el-space>
            <div>
                <el-button type="primary" @click="addGame">添加</el-button>
            </div>
        </div>
        <div class="container" ref="containerElement">
            <div v-for="item in games" class="game_item">
                <div ref="colElement" class="content" :class="item.IsSelected ? 'active' : ''">
                    <div @click="openGame(item)" :style="{ height: coverHeight + 'px' }" class="cover">
                        <el-image style="width:100%;height: 100%;" fit="fill" :src="item.Cover"></el-image>
                    </div>
                    <div class="title">
                        <el-text style="margin: 10px;" :truncated="true">{{ item.Name }}</el-text>
                    </div>
                    <div class="detail">
                        <div style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
                            <el-button @click="openGame(item)" type="success" circle style="height: 50px;width: 50px;">
                                <PlayOne style="color:var(--mm-color-success)" theme="outline" size="40"
                                    :strokeWidth="1"></PlayOne>
                            </el-button>
                            <el-text>{{ item.Name }}</el-text>
                        </div>
                        <div class="detail_opt">
                            <el-space :size="5">
                                <el-button type="danger" circle @click="removeGame(item)">
                                    <Delete></Delete>
                                </el-button>
                                <el-button type="warning" circle @click="modifyGame(item)">
                                    <Write></Write>
                                </el-button>
                            </el-space>
                        </div>
                    </div>
                    <div class="detail_gamepad" v-if="item.IsSelected">
                        <div style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
                            <el-button @click="openGame(item)" type="success" circle style="height: 50px;width: 50px;">
                                <PlayOne style="color:var(--mm-color-success)" theme="outline" size="40"
                                    :strokeWidth="1"></PlayOne>
                            </el-button>
                            <el-text>{{ item.Name }}</el-text>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <el-drawer v-model="visiableAddGame" :title="selectedGame?.GameID == 0 ? '添加游戏' : '修改游戏'"
            destroy-on-close="true" direction="rtl" size="800" :close-on-click-modal="false"
            :close-on-press-escape="false">
            <AddGameComponent @success="modeifyGameSuccess" :game="selectedGame">
            </AddGameComponent>
        </el-drawer>

        <el-dialog @close="openGameClosed" @open="openGameOpened" title="启动游戏" :destroy-on-close="true"
            v-model="visiableStartGame" width="500" align-center :close-on-click-modal="false"
            :close-on-press-escape="false">
            <div style="height: 300px;display: flex;flex-direction: column;">
                <div style="flex:1;display: flex;justify-content: center;">
                    <el-text>{{ selectedOpenGame?.Name }}</el-text>
                </div>
                <div style="text-align: right;">
                    <el-space :size="5">
                        <el-button type="danger" @click="cancelOpenGame">取消 (B)</el-button>
                        <el-button type="primary" @click="confirmOpenGame">启动 (A)</el-button>
                    </el-space>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { Game } from '@/src/models/game';
import { ElMessage, ElMessageBox } from 'element-plus';
const remote = require('@electron/remote')
import db from '@/src/tools/db';
import AddGameComponent from "./AddGame.vue"
const { exec, spawn } = require('child_process');
const path = require('path');
import { Delete, Write, Play, PlayOne } from "@icon-park/vue-next"

//#region 数据

const coverHeight = ref(280)
const containerElement = ref()
const searchContent = ref("")
const games = ref(new Array<Game>())

async function getGames() {
    try {
        const result = await db.getGames(searchContent.value)
        if (result) {
            games.value = []
            for (let i = 0; i < 3; i++) {
                result.forEach(f => {
                    games.value.push(JSON.parse(JSON.stringify(f)))
                })
            }
        }
    } catch (ex) {
        ElMessage.error("获取数据失败:" + ex)
    }
}

//#endregion

//#region 手柄

enum CurrentPage{
    MAIN,
    OPENGAMECONFIRM
}

let currentPage = CurrentPage.MAIN

function listenGamepad() {

    var controllers = {}
    var lastPressTime = 0
    let leftStatus = false
    let rightStatus = false
    let topStatus = false
    let downStatus = false
    let jStatus = false
    let xStatus = false
    let yStatus = false
    let aStatus = false
    let bStatus = false

    function connecthandler(e) {
        console.log("connecthandler")
        //发现手柄
        controllers[e.gamepad.index] = e.gamepad;
        window.requestAnimationFrame(updateStatus);
    }

    function disconnecthandler(e) {
        console.log("disconnecthandler")
        //移除手柄
        delete controllers[e.gamepad.index];
    }

    function updateStatus() {
        scangamepads();

        let oldIndex = -1
        let index = -1
        for (let i = 0; i < games.value.length; i++) {
            if (games.value[i].IsSelected) {
                index = i
                oldIndex = i
                break
            }
        }

        const nowTime = new Date().getTime()
        const timeout = 250

        for (let j in controllers) {
            if (true) {
                var controller = controllers[j];

                //#region 按键

                for (var i = 0; i < controller.buttons.length; i++) {
                    var val = controller.buttons[i];
                    var pressed = val == 1.0;
                    var touched = false;
                    if (typeof (val) == "object") {
                        pressed = val.pressed;
                        if ('touched' in val) {
                            touched = val.touched;
                        }
                        val = val.value;
                    }

                    var pct = Math.round(val * 100) + "%";
                    if (pressed) {
                        //console.log("pressed  " + i.toString() + " " + pct);

                        switch (i) {
                            case 14:
                                if (oldIndex == -1) {
                                    index = 0
                                    lastPressTime = new Date().getTime()
                                } else if (!leftStatus || (leftStatus && nowTime - lastPressTime >= timeout)) {
                                    if (index - 1 >= 0) {
                                        index--
                                    }
                                    lastPressTime = new Date().getTime()
                                }
                                leftStatus = true
                                break
                            case 12:
                                if (oldIndex == -1) {
                                    index = 0
                                    lastPressTime = new Date().getTime()
                                } else if (!topStatus || (topStatus && nowTime - lastPressTime >= timeout)) {
                                    if (index - countCol >= 0) {
                                        index -= countCol
                                    }
                                    lastPressTime = new Date().getTime()
                                }
                                topStatus = true
                                break
                            case 15:
                                if (oldIndex == -1) {
                                    index = 0
                                    lastPressTime = new Date().getTime()
                                } else if (!rightStatus || (rightStatus && nowTime - lastPressTime >= timeout)) {
                                    if (index + 1 < games.value.length) {
                                        index++
                                    }
                                    lastPressTime = new Date().getTime()
                                }
                                rightStatus = true
                                break
                            case 13:
                                if (oldIndex == -1) {
                                    index = 0
                                    lastPressTime = new Date().getTime()
                                } else if (!downStatus || (downStatus && nowTime - lastPressTime >= timeout)) {
                                    if (index + countCol < games.value.length) {
                                        index += countCol
                                    }
                                    lastPressTime = new Date().getTime()
                                }
                                downStatus = true

                                break
                            case 2:
                                if (!xStatus) {
                                    console.log("pressed X " + i.toString() + " " + pct);
                                }
                                xStatus = true
                                break
                            case 3:
                                if (!yStatus) {
                                    console.log("pressed Y " + i.toString() + " " + pct);
                                }
                                yStatus = true
                                break
                            case 1:
                                if (!bStatus) {
                                    console.log("pressed B " + i.toString() + " " + pct);

                                    switch (currentPage) {
                                        case CurrentPage.MAIN:
                                            //openGame(games.value[index])
                                            break
                                        case CurrentPage.OPENGAMECONFIRM:
                                            cancelOpenGame()
                                            break
                                    }
                                }
                                bStatus = true
                                break
                            case 0:
                                if (!aStatus) {
                                    console.log("pressed A " + i.toString() + " " + pct,currentPage);
                                    switch (currentPage) {
                                        case CurrentPage.MAIN:
                                            openGame(games.value[index])
                                            break
                                        case CurrentPage.OPENGAMECONFIRM:
                                            confirmOpenGame()
                                            break
                                    }

                                }
                                aStatus = true
                                break
                        }
                    } else {
                        switch (i) {
                            case 14:
                                leftStatus = false
                                break
                            case 12:
                                topStatus = false
                                break
                            case 15:
                                rightStatus = false
                                break
                            case 13:
                                downStatus = false
                                break
                            case 2:
                                xStatus = false
                                break
                            case 3:
                                yStatus = false
                                break
                            case 1:
                                bStatus = false
                                break
                            case 0:
                                aStatus = false
                                break
                        }
                    }
                    if (touched) {
                        //console.log("touched " + i.toString() + " " + pct);
                    }
                }

                //#endregion

                //#region 左侧摇杆

                let lh = 0
                let lv = 0
                for (var i = 0; i < controller.axes.length; i++) {
                    const value = controller.axes[i].toFixed(4)
                    switch (i) {
                        case 0:
                            lh = value
                            break
                        case 1:
                            lv = value
                            break
                        case 2:
                            break
                        case 3:
                            break
                    }
                }

                if (Math.abs(lh) > Math.abs(lv)) {
                    if (lh < -0.4) {
                        if (oldIndex == -1) {
                            index = 0
                            lastPressTime = new Date().getTime()
                        } else if (oldIndex == -1) {
                            index = 0
                            lastPressTime = new Date().getTime()
                        } else if (!jStatus || (jStatus && nowTime - lastPressTime >= timeout)) {
                            if (index - 1 >= 0) {
                                index--
                            }
                            lastPressTime = new Date().getTime()
                        }
                        jStatus = true
                    } else if (lh > 0.4) {
                        if (oldIndex == -1) {
                            index = 0
                            lastPressTime = new Date().getTime()
                        } else if (!jStatus || (jStatus && nowTime - lastPressTime >= timeout)) {
                            if (index + 1 < games.value.length) {
                                index++
                            }
                            lastPressTime = new Date().getTime()
                        }
                        jStatus = true
                    }
                } else if (Math.abs(lh) < Math.abs(lv)) {
                    if (lv < -0.4) {
                        if (oldIndex == -1) {
                            index = 0
                            lastPressTime = new Date().getTime()
                        } else if (!jStatus || (jStatus && nowTime - lastPressTime >= timeout)) {
                            if (index - countCol >= 0) {
                                index -= countCol
                            }
                            lastPressTime = new Date().getTime()
                        }
                        jStatus = true
                    } else if (lv > 0.4) {
                        if (oldIndex == -1) {
                            index = 0
                            lastPressTime = new Date().getTime()
                        } else if (!jStatus || (jStatus && nowTime - lastPressTime >= timeout)) {
                            if (index + countCol < games.value.length) {
                                index += countCol
                            }
                            lastPressTime = new Date().getTime()
                        }
                        jStatus = true
                    }
                }

                //#endregion

            }
        }

        if (oldIndex != index) {
            for (let i = 0; i < games.value.length; i++) {
                if (i == index) {
                    games.value[i].IsSelected = true
                } else {
                    games.value[i].IsSelected = false
                }
            }
            containerElement.value.scrollTop = Math.floor(index / 6) * coverHeight.value
        }

        window.requestAnimationFrame(updateStatus);
    }

    function scangamepads() {
        if (navigator.getGamepads) {
            const gamepads = navigator.getGamepads()
            for (var i = 0; i < gamepads.length; i++) {
                const gamepad = gamepads[i]
                if (gamepad && (gamepad.index in controllers)) {
                    controllers[gamepad.index] = gamepads[i];
                }
            }
        }
    }

    window.addEventListener("gamepadconnected", connecthandler);
    window.addEventListener("gamepaddisconnected", disconnecthandler);
}

//#endregion

//#region 添加

const selectedGame = ref<Game>()
const visiableAddGame = ref(false)

function modifyGame(game: Game) {
    selectedGame.value = game
    visiableAddGame.value = true
}

function addGame() {
    selectedGame.value = new Game()
    selectedGame.value.Cover = "/logo.jpg"
    visiableAddGame.value = true
}

function modeifyGameSuccess() {
    visiableAddGame.value = false
    getGames()
}

//#endregion

//#region 开启游戏

const visiableStartGame = ref(false)
const selectedOpenGame = ref<Game>()

function openGameClosed() {
    currentPage = CurrentPage.MAIN
    visiableStartGame.value = false
    console.log("openGameClosed")
}

function openGameOpened() {
    currentPage =CurrentPage.OPENGAMECONFIRM
}

function cancelOpenGame() {
    visiableStartGame.value = false
}

function confirmOpenGame() {
    visiableStartGame.value = false
    if (selectedOpenGame.value) {
        const command = path.basename(selectedOpenGame.value.APP);
        const args = [];

        const workingDirectory = path.dirname(selectedOpenGame.value.APP);
        const child = spawn(command, args, {
            cwd: workingDirectory,
            stdio: ['inherit', 'pipe', 'pipe']
        });

        child.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        child.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        child.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });

        child.on('error', (code) => {
            ElMessage.error(code.toString())
        })
    }
}

function openGame(game: Game) {
    selectedOpenGame.value = game
    visiableStartGame.value = true
}

//#endregion

//#region 删除

function removeGame(game: Game) {
    ElMessageBox.confirm(
        game.Name,
        '删除游戏',
        {
            cancelButtonClass: 'el-button--danger',
            closeOnClickModal: false,
            closeOnPressEscape: false,
            closeOnHashChange: false,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: '',
        }
    )
        .then(() => {
            try {
                db.removeGame(game.GameID)
                ElMessage.success("删除成功")
                getGames()
            } catch (err) {
                ElMessage.error("删除失败:" + err)
            }
        })
        .catch(() => {

        })
}

//#endregion

let countCol = 5
let countRow = 0
const colElement = ref()

onMounted(async () => {

    listenGamepad()

    await db.openDB()
    await getGames()

    nextTick(() => {
        const containerWidth = containerElement.value.clientWidth
        const containerHeight = containerElement.value.clientHeight
        coverHeight.value = Math.floor((containerWidth / countCol - 20) / (1.77))
        countRow = Math.floor(containerHeight / (coverHeight.value + 30)) + 1
    })

})

</script>
