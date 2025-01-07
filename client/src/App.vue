<template>
  <RouterView style="overflow: hidden;height: 100%;"></RouterView>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
const remote = require('@electron/remote')

remote.getCurrentWindow().setFullScreen(false)
remote.getCurrentWindow().setSize(1366,768)
</script>
