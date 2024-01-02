<template>
    <div class="ys-wish-detail" tabindex="0">
        <Start v-if="showStartPage" @finished="download()" />
        <template v-else>
            <Loading class="loading" :percent="loadingProgress" :tip="loadingTip" @finished="showContent()"
                v-if="showLoading" />
            <WishHome v-else />
        </template>
    </div>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, ref } from "vue"
import Loading from './components/loading.vue';
import Start from './components/start.vue';
import WishHome from './components/wishHome.vue';
import { SoundPlayer } from "./libs/sound";
import { enableFullscreen } from 'widget'
import { FileStore } from './libs/files'

enableFullscreen(true)
const loadingProgress = ref(0)
const showLoading = ref(true)
const loadingTip = ref('')
const showStartPage = ref(true)
const fontEl = document.createElement('style')

function createFont() {
    const Font = FileStore.getFile('assets/fonts/AlimamaDaoLiTi.woff2');
    fontEl.innerHTML = `@font-face {
        font-family: AlimamaDaoLiTi;
        src: url(${Font}) format('woff2');
    }`
    document.body.append(fontEl);
}

function showContent() {
    showLoading.value = false;
}

function playOrPause() {
    if (document.visibilityState === "visible") {
        SoundPlayer.playBg();
    } else {
        SoundPlayer.pause();
    }
}

async function download() {
    showStartPage.value = false;
    try {
        await FileStore.download(progress => {
            loadingProgress.value = progress
        })
        createFont()
    } catch (error) {
        loadingTip.value = '资源加载失败, 请尝试刷新页面'
    }
}

document.addEventListener("visibilitychange", playOrPause)

onBeforeUnmount(() => {
    SoundPlayer.pause()
    fontEl.remove()
    document.removeEventListener("visibilitychange", playOrPause)
})
</script>
<style lang="scss">
:host([fullscreen]) {
    .ys-wish-detail {
        width: 100%;
        height: 100%;
    }
}
</style>
<style lang="scss" scoped>
.ys-wish-detail {
    width: 1000px;
    height: 600px;
    font-family: AlimamaDaoLiTi;
    user-select: none;

    :deep(*) {
        font-family: AlimamaDaoLiTi;
    }

    .loading {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        height: fit-content;
    }
}
</style>