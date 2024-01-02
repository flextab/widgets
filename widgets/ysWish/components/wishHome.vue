<template>
    <div class="wish-home">
        <div class="audio-muted" :class="{ muted: muted }" v-html="getSVGIcon('muted')" @click="setMuted"></div>
        <ft-space justify="center" :gap="40" class="tabs">
            <tab v-for="label, i in tabs" :key="i" :label="label" :selected="tabIndex === i"
                @click="tabIndex = i; getRecordList(); getWishConfig()"></tab>
        </ft-space>
        <ft-space :gap="20" class="stone">
            <number :value="6666" show-add></number>
            <number :value="9999" type="wish"></number>
        </ft-space>
        <ft-space :gap="20" class="wish">
            <wish-button @click="wish(1)"></wish-button>
            <wish-button @click="wish(wishConfig?.wishCount || 10)" :count="wishConfig?.wishCount || 10"></wish-button>
        </ft-space>

        <div class="center-box" :class="{ turn: showSetting }">
            <div class="center-box-wrap" @transitionend="checkCenterBoxAnimation" ref="centerBoxWrapEl">
                <div class="setting-box">
                    <template v-if="showSettingContent">
                        <ft-space class="title" justify="space-between">
                            <ft-space>
                                <ft-icon class="back" name="ArrowLeftBold"
                                    @click="showSetting = false; SoundPlayer.playSound('bookflip')"
                                    @mouseenter="SoundPlayer.playSound('beep')"></ft-icon>
                                <div>设置</div>
                            </ft-space>
                            <ft-space :gap="20" v-if="settingTabIndex === 0">
                                <el-input type="text" placeholder="搜索" class="search" clearable size="small"
                                    v-model="searchKey"></el-input>
                                <ft-space class="import-record btn" :gap="10" title="导入" @click="importRecords()"
                                    @mouseenter="SoundPlayer.playSound('beep')">
                                    <ft-icon name="Upload" size="18"></ft-icon>
                                    <span>导入</span>
                                </ft-space>
                                <ft-space class="add-record btn" :gap="10" title="添加" @click="addRecord"
                                    @mouseenter="SoundPlayer.playSound('beep')">
                                    <ft-icon name="Plus" size="18"></ft-icon>
                                    <span>添加</span>
                                </ft-space>
                            </ft-space>
                        </ft-space>
                        <el-container class="body">
                            <el-header>
                                <div class="setting-tabs">
                                    <div class="setting-tab" :class="{ active: settingTabIndex === i }"
                                        v-for="label, i of settingTabs"
                                        @click="settingTabIndex = i; SoundPlayer.playSound('click')"
                                        @mouseenter="SoundPlayer.playSound('beep')">
                                        {{ label }}
                                    </div>
                                </div>
                            </el-header>
                            <el-main>
                                <template v-if="settingTabIndex === 0">
                                    <ft-virtual-scroll class="setting-content" :items="filterList" item-key="id"
                                        ref="virtualScrollEl" v-if="filterList.length">
                                        <template #="item">
                                            <ft-space class="record" justify="space-between" :gap="40">
                                                <div class="record-content" @dblclick="editRecord(item.id)" title="双击编辑">
                                                    <template v-if="item.id === editRecordId">
                                                        <el-input class="edit-record-content" v-model="item.label"
                                                            @blur="editRecordId = ''" @change="saveRecords"></el-input>
                                                    </template>
                                                    <template v-else>
                                                        <div>{{ item.label }}</div>
                                                    </template>
                                                </div>
                                                <div class="record-remove" @click="removeRecord(item.id)">
                                                    <ft-icon name="CircleCloseFilled" size="18"></ft-icon>
                                                </div>
                                            </ft-space>
                                        </template>
                                    </ft-virtual-scroll>
                                    <div class="setting-content" v-else>
                                        <div class="empty">
                                            <div>没有找到相关记录</div>
                                        </div>
                                    </div>
                                </template>
                                <template v-else>
                                    <WishSetting :kind="tabs[tabIndex]" @update="getWishConfig()" :key="tabs[tabIndex]" />
                                </template>
                            </el-main>
                        </el-container>
                    </template>
                </div>

                <div class="info-box">
                    <div class="tag">{{ tabs[tabIndex] }}</div>
                    <img :src="roleUserInfo.image" class="role-user" />
                    <div class="role-skill" :style="{ color: roleUserInfo.color }">{{ roleUserInfo.skill }}</div>
                    <ft-space class="role-name">
                        <span class="role-type" :style="{ color: roleUserInfo.color }"
                            v-html="getSVGIcon(roleUserInfo.icon)"></span>
                        <ft-space vertical>
                            <span class="role-name-text">{{ roleUserInfo.name }}</span>
                            <span class="role-star">
                                <ft-icon name="StarFilled" color="#f9cb2b" v-for="i in 5" :key="i" :size="22"></ft-icon>
                            </span>
                            <span class="role-nickname">{{ roleUserInfo.nickname }}</span>
                        </ft-space>
                    </ft-space>
                    <div class="content">
                        <p>{{ slogans[tabIndex] }}</p>
                    </div>
                    <!--  -->
                    <div class="setting" v-html="getSVGIcon('setting')"
                        @click="showSetting = true; showSettingContent = true; SoundPlayer.playSound('bookflip'); forceVirtualScrollUpdate();"
                        @mouseenter="SoundPlayer.playSound('beep')">
                    </div>
                </div>
            </div>
        </div>

        <Result class="result-page" v-if="result.visible" @close="result.visible = false" :items="result.list" />
    </div>
