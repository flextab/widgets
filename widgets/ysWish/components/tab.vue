<template>
    <div class="tab-card" :class="{ active: selected }" @mouseenter="SoundPlayer.playSound('changeBanner')"
        @click="SoundPlayer.playSound('click')">
        <div class="wrap">
            <div class="icon star" v-html="getSVG(Star)"></div>
            <div class="icon companion" v-html="getSVG(Companion)"></div>
        </div>
        <div class="tip" v-if="label">{{ label }}</div>
    </div>
</template>
<script lang="ts" setup>
import { } from "vue"
import Companion from '../assets/icons/companion.svg'
import Star from '../assets/icons/primo-star.svg'
import { SoundPlayer } from '../libs/sound'

const props = defineProps<{
    selected: boolean
    label?: string
}>()

function getSVG(content: string) {
    return decodeURIComponent(content.split(',')[1])
}
</script>
<style lang="scss" scoped>
.tab-card {
    width: 100px;
    height: 40px;
    background-color: #4f6d95;
    color: #6d8fbb;
    padding: 4px;
    border-radius: 4px;
    position: relative;
    user-select: none;

    &.active,
    &:hover {
        background-color: #f7f3d8;
        color: #eee2c8;
        transform: scale(1.1);
        transition: all ease-in .2s;

        .tip {
            color: #6d8fbb;
            text-shadow: 0 0 2px #eee2c8;
        }
    }

    .wrap {
        display: flex;
        width: 100%;
        height: 100%;
        border: 2px solid currentColor;
        border-radius: 4px;
        align-items: center;
        justify-content: space-between;
        padding-left: 10px;

        .icon {
            &.star {
                width: 20px;
                height: 20px;
            }

            &.companion {
                width: 50px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: -2px;
            }
        }
    }

    .tip {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        color: #eee2c8;
        text-shadow: 0 0 2px #6d8fbb;
        font-weight: bold;
        font-size: 26px;
        line-height: 40px;
        white-space: nowrap;
        display: flex;
        align-items: center;
        justify-content: center;
    }

}
</style>