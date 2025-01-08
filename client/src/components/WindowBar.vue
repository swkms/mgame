<template>
    <div class="window_bar">
        <div class="title">
            <el-image style="width:22px;height:22px;margin-right: 5px;" :src="icon" v-if="showIcon"></el-image>
            {{ title }}
        </div>
        <div class="option">
            <slot name="option"></slot>
        </div>
        <el-space wrap :size="5" class="menu_container">
            <div class="menu normal" @click="min" v-if="showMin">
                <Minus></Minus>
            </div>
            <div class="menu normal" v-if="showMax">
                <Square></Square>
            </div>
            <div class="menu close" @click="close" v-if="showClose">
                <Close></Close>
            </div>
        </el-space>
    </div>
</template>

<script setup lang="ts">
import { Minus, Close, Square } from "@icon-park/vue-next"
const remote = require('@electron/remote')

const props = defineProps({
    showMin: {
        type: Boolean,
        default: true
    },
    showMax: {
        type: Boolean,
        default: true
    },
    showClose: {
        type: Boolean,
        default: true
    },
    title: {
        type: String,
        default: ""
    },
    icon: {
        type: String,
        default: "./favicon.ico"
    },
    showIcon: {
        type: Boolean,
        default: false
    }
})

function close() {
    remote.getCurrentWindow().close()
}

function min() {
    remote.getCurrentWindow().minimize()

}

</script>

<style lang="scss">
.window_bar {
    height: 35px;
    display: flex;

    .title {
        display: flex;
        align-items: center;
        padding: 0px 10px;
        font-weight: bold;
        -webkit-app-region: drag;
    }

    >.option {
        flex: 1;
        // -webkit-app-region: drag;
    }

    .menu_container {
        position: absolute;
        right: 0px;
        top: 0px;

        .menu {
            height: 30px;
            width: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        }

        .menu.close:hover {
            background-color: var(--el-color-danger);
            color: white;
        }

        .menu.normal:hover {
            background-color: rgba(200, 200, 200, 0.5);
            color: white;
        }
    }
}
</style>