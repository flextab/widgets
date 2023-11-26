<template>
    <div class="hotlist-widget">
        <div class="title">
            <span class="website" v-for="item in hotData" :class="{ active: item.key === currentTab }"
                @mouseover="select(item.key)">
                {{ HotApi[item.key].title }}
            </span>
        </div>
        <div class="list" v-if="currentTab" ref="hotListRef">
            <div class="item" v-for="item, i in currentList">
                <div class="index">{{ i + 1 }}</div>
                <div class="name">
                    <span @click="open(item)">{{ item.title }}</span>
                </div>
                <div class="score">{{ formatNumber(item.score) }}</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, onBeforeUnmount, computed } from "vue"
import { HotApi, getConfig, formatNumber } from "./libs/index";
import { HotInfo } from "./libs/base";

const hotData = ref<{
    key: keyof typeof HotApi
    list: HotInfo[]
}[]>([])
const currentTab = ref<keyof typeof HotApi>()
const currentList = computed(() => {
    return hotData.value.find(item => item.key === currentTab.value)?.list || []
})
const hotListRef = ref<HTMLDivElement>()

async function init() {
    const list = getConfig()
    currentTab.value = list[0] as keyof typeof HotApi;
    hotData.value = await Promise.all(list.map(async (key: string) => {
        const k = key as keyof typeof HotApi
        let list: HotInfo[] = []
        try {
            list = await HotApi[k].get()
        } catch (error) {

        }
        return {
            key: k,
            list
        }
    }))
}

function open(info: HotInfo) {
    window.open(info.link, '_blank')
}

function select(key: string) {
    currentTab.value = key as keyof typeof HotApi
    if (hotListRef.value) {
        hotListRef.value.scrollTop = 0
    }
}

init()

const interval = setInterval(() => {
    init()
}, 5 * 60 * 1000)

onBeforeUnmount(() => {
    clearInterval(interval)
})
</script>
<style lang="scss" scoped>
.hotlist-widget {
    background-color: #fff;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    font-size: 14px;

    >.title {
        flex: 0 0 30px;
        background-image: linear-gradient(135deg, rgb(253, 216, 25) 10%, rgb(232, 5, 5) 100%);
        color: #fff;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 10px;

        >.website {
            font-size: 13px;
            position: relative;
            text-shadow: 0 0 10px rgba(0, 0, 0, .2);
            height: 100%;
            display: flex;
            align-items: center;
            cursor: pointer;

            &.active {
                &::after {
                    display: block;
                    width: 100%;
                    background-color: #ff0000;
                    height: 2px;
                    bottom: 0;
                    left: 0;
                    content: "";
                    position: absolute;
                }
            }
        }
    }

    >.list {
        flex: auto;
        overflow: auto;
        display: flex;
        gap: 4px;
        flex-direction: column;
        padding: 6px 0;

        >.item {
            display: flex;
            padding: 0 10px;
            color: var(--el-text-color-regular);
            align-items: center;

            &:nth-child(1) {
                >.index {
                    color: #e94646;
                    font-weight: bold;
                    font-size: 16px;
                }
            }

            &:nth-child(2) {
                >.index {
                    color: #f9741d;
                    font-weight: bold;
                    font-size: 16px;
                }
            }

            &:nth-child(3) {
                >.index {
                    color: #f8b30a;
                    font-weight: bold;
                    font-size: 16px;
                }
            }

            >.index {
                flex: 0 0 20px;
            }

            >.name {
                flex: auto;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;

                >span {
                    cursor: pointer;

                    &:hover {
                        color: #eb7350;
                    }
                }
            }

            >.score {
                flex: 0 0 60px;
                font-size: 12px;
                text-align: right;
                color: var(--el-text-color-secondary);
            }
        }
    }
}
</style>