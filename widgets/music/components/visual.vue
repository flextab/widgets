<template>
    <div class="visual-view" :style="{
        backgroundImage: `url(${pic})`
    }">
        <div class="body" ref="bodyEl">
            <div class="lyric no-scrollbar">
                <div v-for="l, i in player.lyric.getLyrics()" :class="{
                    active: i === focusIndex
                }">{{ l.text }}</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from "vue"
import { Collection, Player } from '../libs/music'

const player = ref(Player);
const music = computed(() => {
    return player.value.src ? Collection.list.find(item => item.normal === player.value.src) : null;
})
const pic = computed(() => {
    return music.value?.pic || 'https://res.ikrong.com/resource/aliyun_files/file-server/bc76f941-37cf-4939-99d1-df99e04f3da5.jpg'
})
const focusIndex = computed(() => {
    return player.value.lyric.select(player.value.currentTime)
})
const bodyEl = ref<HTMLDivElement>()

function scrollToCurrent() {
    if (bodyEl.value) {
        const el = bodyEl.value.querySelectorAll('.lyric>div')[focusIndex.value]
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }
}

player.value.on('timeupdate', scrollToCurrent);

onBeforeUnmount(() => {
    player.value.off('timeupdate', scrollToCurrent);
})
</script>
<style lang="scss" scoped>
.visual-view {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    position: relative;
    border-radius: 14px;
    overflow: hidden;

    .body {
        width: 100%;
        height: 100%;
        position: absolute;
        background-color: rgba(0, 0, 0, .2);
        z-index: 1;
        left: 0;
        top: 0;
        backdrop-filter: blur(10px);
        border-radius: 14px;
        overflow: hidden;
        padding-bottom: 120px;

        .lyric {
            padding-top: 50px;
            height: 100%;
            overflow: hidden;
            overflow-y: auto;

            >div {
                text-align: center;
                line-height: 2;
                max-width: 50%;
                word-break: break-all;
                margin: 0 auto;
                color: #fff;
                opacity: .2;
                text-shadow: 0 0 2px #000;
                font-size: 12px;

                &.active {
                    font-size: 16px;
                    opacity: 1;
                }
            }
        }
    }
}
</style>