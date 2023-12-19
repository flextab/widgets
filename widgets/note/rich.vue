<template>
    <el-container class="rich-editor">
        <el-header>
            <ft-space :gap="4" class="rich-toolbar">
                <template v-for="item of buttons">
                    <div class="rich-button" :class="{ active: item.active }" :title="item.label"
                        v-html="getSVG(Icons[item.type + '.svg'])" @click="handleClick(item.type, item.active)"></div>
                </template>
            </ft-space>
        </el-header>
        <el-main>
            <iframe ref="iframeEl"></iframe>
        </el-main>
    </el-container>
</template>
<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"
import RichStyle from './rich.scss'
import Icons from './assets/icons/*.svg?minimatch'

const scripts = [
    'https://registry.npmmirror.com/dompurify/2.4.3/files/dist/purify.min.js',
    'https://registry.npmmirror.com/@ikrong/squire/2.0.2/files/dist/squire.js'
]

const props = defineProps<{
    modelValue: string;
}>()
const emit = defineEmits<{
    (name: 'update:modelValue', value: string): void
}>()
const rootEl = ref<HTMLDivElement>()
const iframeEl = ref<HTMLIFrameElement>()
const editorStatus = ref({
    focus: false,
})
const buttons = ref([
    { label: '粗体', type: 'bold', format: 'B', active: false },
    { label: '斜体', type: 'italic', format: 'I', active: false },
    { label: '下划线', type: 'underline', format: 'U', active: false },
    { label: '高亮', type: 'fonthighlight', active: false },
    { label: '无序列表', type: 'list' },
    { label: '有序列表', type: 'orderlist' },
    { label: '待办', type: 'checkbox' },
    { label: '清除格式', type: 'clear' },
])
let editor: any

function getSVG(content: string) {
    return decodeURIComponent(content.split(';,')[1])
}

function loadScript(url: string): Promise<void> {
    return new Promise((r, j) => {
        const doc = iframeEl.value?.contentDocument
        const win = iframeEl.value?.contentWindow
        if (!doc || !win) {
            return
        }
        const script = doc.createElement('script')
        script.src = url
        script.onload = () => r()
        script.onerror = () => j()
        doc.body.append(script)
    })
}

function update() {
    if (editor && editor.getRoot()?.textContent) {
        if (editor.getRoot().classList.contains('empty')) {
            editor.getRoot().classList.remove('empty')
        }
        emit('update:modelValue', editor.getHTML())
    }
}

function handleClick(type: string, isActie = false) {
    switch (type) {
        case 'bold': {
            if (isActie) {
                editor.removeBold()
            } else {
                editor.bold()
            }
        }
            break;
        case 'italic': {
            if (isActie) {
                editor.removeItalic()
            } else {
                editor.italic()
            }
        }
            break;
        case 'underline': {
            if (isActie) {
                editor.removeUnderline()
            } else {
                editor.underline()
            }
        }
            break;
        case 'fonthighlight': {
            if (isActie) {
                editor.setHighlightColor(null)
            } else {
                editor.setHighlightColor('#ffe15c')
            }
        }
            break;
        case 'list': {
            editor.makeUnorderedList()
        }
            break;
        case 'orderlist': {
            editor.makeOrderedList()
        }
            break;
        case 'checkbox': {
            editor.makeTodoList()
        }
            break;
        case 'clear': {
            editor.removeAllFormatting()
        }
            break
        default:
            break;
    }
}

function checkToolbarStatus() {
    buttons.value.map(item => {
        if (item.format) {
            item.active = editor.hasFormat(item.format);
        }
        if (item.type === 'fonthighlight') {
            item.active = !!editor.getFontInfo().backgroundColor
        }
    })
}

function loadContent() {
    const win = iframeEl.value!.contentWindow!
    const doc = iframeEl.value!.contentDocument!
    const Squire = (<any>win).Squire;
    const style = document.createElement('style')
    style.innerHTML = RichStyle
    doc.head.append(style)
    const div = doc.createElement('div')
    div.classList.add('rich-content')
    doc.body.append(div)
    editor = new Squire(div, {
        blockTag: 'p',
        tagAttributes: {}
    });
    editor.setHTML(props.modelValue || '')
    editor.addEventListener('selectionchange', checkToolbarStatus)
    editor.addEventListener('input', () => {
        const selection = editor.getSelection()
        if (selection.startContainer && selection.startContainer.scrollIntoViewIfNeeded) {
            if (editor.getRoot().firstChild !== selection.startContainer) {
                selection.startContainer.scrollIntoViewIfNeeded(false)
            }
        }
        update()
    })
    editor.addEventListener('blur', () => {
        editorStatus.value.focus = false
        div.classList.remove('focus')
        update()
    })
    editor.addEventListener('focus', () => {
        editorStatus.value.focus = true
        div.classList.add('focus')
    })
    if (!props.modelValue) {
        div.classList.add('empty')
    }
}

async function loadJS() {
    await Promise.all(scripts.map(url => loadScript(url)))
    loadContent()
}

onMounted(() => {
    loadJS()
})
onBeforeUnmount(() => {
    if (editor) {
        editor.destroy()
    }
})
</script>
<style lang="scss" scoped>
.rich-editor {
    width: 100%;
    height: 100%;

    >.el-header {
        padding: 0;

        .rich-toolbar {
            user-select: none;

            .rich-button {
                width: 26px;
                height: 26px;
                padding: 4px;
                cursor: pointer;
                color: #292727;

                :deep(svg) {
                    width: 100%;
                    height: 100%;
                    fill: currentColor;
                }

                &:hover {
                    background-color: #fff1bb;
                    color: #000;
                }

                &.active {
                    background-color: #f2c200;
                    color: #fff;
                }
            }
        }
    }

    >.el-main {
        padding: 0;
        overflow: hidden;

        >iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
    }
}
</style>