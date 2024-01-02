<template>
    <div class="number-box" @mouseenter="SoundPlayer.playSound('beep')">
        <img :src="img">
        <span>{{ value }}</span>
        <ft-icon name="Plus" class="add" v-if="showAdd"></ft-icon>
    </div>
</template>
<script lang="ts" setup>
import { computed } from "vue"
import StoneIcon from './../assets/stone.png'
import WishCount from './../assets/wish-count.png'
import { SoundPlayer } from '../libs/sound'

const props = defineProps<{
    value: number
    type?: 'stone' | 'wish'
    showAdd?: boolean
}>()

const img = computed(() => {
    return props.type === 'wish' ? WishCount : StoneIcon;
})
</script>
<style lang="scss" scoped>
.number-box {
    min-width: 60px;
    width: fit-content;
    padding: 2px 6px;
    background-color: rgba(0, 0, 0, .5);
    border: 1px solid #303030;
    border-radius: 50px;
    display: flex;
    align-items: center;
    gap: 4px;
    user-select: none;

    img {
        width: 20px;
        height: 20px;
    }

    span {
        color: #fff;
        margin-right: 4px;
    }

    .add {
        background-color: #eee2c8;
        width: 1em;
        height: 1em;
        border-radius: 50%;
        color: rgba(0, 0, 0, 0.5);
    }
}
</style>