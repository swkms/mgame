<template>
    <div style="height: 100%;display: flex;flex-direction: column;">
        <div>
            <WindowBarComponent :show-min="false" :show-max="false">
            </WindowBarComponent>
        </div>
        <div style="flex:1">
            <RouterView></RouterView>
        </div>
    </div>
</template>

<script setup lang="ts">
import WindowBarComponent from "@/src/components/WindowBar.vue"
</script>