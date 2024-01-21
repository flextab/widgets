<template>
    <ft-virtual-scroll class="card-view no-scrollbar" :items="list" item-key="id" :getColumnsCount="getColumnsCount"
        v-if="list.length" ref="scrollView">
        <template #="m">
            <div class="music-card" @click="emit('play', m)"
                :class="{ active: Collection.list[index]?.normal === m.normal }">
                <img :src="m.pic || 'https://res.ikrong.com/resource/aliyun_files/file-server/bc76f941-37cf-4939-99d1-df99e04f3da5.jpg'"
                    loading="lazy" />
                <div class="music-info">
                    <div class="title">{{ m.name }}</div>
                    <div class="author">{{ m.author }}</div>
                </div>
            </div>
        </template>
    </ft-virtual-scroll>
    <div class="focus" @click="findCurrentMusic()" v-if="index != -1" title="定位当前播放音乐">
        <div class="icon" v-html="focusSVG"></div>
    </div>
</template>
<script lang="ts" setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { Collection, MusicInfo, Player } from './../libs/music'
import FocusIcon from '../assets/music/focus.svg'

const props = defineProps<{
    index: number
}>()
const emit = defineEmits<{
    (name: 'play', value: MusicInfo): void;
}>()
const player = ref(Player)
const list = ref(Collection.list);
const scrollView = ref()
const viewSize = ref({
    width: 0,
    column: 1,
})
const currentMusicPosition = computed(() => {
    if (props.index === -1) return 0;
    const line = Math.ceil((props.index) / viewSize.value.column)
    return Math.max((line - 1) * (140 + 12), 0);
})
const focusSVG = ref(decodeURIComponent(FocusIcon.split(',')[1]))

function getColumnsCount(width: number) {
    let column = Math.floor(width / 140);
    while (column * 140 + (column - 1) * 12 > width) {
        column--
    }
    viewSize.value.width = width
    viewSize.value.column = column
    return viewSize.value.column;
}

function findCurrentMusic() {
    scrollView.value?.scrollTo(currentMusicPosition.value)
}

onMounted(() => {
    nextTick(() => {
        scrollView.value?.forceUpdate()
    })
})
</script>
<style lang="scss" scoped>
.card-view {
    width: 100%;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    user-select: none;

    :deep(.ft-virtual-scroll-content) {
        display: grid;
        grid-template-columns: repeat(v-bind('viewSize.column'), 140px);
        width: 100%;
        justify-content: space-between;
        gap: 12px;

        &::after {
            content: '';
            display: block;
            width: 100%;
            height: 140px;
            grid-column: 1 / v-bind('viewSize.column + 1');
        }
    }

    .music-card {
        flex: 0 0 140px;
        height: 140px;
        border-radius: 10px;
        overflow: hidden;
        position: relative;
        transition: all ease-out .2s;
        cursor: pointer;

        &::before {
            content: '';
            width: .5em;
            height: .5em;
            border-radius: 50%;
            background-color: var(--el-color-success);
            position: absolute;
            top: .5em;
            right: .5em;
            box-shadow: 0 0 5px 2px rgba(0, 0, 0, .6), 0 0 10px 6px rgba(255, 255, 255, 0.2);
            display: none;
        }

        &.active::before {
            display: block;
        }

        &:hover {
            box-shadow: 0 0 10px rgba(0, 0, 0, .6);
        }

        &.empty {
            visibility: hidden;
        }

        >img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .music-info {
            position: absolute;
            left: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, .2);
            backdrop-filter: blur(20px);
            width: 100%;
            color: #eaeaea;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            padding: 4px 10px;

            .title {
                font-size: 14px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                height: 24px;
                line-height: 24px;
            }

            .author {
                font-size: 12px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                height: 20px;
                line-height: 20px;
            }
        }
    }
}

.focus {
    position: absolute;
    right: 14px;
    bottom: 130px;
    width: 30px;
    height: 30px;
    color: var(--el-color-success);
    background-color: rgba(208, 255, 202, .4);
    backdrop-filter: blur(4px);
    border-radius: 50%;
    cursor: pointer;

    &:hover {
        background-color: rgba(208, 255, 202, .8);
    }

    &:active {
        backdrop-filter: blur(50px);
    }

    .icon {
        position: relative;
        width: 100%;
        height: 100%;

        &::before {
            content: '';
            display: block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: var(--el-color-success);
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
        }
    }
}
</style>