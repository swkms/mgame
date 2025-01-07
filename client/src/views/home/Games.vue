<template>
    <div style="height:100%;overflow: hidden;display: flex;flex-direction: column;">
        <div class="container" ref="containerElement">
            <el-row :gutter="20">
                <el-col :span="4" style="margin-bottom: 20px;" v-for="item in games">
                    <div @click="selectChange(item)" class="item" :class="item.IsSelected ? 'active' : ''"
                        :style="{ height: itemHeight + 'px' }">
                        <div class="cover">
                            <el-image fit="cover" :src="'/files/' + item.Cover"></el-image>
                        </div>
                        <div class="title">
                            <el-text>{{ item.Name }}</el-text>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div style="display: flex;align-items: center;justify-content: center;padding: 2px;">
            <el-pagination layout="prev, pager, next" :total="total" :pager-count="10" :page-size="24"
                @current-change="getGames" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { Game } from '@/src/models/game';
import gameservice from '@/src/services/gameservice';
import { ElMessage } from 'element-plus';
const remote = require('@electron/remote')

//#region 数据

const itemHeight = ref(280)
const containerElement = ref()
const total = ref(0)

const games = ref(new Array<Game>())

async function getGames(pageIndex = 1) {
    const result = await gameservice.getGames(pageIndex, 100)
    if (result.isSuccess) {
        games.value = []
        if (result.content) {
            if (result.content.Datas) {
                result.content.Datas.forEach(f => {
                    games.value.push(f)
                })

                if (result.content.Datas.length > 0) {
                    result.content.Datas[0].IsSelected = true
                }
            }
            total.value = result.content.Count
        }
    } else {
        ElMessage.error("获取数据失败:" + result.error)
    }
}

//#endregion

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

        let oldIndex = 0
        let index = 0
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
                                if (!leftStatus || (leftStatus && nowTime - lastPressTime >= timeout)) {
                                    if (index - 1 >= 0) {
                                        index--
                                    }
                                    lastPressTime = new Date().getTime()
                                }
                                leftStatus = true
                                break
                            case 12:
                                if (!topStatus || (topStatus && nowTime - lastPressTime >= timeout)) {
                                    if (index - countCol >= 0) {
                                        index -= countCol
                                    }
                                    lastPressTime = new Date().getTime()
                                }
                                topStatus = true
                                break
                            case 15:
                                if (!rightStatus || (rightStatus && nowTime - lastPressTime >= timeout)) {
                                    if (index + 1 < games.value.length) {
                                        index++
                                    }
                                    lastPressTime = new Date().getTime()
                                }
                                rightStatus = true
                                break
                            case 13:
                                if (!downStatus || (downStatus && nowTime - lastPressTime >= timeout)) {
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
                                }
                                bStatus = true
                                break
                            case 0:
                                if (!aStatus) {
                                    console.log("pressed A " + i.toString() + " " + pct);
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
                        if (!jStatus || (jStatus && nowTime - lastPressTime >= timeout)) {
                            if (index - 1 >= 0) {
                                index--
                            }
                            lastPressTime = new Date().getTime()
                        }
                        jStatus = true
                    } else if (lh > 0.4) {
                        if (!jStatus || (jStatus && nowTime - lastPressTime >= timeout)) {
                            if (index + 1 < games.value.length) {
                                index++
                            }
                            lastPressTime = new Date().getTime()
                        }
                        jStatus = true
                    }
                } else if (Math.abs(lh) < Math.abs(lv)) {
                    if (lv < -0.4) {
                        if (!jStatus || (jStatus && nowTime - lastPressTime >= timeout)) {
                            if (index - countCol >= 0) {
                                index -= countCol
                            }
                            lastPressTime = new Date().getTime()
                        }
                        jStatus = true
                    } else if (lv > 0.4) {
                        if (!jStatus || (jStatus && nowTime - lastPressTime >= timeout)) {
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
            containerElement.value.scrollTop = Math.floor(index / 6) * itemHeight.value
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

function selectChange(game: Game) {
    games.value.forEach(f => {
        if (game == f) {
            f.IsSelected = true
        } else {
            f.IsSelected = false
        }
    })
}

let countCol = 6
let countRow = 0

onMounted(() => {

    nextTick(() => {
        const containerWidth = containerElement.value.clientWidth - 40 - 20 * 5
        const containerHeight = containerElement.value.clientHeight - 40
        itemHeight.value = Math.floor(containerWidth / countCol / (12 / 16)) + 40
        countRow = Math.floor(containerHeight / (itemHeight.value + 30)) + 1
    })

    listenGamepad()

    getGames()
})

</script>
