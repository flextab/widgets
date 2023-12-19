<template>
    <el-container class="note-edit" tabindex="0">
        <el-aside>
            <el-container class="aside">
                <el-header>
                    <ft-space vertical>
                        <h2>备忘录</h2>
                    </ft-space>
                </el-header>
                <el-main>
                    <div class="note-table-item" :class="{ active: note.id === form.id }" v-for="note of list"
                        :key="note.id" @click="editNote(note)">
                        <ft-space vertical :gap="6">
                            <ft-space justify="space-between" align="flex-start" :gap="20">
                                <div class="title">{{ note.title || '无标题' }}</div>
                                <div @click.stop>
                                    <el-dropdown trigger="click" @command="onAction($event, note)" class="actions"
                                        :teleported="false" size="small">
                                        <el-link>
                                            <ft-icon class="more" name="MoreFilled"></ft-icon>
                                        </el-link>
                                        <template #dropdown>
                                            <el-dropdown-menu>
                                                <el-dropdown-item command="delete" class="danger">删除</el-dropdown-item>
                                            </el-dropdown-menu>
                                        </template>
                                    </el-dropdown>
                                </div>
                            </ft-space>
                            <div class="date">{{ getDate(note.createdAt) }}</div>
                        </ft-space>
                    </div>
                </el-main>
                <el-footer>
                    <ft-space justify="flex-end">
                        <el-link @click="addNewNote()">
                            <ft-icon name="Edit" :size="24" color="#f2c200"></ft-icon>
                        </el-link>
                    </ft-space>
                </el-footer>
            </el-container>
        </el-aside>
        <el-main>
            <el-container class="content">
                <el-header v-if="form.id">
                    <input type="text" placeholder="请输入标题" v-model="form.title" @change="saveForm()">
                </el-header>
                <el-main>
                    <RichEditor v-model="form.content" @update:model-value="saveForm()" v-if="form.id" :key="form.id" />
                    <div class="h-full empty" v-else>
                        <ft-space vertical align="center" justify="center" class="h-full" :gap="40">
                            <img class="start-icon" :src="FeatherSVG" />
                            <div>开始记录你的一切吧！</div>
                        </ft-space>
                    </div>
                </el-main>
            </el-container>
        </el-main>
    </el-container>
</template>
<script lang="ts" setup>
import { ref } from "vue"
import RichEditor from './rich.vue'
import Storage from 'storage'
import FeatherSVG from './assets/feather.svg'
import dayjs from 'dayjs'
import { ElMessageBox } from 'element-plus'
import { enableFullscreen } from 'widget'
enableFullscreen()

interface NoteData {
    title: string
    createdAt: number
    updatedAt: number
    content: string
    id: string
}
const form = ref<NoteData>({} as NoteData)
const list = ref<NoteData[]>([])

function init() {
    const data = Storage.get('list') as string
    if (data) {
        const notes = JSON.parse(data) as NoteData[]
        list.value = notes.map(item => {
            item.content = Storage.get(item.id) as string || ''
            return item;
        })
    }
    editNote(list.value[0])
}

function generateUUID() {
    return Math.random().toString(36).slice(2)
}

function addNewNote() {
    list.value.unshift({
        id: generateUUID(),
        title: '',
        content: '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
    })
    editNote(list.value[0])
}

function editNote(note: NoteData) {
    form.value = {
        ...note || {} as any
    }
}

let timer: any = null

function saveForm() {
    clearTimeout(timer)
    setTimeout(() => {
        const data = form.value
        if (data.id) {
            data.updatedAt = Date.now()
            const index = list.value.findIndex(item => item.id === data.id)
            Object.assign(list.value[index], data)
        } else {
            data.id = generateUUID()
            data.createdAt = Date.now()
            data.updatedAt = Date.now()
            list.value.push(data)
        }
        saveNotes()
    }, 300)
}

function saveNotes() {
    Storage.set('list', JSON.stringify(list.value.map(item => {
        Storage.set(item.id, item.content)
        return {
            ...item,
            content: undefined,
        }
    })))
}

async function delNote(id: string) {
    await ElMessageBox.confirm('确定要删除吗?', '提示')
    const index = list.value.findIndex(item => item.id === id)
    list.value.splice(index, 1)
    Storage.del(id)
    saveNotes()
    form.value = list.value[index] || list.value[0] || {}
}

function onAction(action: string, note: NoteData) {
    switch (action) {
        case 'delete': {
            delNote(note.id)
        }
            break;
    }
}

function getDate(date: number) {
    if (Math.abs(dayjs(date).diff(Date.now(), 'day')) > 7) {
        return dayjs(date).format('MM-DD')
    }
    return dayjs(date).fromNow()
}

init();
</script>
<style lang="scss">
:host([fullscreen]) {
    .app>.note-edit {
        width: 100%;
        height: 100%;
    }
}
</style>
<style lang="scss" scoped>
.note-edit {
    width: 800px;
    height: 600px;

    >.el-aside>.aside {
        background-color: #f7f7f7;
        height: 100%;

        >.el-header {
            padding: 20px 10px 10px 10px;
        }

        >.el-main {
            padding: 0;

            .note-table-item {
                line-height: 1.5;
                padding: 10px;
                margin: 0 4px;
                border-radius: 6px;
                overflow: hidden;
                cursor: pointer;
                margin-bottom: 10px;

                &:last-child {
                    margin-bottom: 0;
                }

                &:hover,
                &.active {
                    background-color: #d8d8d8;
                }


                .title {
                    font-size: 16px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .actions {
                    // opacity: 0;

                    :deep(.el-popper) {
                        position: fixed !important;
                    }
                }

                &:hover .actions {
                    opacity: 1;
                }

                .date {
                    font-size: 12px;
                    color: #9f9f9f;
                }
            }
        }

        >.el-footer {
            padding: 10px;
        }
    }

    >.el-main {
        padding: 0;

        .content {
            height: 100%;

            >.el-header {
                padding: 20px 0 0 0;

                input {
                    width: 100%;
                    font-size: 16px;
                    height: 30px;
                    border: none;
                    border-bottom: 1px solid #f7f7f7;
                    color: #313131;
                    padding: 0 10px 5px 10px;

                    &:focus {
                        outline: none;

                        &:active {
                            outline: none;
                        }
                    }
                }
            }

            >.el-main {
                padding: 0;
                overflow: hidden;
            }

            >.el-footer {
                padding: 10px;
            }

            .empty {
                user-select: none;

                .start-icon {
                    width: 100px;
                    margin-top: -80px;
                }
            }
        }
    }
}
</style>