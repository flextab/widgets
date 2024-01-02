<template>
    <div class="loading">
        <div class="loading-icons">
            <div class="icon" v-for="icon, i in icons" v-html="getSVGIcon(icon)"></div>
            <div class="progress" :style="{
                width: `${typeof percent === 'number' ? `${Number(100 - percent).toFixed(0)}%` : '100%'}`
            }" @transitionend="checkEnd"></div>
        </div>
        <div class="tip" v-if="!tip">加载中，请稍后 {{ typeof percent === 'number' ? `${Number(percent).toFixed(0)}%` : '...' }}
        </div>
        <div class="tip" v-else>{{ tip }}</div>
    </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch, computed } from "vue"
import Icons from '../assets/icons/*.svg?minimatch'

const props = defineProps<{
    percent: number
    tip?: string
}>()
const emit = defineEmits<{
    (name: 'finished'): void
}>()
const icons = ref(['pyro', 'hydro', 'anemo', 'electro', 'dendro', 'cryo', 'geo'])
watch(computed(() => props.percent), () => {
    checkEnd()
})

function checkEnd() {
    if (props.percent === 100) {
        setTimeout(() => {
            emit('finished')
        }, 1000);
    }
}

function getSVGIcon(name: string) {
    return decodeURIComponent(Icons[`${name}.svg`].split(',')[1])
}

onMounted(() => {
    if (props.percent === 100) {
        checkEnd()
    }
})
</script>
<style lang="scss" scoped>
.loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
    color: #d1d1d1;

    .loading-icons {
        display: flex;
        gap: 10px;
        position: relative;

        .icon {
            mix-blend-mode: exclusion;
            color: #333;
            z-index: 2;

            :deep(svg) {
                width: 40px;
                height: 40px;
            }
        }

        .progress {
            width: 100%;
            background-color: #fff;
            position: absolute;
            top: 0;
            right: 0;
            height: 100%;
            z-index: 1;
            transition: width ease-in-out .5s;
        }
    }

    .tip {
        width: 100%;
        text-align: center;
        font-size: 18px;
    }
}
</style>