</template>
<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, ref } from "vue"
import CloudBG from './../assets/bg.jpeg'
import { SoundPlayer } from './../libs/sound'
import Cursor from './../assets/cursor.png'
import Tab from './tab.vue'
import Number from './number.vue'
import WishButton from './wishButton.vue'
import InfoBg from '../assets/info-bg.png'
import Icons from '../assets/icons/*.svg?minimatch'
import Result from '../components/result.vue'
import Storage from 'storage'
import { ElMessage } from "element-plus"
import { FileStore } from '../libs/files'
import WishSetting from '../components/wishSetting.vue'

interface WishRecordItem {
    id: string
    label: string
}

const KaedeharaKazuha = FileStore.getFile('assets/kaedehara-kazuha.png')
const HuTao = FileStore.getFile('assets/hu-tao.png')
const tabs = ref(['选择困难症', '点名', '今天吃什么'])
const slogans = ref([
    "在选择的十字路口，我们是你的指路明灯，让选择困难症变得轻松而有趣！",
    "人生如同点名，机会随机而来，珍惜每个被点到的时刻，成为生活的焦点！",
    "生活如同一顿大餐，抽号决定你今天的菜单，让每一餐都是一场充满惊喜的冒险！"
])
const tabIndex = ref(0)
const virtualScrollEl = ref()
const roleUserInfo = ref([
    {
        image: KaedeharaKazuha,
        name: '枫原万叶',
        nickname: '红叶逐荒波',
        skill: '叶落风随',
        color: '#359697',
        icon: 'anemo',
    },
    {
        image: HuTao,
        name: '胡桃',
        nickname: '雪霁梅香',
        skill: '赤团开时',
        color: '#ee6c4c',
        icon: 'pyro'
    }
][new Date().getDay() % 2])
const records = ref<WishRecordItem[]>([])
const editRecordId = ref('')
const showSetting = ref(false)
const showSettingContent = ref(false)
const result = ref({
    visible: false,
    list: [] as string[]
})
const centerBoxWrapEl = ref()
const muted = ref(false)
const searchKey = ref('')
const filterList = computed(() => {
    return records.value.filter(item => item.label.includes(searchKey.value))
})
const settingTabs = ref(['抽选列表', '其他'])
const settingTabIndex = ref(0)
const wishConfig = ref<{
    wishCount: number
}>()

function generateUUID() {
    return Math.random().toString(36).slice(2)
}

function forceVirtualScrollUpdate() {
    nextTick(() => {
        virtualScrollEl.value.forceUpdate()
    })
}

function stringToHashId(str: string) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
        hash = hash & hash
    }
    return (hash >>> 0).toString(36)
}

