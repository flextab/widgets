<template>
    <el-container class="music-widget-view">
        <el-header>
            <div class="tabs">
                <label class="tab" v-for="t in tabs" :key="t.value" @click="tab = t.value">
                    <input type="radio" hidden :checked="t.value === tab">
                    <span>{{ t.label }}</span>
                </label>
            </div>
        </el-header>
        <el-main class="no-scrollbar" :class="tab">
            <MusicCard @play="play" v-if="tab === 'library'" :index="musicIndex" />
            <MusicVisual v-if="tab === 'player'" />
            <MusicPlayer @next="next()" @pre="pre()" :show-lyric="tab !== 'player'" />
        </el-main>
    </el-container>
</template>
<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { Collection, MusicInfo, PlayMode, Player } from './libs/music'
import MusicCard from './components/card.vue'
import MusicPlayer from './components/player.vue'
import MusicVisual from './components/visual.vue'
import { enableFullscreen } from 'widget'

enableFullscreen();
const player = ref(Player)
const musicIndex = computed(() => {
    return Collection.list.findIndex(item => item.normal === player.value.src)
})
const tabs = ref([
    { label: '音乐库', value: 'library' },
    { label: '播放器', value: 'player' },
])
const tab = ref('library')
let lrcFetchCtrl: AbortController

function play(m: MusicInfo) {
    player.value.play(m.normal)
    lrcFetchCtrl?.abort()
    if (m.lrcText) {
        player.value.setLyric(m.lrcText);
    } else if (m.lrc) {
        lrcFetchCtrl = new AbortController()
        window.corsFetch(m.lrc, {
            signal: lrcFetchCtrl.signal
        }).then(a => a.text()).then(a => {
            if (m.normal === player.value.src) {
                player.value.setLyric(a)
            }
        })
    } else if (m.lrcText) {
        player.value.setLyric(m.lrcText);
    }
}

function next(trigger?: string) {
    let music = Collection.list[musicIndex.value + 1]
    if (!music) {
        music = Collection.list[0]
    }
    if (trigger === 'programatic') {
        if (player.value.mode === PlayMode.Random) {
            music = Collection.list[Math.floor(Math.random() * Collection.list.length)];
        } else if (player.value.mode === PlayMode.Single) {
            music = Collection.list[musicIndex.value];
        }
    }
    if (music) {
        play(music)
    }
}

function pre(trigger?: string) {
    let music = Collection.list[musicIndex.value - 1]
    if (!music) {
        music = Collection.list[Collection.list.length - 1]
    }
    if (music) {
        play(music)
    }
}

Collection.getList();
player.value.on('pre', pre)
player.value.on('next', next)

onBeforeUnmount(() => {
    player.value.pause()
    player.value.off('pre', pre)
    player.value.off('next', next)
})
</script>
<style lang="scss">
:host([fullscreen]) {
    .music-widget-view {
        width: 100%;
        height: 100%;
    }
}
</style>
<style lang="scss" scoped>
.music-widget-view {
    width: 800px;
    height: 500px;
    user-select: none;

    .el-header,
    .el-main {
        padding: 0;
    }

    .el-main {
        padding: 0 10px;
        padding-bottom: 10px;

        // &.library {
        //     padding-bottom: 140px;
        // }

    }

    .tabs {
        display: flex;
        width: fit-content;
        margin: 10px auto;
        position: relative;
        align-items: center;
        background-color: #efeff0;
        border-radius: 6px;
        font-size: 12px;
        color: #323136;

        >.tab {
            cursor: pointer;
            padding: 4px 20px;
            width: 80px;
            z-index: 2;
            position: relative;
            line-height: 1.5;
            border-radius: 6px;
            overflow: hidden;

            &:hover:not(:has(input:checked)) {
                background-color: #e6e6e6;
            }
        }

        &::before {
            content: '';
            display: block;
            position: absolute;
            background-color: #fff;
            top: 2px;
            left: 2px;
            height: 1.5*12+8-5px;
            width: 76px;
            z-index: 0;
            border-radius: 6px;
            transition: all .15s ease-in-out;
            border: .5px solid rgba(0, 0, 0, 0.04);
            box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.12), 0 0 1px 0 rgba(0, 0, 0, 0.04);
        }

        &:has(:nth-child(2)>input:checked)::before {
            left: 80px;
        }
    }
}
</style>