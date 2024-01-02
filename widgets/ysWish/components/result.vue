<template>
    <div class="result-page">
        <div class="close" v-if="showContent" @click="close" @mouseenter="SoundPlayer.playSound('beep')">
            <ft-icon name="Close" size="16"></ft-icon>
        </div>
        <video class="video" :src="videoSrc" autoplay @timeupdate="onTimeUpdate" ref="videoEl" :muted="muted"></video>

        <div class="content-box" v-if="showContent">
            <SingleResult :content="currentReuslt" @close="nextResult" :key="`${showResultIndex}_${currentReuslt}`"
                v-if="!showAll" />
            <AllResult :items="resultList" v-if="showAll" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from "vue"
import Video from './../assets/video.mp4'
import { SoundPlayer } from '../libs/sound'
import SingleResult from './singleResult.vue'
import AllResult from './allResult.vue'
import BG from './../assets/result-bg.png'

const props = defineProps<{
    items: string | string[]
}>()
const emit = defineEmits<{
    (name: 'close'): void
}>()
const videoSrc = ref(URL.createObjectURL(new Blob([Video], { type: 'video/mp4' })))
const showContent = ref(false)
const videoEl = ref<HTMLVideoElement>()
const resultList = computed(() => {
    if (!props.items) return []
    return typeof props.items === 'string' ? [props.items] : props.items
})
const showResultIndex = ref(0)
const currentReuslt = computed(() => {
    return resultList.value[showResultIndex.value]
})
const showAll = ref(false)
const muted = ref(SoundPlayer.isMuted)

function nextResult() {
    if (showResultIndex.value + 1 < resultList.value.length) {
        showResultIndex.value += 1
    } else {
        showAll.value = true
    }
}

function close() {
    emit('close')
    SoundPlayer.playBg()
}

function onTimeUpdate(e: any) {
    if (videoEl.value!.currentTime > 5.8) {
        showContent.value = true
    }
}

SoundPlayer.pause()

onBeforeUnmount(() => {
    URL.revokeObjectURL(videoSrc.value)
})
</script>
<style lang="scss" scoped>
.result-page {
    .video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        pointer-events: none;
    }

    >.close {
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 2;
        border-radius: 50%;
        background-color: #bebebe;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 4px solid #87bad7;

        &:hover {
            background-color: #8f8f8f;
            border-color: #fff;

            &:active {
                background-color: #707070;
                border-color: #ccc;
            }
        }
    }

    .content-box {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background-image: v-bind('`url(${BG})`');
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        animation: fade-in forwards .1s 1;
        opacity: 0;
        z-index: 1;
    }

}


@keyframes fade-in {
    to {
        opacity: 1
    }
}
</style>