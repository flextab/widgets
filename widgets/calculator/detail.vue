<template>
    <iframe ref="iframeEl" class="iframe"></iframe>
    <div class="calculator-container" tabindex="0">
        <div class="calculator-result-view">
            <div class="calculator-formula">
                <div ref="formulaEl" @mousewheel="onScroll($event, 'formulaEl')">{{ calculator.formula }}</div>
            </div>
            <div class="calculator-result">
                <div ref="resultEl" spellcheck="false" @mousewheel="onScroll($event, 'resultEl')"
                    contenteditable="plaintext-only" @blur="onCustomEdit" @focus="customEdit = true"
                    @keydown.enter.stop="exec('=')" @keydown="setActive($event.key)">
                    {{ calculator.input }}
                </div>
            </div>
        </div>
        <div class="calculator-keyboard">
            <template v-for="k of calculator.keys">
                <div class="calc-key" v-if="k === 'RAD|DEG'" :ckey="k" @click="exec(k)"
                    :class="{ active: currentKey === k }">
                    <span>{{ calculator.mode }}</span>
                </div>
                <div class="calc-key" v-else :ckey="k" @click="exec(k)" :class="{ active: currentKey === k }">{{ k }}</div>
            </template>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { setPageTitle } from 'widget'
import { Calculator } from './libs/calc'

setPageTitle('')

const iframeEl = ref<HTMLIFrameElement>()
const formulaEl = ref<HTMLDivElement>()
const resultEl = ref<HTMLDivElement>()
const calculator = ref(new Calculator())
const customEdit = ref(false)
const currentKey = ref('')

watch(currentKey, () => {
    if (currentKey.value) {
        setTimeout(() => {
            currentKey.value = ''
        }, 200);
    }
})

function scroll() {
    nextTick(() => {
        formulaEl.value!.scrollLeft = formulaEl.value!.scrollWidth
        resultEl.value!.scrollLeft = resultEl.value!.scrollWidth
    })
}

function onScroll(e: WheelEvent, name: string) {
    const dom = {
        formulaEl: formulaEl.value,
        resultEl: resultEl.value
    }[name] as HTMLDivElement;
    if (e.deltaY < 0) {
        dom.scrollLeft -= 10
    } else {
        dom.scrollLeft += 10
    }
}

function onCustomEdit(e: InputEvent) {
    if (customEdit.value) {
        customEdit.value = false
        calculator.value.input = (e.target as HTMLDivElement).innerText
    }
}

function setActive(key: string) {
    if ('1234567890+-*/^()e%×÷'.includes(key)) {
        const visualKey = {
            '*': "×",
            '/': "÷",
        }[key]
        currentKey.value = visualKey || key
    } else if (key === 'Enter' || key === '=') {
        currentKey.value = '='
    } else if (key === 'Backspace' || key === '←') {
        currentKey.value = '←'
    }
}

function exec(k: string) {
    if (customEdit.value) {
        customEdit.value = false
        calculator.value.input = resultEl.value!.innerText
        resultEl.value?.blur()
    }
    calculator.value.click(k);
    scroll()
}

function installMathjs() {
    const link = 'https://registry.npmmirror.com/mathjs/12.1.0/files/lib/browser/math.js'
    const script = document.createElement('script')
    script.src = link
    script.onload = () => {
        const math = (<any>iframeEl.value?.contentWindow).math
        calculator.value.installMathJS(math)
    }
    iframeEl.value?.contentDocument?.body.append(script)
}

function listenKeyboard(e: KeyboardEvent) {
    if (customEdit.value) return
    if ('1234567890+-*/^()e%'.includes(e.key)) {
        const visualKey = {
            '*': "×",
            '/': "÷",
        }[e.key]
        calculator.value.click(visualKey || e.key)
    } else if (e.key === 'Enter') {
        calculator.value.click('=')
    } else if (e.key === 'Backspace') {
        calculator.value.click('←')
    }
    setActive(e.key)
}

document.addEventListener('keydown', listenKeyboard)

onMounted(() => {
    installMathjs()
})

onBeforeUnmount(() => {
    document.removeEventListener('keydown', listenKeyboard)
})
</script>
<style lang="scss" scoped>
.iframe {
    position: fixed;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
}

.calculator-container {
    width: 512px;
    height: 500px;
    background-color: #181818;
    padding: 40px 10px 10px 10px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    gap: 14px;

    &:focus {
        outline: none;
    }

    .calculator-result-view {
        border-radius: 14px;
        display: flex;
        flex-direction: column;
        flex: auto;
        overflow: hidden;

        .calculator-formula {
            flex: 0 0 26px;
            font-size: 14px;
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
            color: #fff;
        }

        .calculator-result {
            flex: auto;
            font-size: 45px;
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
            color: #fff;
        }

        .calculator-formula,
        .calculator-result {
            >div {
                width: 100%;
                overflow: hidden;
                overflow-x: auto;
                white-space: nowrap;
                word-break: keep-all;
                text-align: right;
                font-family: sans-serif;

                &:focus {
                    outline: none;

                    &:active {
                        outline: none;
                    }
                }
            }
        }
    }

    .calculator-keyboard {
        flex: 0 0 300px;
        display: grid;
        grid-template-columns: repeat(7, 60px);
        grid-template-rows: repeat(5, 60px);
        justify-content: space-between;
        align-content: flex-end;
        gap: 6px;

        .calc-key {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-family: sans-serif;
            color: #cdcdcd;
            border-radius: 50px;
            background-color: #363636;
            user-select: none;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            font-weight: bold;

            &::before {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                transition: background-color .2s ease-in-out;
            }

            &:hover::before,
            &.active::before {
                background-color: rgba(255, 255, 255, .2);
            }

            &:hover:active::before {
                background-color: rgba(255, 255, 255, .35);
            }

            &[ckey="RAD|DEG"] {
                grid-column: span 2;
            }

            &[ckey="÷"],
            &[ckey="×"],
            &[ckey="-"],
            &[ckey="+"],
            &[ckey="="] {
                background-color: #ff9c4b;
                color: #fff;
            }
        }
    }
}
</style>