<template>
    <img :src="clink" referrerpolicy="no-referrer" @error="getCurrentImage()" @load="saveImg" />
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { getDetail, saveImageByLink } from './libs/douban'

const props = defineProps<{
    src: string
    link: string
}>()

const csrc = ref('')
const clink = computed(() => {
    return (csrc.value || props.src || '').replace("s_ratio_poster", "l");
})

async function getCurrentImage() {
    if (!csrc.value) {
        const data = await getDetail(props.link)
        csrc.value = data.image
    }
}

function saveImg() {
    if (csrc.value) {
        saveImageByLink(props.link, csrc.value)
    }
}
</script>
<style lang="scss" scoped></style>