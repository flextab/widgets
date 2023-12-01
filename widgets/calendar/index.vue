<template>
    <ft-space vertical class="default-calendar-widget s_1_1" align="center" justify="center" @click="open()">
        <el-text type="danger">{{ calendar.today.weekName }}</el-text>
        <div class="main-text">{{ calendar.today.date }}</div>
    </ft-space>
    <ft-space class="default-calendar-widget s_2_1" align="center" justify="space-between" @click="open()">
        <ft-space vertical align="center">
            <el-text type="danger">
                {{ calendar.today.year }}-{{ calendar.today.month }} {{ calendar.today.weekName }}
            </el-text>
            <div class="main-text">{{ calendar.today.date }}</div>
        </ft-space>
        <ft-space vertical align="flex-end" class="extras-info">
            <span>{{ calendar.today.lunarMonth }}月{{ calendar.today.lunarDay }}</span>
            <span v-if="calendar.today.festival?.length">{{ calendar.today.festival[0] }}</span>
            <span v-else-if="calendar.today.solarTerm">{{ calendar.today.solarTerm }}</span>
            <span>{{ calendar.today.xingzuoName }}座</span>
        </ft-space>
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
<style lang="scss">
:host([size="2*1"]) {
    .default-calendar-widget.s_1_1 {
        display: none !important;
    }

    .default-calendar-widget.s_2_1 {
        display: flex !important;
    }
}
</style>
<style lang="scss" scoped>
.default-calendar-widget {
    background-color: #fff;
    width: 100%;
    height: 100%;
    cursor: pointer;

    .main-text {
        font-size: 32px;
    }

    &.s_2_1 {
        display: none !important;
        padding: 0 16px;
    }

    .extras-info {
        font-size: 12px;
        color: #3b3b3b;
        max-width: 40%;
        overflow: hidden;

        span {
            display: inline-block;
            overflow: hidden;
            text-overflow: clip;
            white-space: nowrap;
            max-width: 100%;
        }
    }
}
</style>