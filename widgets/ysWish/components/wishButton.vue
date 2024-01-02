<template>
    <ft-space class="wish-button" vertical align="center" justify="center" @mouseenter="SoundPlayer.playSound('beep')">
        <div>
            <span>许愿</span>
            <span>x{{ count || 1 }}</span>
            <span>次</span>
        </div>
        <div>
            <img :src="WishButtonIcon" />
            <span>x{{ count || 1 }}</span>
        </div>
    </ft-space>
</template>
<script lang="ts" setup>
import { } from "vue"
import WishButtonBg from '../assets/wish-button.png'
import WishButtonIcon from '../assets/wish-bt-icon.png'
import { SoundPlayer } from '../libs/sound'

const props = defineProps<{
    count?: number
}>()
</script>
<style lang="scss" scoped>
.wish-button {
    background-image: v-bind('`url(${WishButtonBg})`');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    width: 170px;
    height: 40px;
    line-height: 12px;
    user-select: none;

    &:hover {
        filter: brightness(0.9);

        &:active {
            filter: brightness(0.8);
        }
    }

    img {
        width: 16px;
        height: 16px;
        vertical-align: middle;
        margin-right: 6px;
    }
}
</style>