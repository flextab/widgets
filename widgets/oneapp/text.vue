<template>
    <div class="one-text" :title="oneData?.description" @click="openDialog('/view.vue')">
        {{ oneData?.description || '' }}
    </div>
</template>
<script lang="ts" setup>
import { ref } from "vue"
import { getOneData, OneData } from './libs/one'
import { openDialog } from 'widget'

const oneData = ref<OneData>()

async function init() {
    oneData.value = await getOneData()
}

init()
</script>
<style lang="scss" scoped>
.one-text {
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    max-width: 80vw;
    margin: 0 auto;
    cursor: pointer;
}
</style>