function getRecordList() {
    const data = Storage.get(stringToHashId(tabs.value[tabIndex.value])) as string
    if (data) {
        records.value = JSON.parse(data)
    } else if (tabIndex.value === 2) {
        records.value = '盖浇饭 砂锅 大排档 米线 西餐 麻辣烫 自助餐 炒面 快餐 水果 馄饨 火锅 烧烤 泡面 速冻水饺 日本料理 涮羊肉 味千拉面 肯德基 面包 扬州炒饭 自助餐 茶餐厅 海底捞 咖啡 比萨 麦当劳 兰州拉面 沙县小吃 烤鱼 海鲜 铁板烧 韩国料理 粥 快餐 萨莉亚 桂林米粉 东南亚菜 甜点 农家菜 川菜 粤菜 湘菜 本帮菜 竹笋烤肉'.split(' ').map(label => {
            return {
                id: generateUUID(),
                label
            }
        })
    } else {
        records.value = []
    }
}

function getWishConfig() {
    const id = stringToHashId(tabs.value[tabIndex.value])
    console.log(id, tabIndex.value)
    const data = Storage.get(`setting_${id}`) as string
    if (data) {
        wishConfig.value = JSON.parse(data)
    } else {
        wishConfig.value = {} as any;
    }
}

function saveRecords() {
    Storage.set(stringToHashId(tabs.value[tabIndex.value]), JSON.stringify(records.value))
}

function addRecord() {
    const id = generateUUID()
    records.value.unshift({
        id: id,
        label: '',
    })
    editRecord(id, true)
}

function editRecord(id: string, scroll = false) {
    nextTick(() => {
        if (scroll) {
            virtualScrollEl.value.scrollTo(0)
        }
        editRecordId.value = id
        nextTick(() => {
            const el = virtualScrollEl.value.contentEl as HTMLElement
            el.querySelector('input')?.focus()
        })
    })
}

function removeRecord(id: string) {
    const index = records.value.findIndex(item => item.id === id)
    records.value.splice(index, 1)
}

function checkCenterBoxAnimation(e: any) {
    if (e.target !== centerBoxWrapEl) return;
    if (showSetting.value) {
        showSettingContent.value = true
        forceVirtualScrollUpdate()
    } else {
        showSettingContent.value = false;
    }
}

function wish(count: number) {
    // 从数组中随机抽取 count 个
    const arr = [...records.value]
    const resultList = []
    for (let i = 0; i < count; i++) {
        const index = Math.floor(Math.random() * arr.length)
        resultList.push(arr[index])
        arr.splice(index, 1)
    }
    const labels = resultList.filter(Boolean).map(item => item.label)
    if (!labels.length) {
        ElMessage.warning('请先添加或者导入抽选内容')
    } else {
        result.value.list = labels
        result.value.visible = true;
    }
}

function play() {
    if (document.visibilityState === 'visible') {
        SoundPlayer.playBg()
    }
}

function importRecords() {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.txt'
    fileInput.onchange = (e: any) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e: any) => {
                const text = e.target.result
                records.value = String(text).split(/[ \n]/g).map(label => {
                    return {
                        id: generateUUID(),
                        label
                    }
                })
                saveRecords()
            }
            reader.readAsText(file)
        }
    }
    fileInput.click()
}

function getSVGIcon(name: string) {
    return decodeURIComponent(Icons[`${name}.svg`].split(',')[1])
}

function setMuted() {
    SoundPlayer.muted(!SoundPlayer.isMuted);
    Storage.set('muted', SoundPlayer.isMuted)
    muted.value = SoundPlayer.isMuted
    SoundPlayer.playBg()
}

getRecordList()
if (Storage.get('muted')) {
    muted.value = true
    SoundPlayer.muted(true)
}
play()

