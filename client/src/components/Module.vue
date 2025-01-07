<template>
    <div class="module">
        <div class="header" v-if="hasOptionSlot||title!=''">
            <div class="title">
                <span>{{ title }}</span>
            </div>
            <div :style="{ paddingLeft: title == '' ? '0px' : '20px' }" class="option">
                <slot name="option"></slot>
            </div>
        </div>
        <div style="flex:1;overflow:hidden;padding: 10px 0 0 0;box-sizing: border-box;">
            <slot></slot>
        </div>
        <div class="pagination" v-if="showPagination">
            <div class="arrow" style="border-right: 1px solid var(--mm-color-border-primary);">
                <el-link @click="prev" :disabled="prevDisabled" :underline="false">
                    <ArrowLeft></ArrowLeft>
                </el-link>
            </div>
            <div style="flex:1;">
                <el-pagination ref="paginationElement" :layout="layout" :total="pageTotal"
                    v-model:current-page="currentPageModel" @current-change="currentPageChanged"
                    @size-change="handleSizeChange" :page-sizes="pageSizes"
                    v-model:page-size="pageSizeModel"></el-pagination>
            </div>
            <div class="arrow" style="border-left: 1px solid var(--mm-color-border-primary);">
                <el-link @click="next" :disabled="nextDisabled" :underline="false">
                    <ArrowRight></ArrowRight>
                </el-link>
            </div>
        </div>
        <div style="padding:10px" v-if="hasFooterSlot">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<style lang="scss">
.module {
    height: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--mm-color-border-primary);
    border-radius: 5px;
    background-color: var(--mm-color-body-primary-20);
    overflow: hidden;
    box-sizing: border-box;
    box-shadow: 0px 0px 1px rgba(255, 255, 255, 0.1) inset;

    >.header {

        display: flex;
        align-items: center;
        padding: 8px;
        border-bottom: 1px solid var(--mm-color-border-primary);
        min-height: 28px;
        background: linear-gradient(90deg, rgba(0, 0, 0, 0.1) 0%, var(--mm-color-primary-10) 50%, rgba(0, 0, 0, 0.1) 100%);

        >.title {
            font-size: 16px;
            font-weight: bold;
            color: var(--mm-color-text-thrid);
        }

        >.option {
            flex: 1;
            padding-left: 20px;
            box-sizing: border-box;
        }
    }

    >.el-table {
        border: none;
    }

    >.pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 30px;
        border-top: 1px solid var(--mm-color-border-primary);
        width: 100%;

        .arrow {
            width: 50px;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .arrow .el-link {
            color: var(--mm-color-font-thrid);
            font-size: 20px;
        }

        .arrow .el-link:hover {
            color: var(--mm-color-font-secondary);
        }
    }

    >.pagination .el-select__wrapper {
        background-color: rgba(0, 0, 0, 0);
        box-shadow: none;
    }

    >.pagination .el-pagination .el-select {
        width: 100px;
    }

    >.pagination .el-pagination {
        display: flex;
        padding: 0px 10px;
        box-sizing: border-box;
    }

    >.pagination .el-pager {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { ArrowLeft, ArrowRight } from "@icon-park/vue-next"
import { useSlots } from "vue";

const props = defineProps({
    title: {
        type: String,
        default: ""
    },
    pageTotal: {
        type: Number,
        default: 0,
    },
    pageSize: {
        type: Number,
        default: 10,
    },
    pageSizes: {
        type: Array<Number>,
        default: [10, 20, 30, 50, 100]
    },
    layout: {
        type: String,
        default: "total, pager,sizes"
    },
    showPagination: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits([
    'currentPageChanged',
    'contentSizeChanged',
    'update:pageSize'
])

const pageSizeModel = ref(props.pageSize)
const currentPageModel = ref(1)

const hasOptionSlot = !!useSlots().option;
const hasFooterSlot = !!useSlots().footer;


//#region 分页

const paginationElement = ref()
const prevDisabled = ref(false)
const nextDisabled = ref(false)

function currentPageChanged(pageIndex: number) {
    emit('currentPageChanged', pageIndex)
    checkCurrentPage()
}

function handleSizeChange() {
    emit('update:pageSize', pageSizeModel.value)
    if (currentPageModel.value != 1) {
        currentPageModel.value = 1
    }
    emit('currentPageChanged', 1)

    checkCurrentPage()
}

function prev() {
    currentPageModel.value--
    currentPageChanged(currentPageModel.value)
}

function next() {
    currentPageModel.value++
    currentPageChanged(currentPageModel.value)
}

function checkCurrentPage() {
    const total = Math.ceil(props.pageTotal / pageSizeModel.value)
    if (currentPageModel.value == 1) {
        prevDisabled.value = true
    } else {
        prevDisabled.value = false
    }

    if (currentPageModel.value == total) {
        nextDisabled.value = true
    } else {
        nextDisabled.value = false
    }
}

//#endregion

onMounted(() => {
    checkCurrentPage()
})

</script>