<template>
    <div class="music-widget" v-html="logo" @click="openDialog('/view.vue')"></div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import LogoSVG from './assets/logo.svg'
import { openDialog } from 'widget'

const logo = ref(decodeURIComponent(LogoSVG.split(',')[1]))
</script>
<style lang="scss" scoped>
.music-widget {
    width: 100%;
    height: 100%;
    background-image: linear-gradient(180deg, #ff5b49, #f81414);
    cursor: pointer;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;

    :deep(svg) {
        width: 60%;
        height: 60%;
        margin-left: -10px;
    }
}
</style>