onBeforeUnmount(() => {
})
</script>
<style lang="scss">
:host([fullscreen]) {
    .wish-home {
        .center-box {
            top: 0;
            bottom: 0;
            margin: auto;
            width: 70%;
            height: 0;
            padding-bottom: 34.6%;

            .info-box {
                .role-skill {
                    top: 30%;
                }

                .content {
                    top: 55%;
                    height: fit-content;

                    &::before {
                        height: 110%;
                    }
                }
            }
        }
    }
}
</style>
<style lang="scss" scoped>
.wish-home {
    width: 100%;
    height: 100%;
    background-image: v-bind('`url(${CloudBG})`');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    cursor: v-bind('`url(${Cursor})`'),
    auto;
    animation: fade-in forwards 1s 1;
    opacity: 0;

    .audio-muted {
        position: absolute;
        top: 20px;
        left: 90px;
        z-index: 2;
        width: 40px;
        height: 40px;
        color: #d0a467;
        border: 4px solid currentColor;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        &.muted {
            color: #39425d;

            &::after {
                width: 150%;
                height: 4px;
                background-color: #5c5c5c;
                content: '';
                position: absolute;
                top: 14px;
                left: -10px;
                transform: rotate(45deg);
            }

            &:hover {
                color: #2d3857;

                &:active {
                    color: #1e253b;
                }
            }
        }

        &:hover {
            color: #c59550;

            &:active {
                color: #ad7b34;
            }
        }

        :deep(svg) {
            width: 24px;
            height: 24px;
        }
    }

    .tabs {
        position: relative;
        padding: 20px 0;
        z-index: 1;
    }

    .stone {
        position: absolute;
        right: 20px;
        top: 30px;
        z-index: 1;
    }

    .wish {
        position: absolute;
        right: 20px;
        bottom: 20px;
        z-index: 1;
    }

    .center-box {
        width: 900px;
        height: 440px;
        margin: 0 auto;
        position: absolute;
        top: 80px;
        bottom: 100px;
        left: 0;
        right: 0;
        z-index: 0;
        perspective: 1000px;

        .center-box-wrap {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            transition: transform ease-in-out .5s;
            transform: rotateX(0);
            transform-style: preserve-3d;
        }

        &.turn {
            .center-box-wrap {
                transform: rotateX(180deg);
            }
        }
    }

    .setting-box {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 999;
        background-color: #eee8e3;
        transform: rotateX(180deg);
        backface-visibility: hidden;
        display: flex;
        flex-direction: column;

        .title {
            background-color: #14120fd9;
            flex: 0 0 40px;
            display: flex;
            align-items: center;
            padding: 0 20px;
            color: #e2d7b6;
            font-size: 20px;

            .back {
                width: 40px;
                margin-left: -16px;

                &:hover {
                    color: #deca8f;

                    &:active {
                        color: #b4a370;
                    }
                }
            }

            .search {
                border-radius: 50px;
                border: 4px solid #e2d7b6;
                color: #39425d;
                background-color: #fff;
                --el-input-bg-color: transparent;
                --el-input-focus-border-color: transparent;
                --el-input-hover-border: transparent;
                --el-input-focus-border: transparent;
                --el-input-hover-border-color: transparent;
                width: 160px;
            }

            .btn {
                background-color: #e2d7b6;
                color: #39425d;
                padding: 0 14px;
                border-radius: 50px;
                font-size: 14px;
                border: 4px solid #e2d7b6;
                white-space: nowrap;

                &:hover {
                    background-color: #e2cf9b;
                    border: 4px solid #fff;

                    &:active {
                        background-color: #beaf83;
                        color: #fff;
                        border: 4px solid #fff;
                    }
                }
            }
        }

        .body {
            flex: auto;
            overflow: hidden;
            overflow-y: auto;

            .el-header {
                padding: 0;
            }

            .el-main {
                padding: 0;
            }

            .setting-tabs {
                display: flex;
                margin: 0 auto;
                overflow: hidden;
                padding: 6px 0;
                width: fit-content;
                font-size: 14px;

                .setting-tab {
                    padding: 0 10px;
                    background-color: #2c3759;
                    color: #beaf83;
                    width: 90px;
                    text-align: center;

                    &:first-child {
                        border-top-left-radius: 50px;
                        border-bottom-left-radius: 50px;
                    }

                    &:last-child {
                        border-top-right-radius: 50px;
                        border-bottom-right-radius: 50px;
                    }

                    &:hover,
                    &.active {
                        background-color: #beaf83;
                        color: #2c3759;

                        &:active {
                            background-color: #a39260;
                            color: #1a2545;
                        }
                    }
                }
            }

            .setting-content {
                height: 100%;
                overflow: hidden;
                overflow-y: auto;
            }

            .empty {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                font-size: 18px;

                .add-text {
                    margin: 0 4px;
                    color: #39425d;
                    font-weight: bold;
                    background-color: #beaf83;
                    border-radius: 50px;
                    padding: 0 10px;

                    &:hover {
                        color: #2c3759;

                        &:active {
                            color: #1a2545;
                        }
                    }
                }
            }

            .record {
                display: flex;
                padding: 14px 20px;
                border-top: 1px solid #dadada;
                height: 50px;

                &:hover {
                    background-color: #14120f13;
                }

                .record-content {
                    width: calc(100% + 10px);
                    height: 100%;
                    display: flex;
                    align-items: center;

                    .edit-record-content {
                        --el-input-bg-color: #fff;
                        --el-input-focus-border-color: transparent;
                        --el-input-hover-border: transparent;
                        --el-input-focus-border: transparent;
                        --el-input-hover-border-color: transparent;
                        margin-left: -10px;
                    }
                }

                .record-remove {
                    width: 24px;
                    height: 24px;
                    color: #ccc;

                    &:hover {
                        color: #565654;

                        &:active {
                            color: #000;
                        }
                    }
                }
            }
        }

    }

    .info-box {
        background-image: v-bind('`url(${InfoBg})`');
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 2;
        backface-visibility: hidden;

        .tag {
            width: fit-content;
            background-color: #d0a467;
            color: #fff;
            border-top-left-radius: 50px;
            border-bottom-left-radius: 50px;
            border-bottom-right-radius: 80px;
            padding: 0px 20px;
            font-size: 16px;
            position: absolute;
            top: -5px;
            left: -10px;
        }

        .role-user {
            position: absolute;
            width: 67%;
            bottom: -10px;
            right: 6%;
            pointer-events: none;
        }

        .content {
            position: absolute;
            bottom: 20%;
            left: 50px;
            width: 40%;
            font-size: 28px;
            color: #ffd027;
            text-shadow: 0 -1px 1px #000, 0 0 2px #000;


            &::before {
                content: "";
                width: 4px;
                height: 80%;
                left: -36px;
                top: 0;
                bottom: 0;
                margin: auto;
                position: absolute;
                background-color: #565654;
            }
        }

        .role-skill {
            font-size: 64px;
            position: absolute;
            top: 15%;
            left: 40px;
            font-weight: bold;
            text-shadow: 0 0 2px rgba(0, 0, 0, .5);
        }

        .role-name {
            position: absolute;
            left: 50%;
            bottom: 25%;
            filter: drop-shadow(0 0 2px #000);

            .role-type {
                width: 60px;
                height: 60px;
                filter: drop-shadow(0 0 2px #000);
                margin-top: -10px;
            }

            .role-name-text {
                font-size: 60px;
                color: #fff;
                text-shadow: 0 0 1px #000;
            }

            .role-star {
                position: relative;

                &::after {
                    content: '';
                    position: absolute;
                    left: -20px;
                    top: -90%;
                    width: 300px;
                    height: 240%;
                    background-color: rgba(0, 0, 0, .6);
                    z-index: -1;
                }
            }

            .role-nickname {
                font-size: 20px;
                color: #f9cb2b;
                background-color: #39425d;
                width: fit-content;
            }
        }

        .setting {
            position: absolute;
            bottom: 20px;
            left: 50px;
            width: 30px;
            height: 30px;
            background-color: #eee8e3;
            border: 1px solid #e2d7b6;
            color: #00000080;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;

            :deep(svg) {
                width: 20px;
                height: 20px;
            }

            &:hover {
                filter: brightness(.9);

                &:active {
                    filter: brightness(.8);
                }
            }
        }
    }

    .result-page {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 10;
        top: 0;
        left: 0;
        background-color: #fff;
    }
}

@keyframes fade-in {
    to {
        opacity: 1
    }
}
</style>