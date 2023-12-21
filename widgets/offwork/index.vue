<template>
    <ft-space class="offwork-widget" justify="space-between" v-if="status" @click="openDialog('/edit.vue', null, {
        title: '编辑',
    })">
        <ft-image class="img" :src="status.status.working ? status.workImage : status.offImage"></ft-image>
        <ft-space vertical class="tip-container" align="flex-end" justify="space-between">
            <span class="title" v-if="status.status.working">距离下班还有</span>
            <span class="title" v-else>休息中</span>
            <span class="tip" v-if="status.status.working">{{ status.status.msg }}</span>
        </ft-space>
    </ft-space>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, ref } from 'vue'
import { OffWorkStatus, OffWorkType } from './libs/offwork';
import Storage from 'private-storage'
import { setTitle, openDialog } from 'widget'

const status = ref<OffWorkStatus>()

function init() {
    if (status.value) {
        status.value.destory()
    }
    const config = OffWorkStatus.getConfig();
    if (config.title) {
        setTitle(config.title)
    }
    status.value = new OffWorkStatus(config);
}

init()

Storage.on('config', init)

onBeforeUnmount(() => {
    Storage.off('config', init)
    if (status.value) {
        status.value.destory()
    }
})
</script>
<style lang="scss" scoped>
.offwork-widget {
    width: 100%;
    height: 100%;
    background-color: #fff;
    padding: 0 20px;
    cursor: pointer;

    .img {
        height: 100%;
        width: auto;
    }

    .tip-container {
        padding: 10px 0;
        height: 100%;

        .title {
            font-size: 12px;
            color: #4f4f4f;
        }
    }
}
</style>