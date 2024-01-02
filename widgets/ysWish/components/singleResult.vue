<template>
    <div class="content-box" @click="emit('close')">
        <wave></wave>
        <div class="view">
            <ft-space class="gift" :gap="10">
                <span class="icon" v-html="gift"></span>
                <ft-space vertical>
                    <div class="title">恭喜</div>
                    <div class="stars">
                        <ft-icon class="star" name="StarFilled" color="#f7cf33" v-for="i in 5" size="30"></ft-icon>
                    </div>
                </ft-space>
            </ft-space>
            <img class="plate" :src="Plate">
            <div class="result-content" :style="{ fontSize: calcFontSize() }">
                {{ content }}
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref } from "vue"
import Wave from './wave.vue'
import Plate from '../assets/plate.png'
import GiftSvg from '../assets/icons/gift.svg'
import { SoundPlayer } from "../libs/sound"

const props = defineProps<{
    content: string
}>()
const emit = defineEmits<{
    (e: 'close'): void
}>()
const gift = ref(decodeURIComponent(GiftSvg.split(',')[1]))

function calcFontSize() {
    return Math.min(Math.max(+Number(500 / (props.content?.length || 2)).toFixed(0), 16), 120) + 'px'
}

SoundPlayer.playSound('fiveStar')
</script>
<style lang="scss">
:host([fullscreen]) {
    .content-box {
        .view {
            width: 80%;
            height: 80%;

            .plate {
                width: 800px;
                height: 800px;
            }
        }
    }
}
</style>
<style lang="scss" scoped>
.content-box {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;

    .view {
        position: absolute;
        width: 800px;
        height: 400px;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        display: flex;
        justify-content: center;
        align-items: center;

        .gift {
            position: absolute;
            left: 0;
            bottom: 0;
            color: #979797;

            >.icon {
                width: 40px;
                height: 40px;
                transform: translateX(-2000px);
                animation: slip-to-right forwards .4s 1;
                animation-delay: 1.5s;
            }

            .title {
                font-size: 30px;
                transform: translateX(2000px);
                animation: slip-to-left forwards .4s 1;
                animation-delay: 1.5s;
            }

            .star {
                opacity: 0;
                transform: scale(5);
                animation: zoom-in forwards .4s 1;
                animation-delay: 2s;

                &:nth-child(2) {
                    animation-delay: 2.2s;
                }

                &:nth-child(3) {
                    animation-delay: 2.4s;
                }

                &:nth-child(4) {
                    animation-delay: 2.6s;
                }

                &:nth-child(5) {
                    animation-delay: 2.8s;
                }
            }
        }

        .plate {
            width: 360px;
            height: 360px;
            pointer-events: none;
            opacity: 0;
            transform: scale(0);
            animation: popout forwards .4s 1;
            animation-delay: 1.2s;
        }

        .result-content {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            width: 1px;
            height: 1px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 70px;
            text-shadow: 0 -1px 1px #fff;
            color: #000;
            transform: scale(0);
            animation: popout forwards .4s 1;
            animation-delay: 1.5s;
            word-break: break-all;
            line-height: 1;
        }
    }
}

@keyframes slip-to-right {
    from {
        transform: translateX(-2000px);
    }

    to {
        transform: translateX(0);
    }
}

@keyframes slip-to-left {
    from {
        transform: translateX(2000px);
    }

    to {
        transform: translateX(0);
    }
}

@keyframes zoom-in {
    to {
        transform: scale(1);
        opacity: 1
    }
}

@keyframes popout {
    to {
        transform: scale(1);
        opacity: 1
    }
}
</style>