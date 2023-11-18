<template>
    <ft-space vertical class="default-calendar-widget" align="center" justify="center" @click="open()">
        <el-text type="danger">{{ calendar.today.weekName }}</el-text>
        <div class="main-text">{{ calendar.today.date }}</div>
    </ft-space>
</template>
<script lang="ts" setup>
import { ref } from "vue"
import { Calendar } from './libs/calendar'
import { openDialog } from 'widget'

const calendar = ref(new Calendar())

function open() {
    openDialog('/view.vue')
}
</script>
<style lang="scss" scoped>
.default-calendar-widget {
    background-color: #fff;
    width: 100%;
    height: 100%;
    cursor: pointer;

    .main-text {
        font-size: 32px;
    }
}
</style>./libs/calendar