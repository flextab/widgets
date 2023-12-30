<template>
    <div class="player">
        <ft-space class="player-ctr">
            <div class="logo" :title="[music?.name, music?.author].filter(Boolean).join(' - ')">
                <ft-icon class="loading" name="Loading" :size="20" v-if="player.loading"></ft-icon>
                <img :src="pic" />
            </div>
            <ft-space vertical class="main-ctrl">
                <ft-space :gap="20" justify="center" fill class="play-ctrl">
                    <span class="ctrl-icon mode-icon random" v-html="getIcon('shuffle')"
                        v-if="player.mode === PlayMode.Random" @click="player.switchMode()" title="随机播放"></span>
                    <span class="ctrl-icon mode-icon" v-html="getIcon('list')" v-if="player.mode === PlayMode.List"
                        @click="player.switchMode()" title="顺序播放"></span>
                    <span class="ctrl-icon mode-icon repeat" v-html="getIcon('repeat')"
                        v-if="player.mode === PlayMode.Single" @click="player.switchMode()" title="单曲循环"></span>
                    <span class="ctrl-icon pre-icon" v-html="getIcon('skip-back')" @click="pre()"></span>
                    <span class="ctrl-icon play-icon" v-html="getIcon('play')" v-if="player.paused"
                        @click="player.play()"></span>
                    <span class="ctrl-icon play-icon" v-html="getIcon('pause')" v-else @click="player.pause()"></span>
                    <span class="ctrl-icon next-icon" v-html="getIcon('skip-forward')" @click="next()"></span>
                </ft-space>
                <ft-space :gap="10" class="time-ctrl">
                    <div class="current">{{ formatDuration(player.currentTime || 0) }}</div>
                    <el-slider class="time-slider" placement="bottom" :show-tooltip="false"
                        :model-value="currentTimePercent" @update:model-value="seek" />
                    <div class="total">{{ player.duration ? formatDuration(player.duration) : '--:--' }}</div>
                    <div class="lyric" v-if="currentLyric && showLyric !== false">{{ currentLyric }}</div>
                </ft-space>
            </ft-space>
            <ft-space class="volume-ctrl" :gap="10">
                <span class="ctrl-icon volume-icon" v-html="getIcon('volume-x')" v-if="volumePercent === 0"
                    @click="setVolume(30)"></span>
                <span class="ctrl-icon volume-icon" v-html="getIcon('volume-1')" v-else-if="volumePercent < 30"
                    @click="setVolume(0)"></span>
                <span class="ctrl-icon volume-icon" v-html="getIcon('volume-2')" v-else @click="setVolume(0)"></span>
                <el-slider class="volume-slider" placement="bottom" :show-tooltip="false" :model-value="volumePercent"
                    @update:model-value="setVolume" />
            </ft-space>
        </ft-space>
    </div>
</template>
<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { Collection, PlayMode, Player } from '../libs/music'
import MusicCtrlSVGs from '../assets/music/*.svg?minimatch'

const props = defineProps<{
    showLyric: boolean
}>()
const emit = defineEmits<{
    (name: 'next'): void;
    (name: 'pre'): void;
}>()
const player = ref(Player);
const music = computed(() => {
    return player.value.src ? Collection.list.find(item => item.normal === player.value.src) : null;
})
const pic = computed(() => {
    return music.value?.pic || 'https://res.ikrong.com/resource/aliyun_files/file-server/bc76f941-37cf-4939-99d1-df99e04f3da5.jpg'
})
const currentTimePercent = computed(() => {
    if (player.value.duration) {
        return Math.round(player.value.currentTime * 100 / player.value.duration)
    } else {
        return 0;
    }
})
const volumePercent = computed(() => {
    return Math.round(player.value.volume * 100)
})
const currentLyric = computed(() => {
    if (player.value.currentTime) {
        const index = player.value.lyric.select(player.value.currentTime)
        if (index >= 0) {
            return player.value.lyric.getLyric(index)?.text || ''
        } else {
            return ''
        }
    } else {
        return ''
    }
})

function seek(v: number) {
    player.value.seek(v / 100 * player.value.duration);
}

function setVolume(v: number) {
    player.value.setVolume(v / 100)
}

function getIcon(name: string) {
    return decodeURIComponent((MusicCtrlSVGs[`${name}.svg`] || '').split(',')[1])
}

function formatDuration(number: number) {
    return `${String(Math.floor((number) / 60)).padStart(2, '0')}:${String(Math.floor((number) % 60)).padStart(2, '0')}`
}

function next() {
    emit('next')
}

function pre() {
    emit('pre')
}

player.value.init()
</script>
<style lang="scss" scoped>
.player {
    width: 100%;
    position: absolute;
    padding: 0 20px 20px 20px;
    left: 0;
    bottom: 0;
    z-index: 5;

    .player-ctr {
        height: 100px;
        border-radius: 14px;
        backdrop-filter: blur(20px);
        padding: 20px;
        box-shadow: 0 0 20px rgba(0, 0, 0, .6);
        color: rgba(255, 255, 255, .8);
        user-select: none;
        background-color: rgba(0, 0, 0, .2);

        .logo {
            flex: 0 0 60px;
            position: relative;
            border-radius: 14px;
            overflow: hidden;
            height: 60px;

            >img {
                width: 60px;
                height: 60px;
                object-fit: cover;
            }

            .loading {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: rgba(0, 0, 0, .4);

                :deep(svg) {
                    color: rgba(255, 255, 255, .8);
                    animation: spinner 1500ms infinite linear;
                }
            }
        }

        .main-ctrl {
            flex: auto;
            padding: 0 20px;

            .current,
            .total {
                white-space: nowrap;
                font-size: 12px;
                flex: 0 0 30px;
            }
        }

        .volume-ctrl {
            flex: 0 0 120px;
        }

        .play-ctrl {
            &:first-child {
                margin-left: -20px;
            }
        }

        .time-ctrl {
            position: relative;

            .lyric {
                position: absolute;
                left: 0;
                right: 0;
                bottom: -10px;
                font-size: 12px;
                width: 100%;
                color: #d6d6d6;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                padding: 0 30px;
            }
        }

        .ctrl-icon {
            cursor: pointer;

            &:hover {
                color: #fff;

                &:active {
                    color: #d6d6d6;
                }
            }

            &.mode-icon {

                &.random,
                &.repeat {
                    :deep(svg) {
                        width: 24px;
                        height: 20px;
                    }
                }
            }
        }
    }

}

.el-slider {
    --el-slider-main-bg-color: rgba(255, 255, 255, .8);
    --el-slider-runway-bg-color: rgba(255, 255, 255, .4);
    --el-slider-border-radius: 3px;
    --el-slider-height: 4px;

    :deep(.el-slider__button-wrapper) {
        display: none;
    }

    &.time-slider :deep(.el-slider__bar) {
        background-color: none;
        background-image: linear-gradient(90deg, #017bff, #03b0ff);
    }
}

@keyframes spinner {
    0% {
        -webkit-transform: rotate(0deg);
        -moz-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        -o-transform: rotate(0deg);
        transform: rotate(0deg);
    }

    100% {
        -webkit-transform: rotate(360deg);
        -moz-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        -o-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}
</style>