<template>
    <div class="default-calendar-view">
        <div class="calendar-wrap">
            <ft-space class="calendar-top" :gap="10">
                <el-select :model-value="calendar.year" placeholder="年" size="small"
                    @update:modelValue="setNewCalandar($event, 'year')">
                    <el-option v-for="n in (new Date().getFullYear() + 20 - 1900)" :label="1900 + n" :value="1900 + n" />
                </el-select>
                <el-link @click="next(-1, 'month')">
                    <ft-icon name="ArrowLeft"></ft-icon>
                </el-link>
                <el-select :model-value="calendar.month" placeholder="月" size="small"
                    @update:modelValue="setNewCalandar($event, 'month')">
                    <el-option v-for="n in 12" :label="n" :value="n" />
                </el-select>
                <el-link @click="next(1, 'month')">
                    <ft-icon name="ArrowRight"></ft-icon>
                </el-link>
                <el-link v-if="!calendar.isToday">
                    <span class="back-today" @click="getNewCalandar(new Date())">今</span>
                </el-link>
            </ft-space>
            <div class="calendar-container" @mousewheel="onMouseWheel">
                <div v-for="w in calendar.weeks">{{ w }}</div>
                <div class="calendar-day" :class="{
                    'current-month': calendar.month === d.month,
                    'today': d.date === calendar.today.date && calendar.today.month === d.month,
                    'current-day': d.date === calendar.currentDay.date && calendar.currentDay.month === d.month,
                    'rest-day': d.isHoliday || d.isRest,
                    'need-work': d.isWork,
                    'is-holiday': d.isHoliday,
                }" v-for="d in calendar.days" @click="getNewCalandar(`${d.year}-${d.month}-${d.date}`)">
                    <div class="day">{{ d.date }}</div>
                    <div class="day-footer solar-term" v-if="d.festival?.length">{{ d.festival[0] }}</div>
                    <div class="day-footer solar-term" v-else-if="d.solarTerm">{{ d.solarTerm }}</div>
                    <div class="day-footer lunar-day" v-else>{{ d.lunarDay }}</div>
                </div>
            </div>
            <div class="calendar-detail no-scrollbar">
                <div class="year-symbol">{{ calendar.currentDay.yearSymbol }}</div>
                <div class="lunar-text">{{ calendar.currentDay.lunarFullDateString }}</div>
                <div class="segment-warp">
                    <div class="segment-text" v-if="nextHoliday">
                        <el-tag effect="light" color="#409eff9c" disable-transitions>假期</el-tag>
                        <div>{{ nextHoliday }}</div>
                    </div>
                    <div class="segment-text" v-if="nextJieqi">
                        <el-tag effect="light" color="#fcd3d39c" disable-transitions>节气</el-tag>
                        <div>{{ nextJieqi }}</div>
                    </div>
                    <div class="segment-text">
                        <el-tag effect="light" color="#9036ad9c" disable-transitions>星座</el-tag>
                        <div>
                            <span>{{ calendar.currentDay.xingzuoName }}</span>
                            <span style="margin-left: 10px;">{{ calendar.currentDay.xingzuoSymbol }}</span>
                        </div>
                    </div>
                    <div class="segment-text">
                        <el-tag effect="light" color="#67c23a9c" disable-transitions>宜</el-tag>
                        <div>{{ calendar.currentDay.dayAllowText }}</div>
                    </div>
                    <div class="segment-text">
                        <el-tag effect="light" color="#f56c6c9c" disable-transitions>忌</el-tag>
                        <div>{{ calendar.currentDay.dayForbidText }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, computed } from "vue"
import { Calendar } from './libs/calendar'
import dayjs from 'dayjs'

const calendar = ref(new Calendar())
const animalTip = computed(() => {
    const { yearAnimalName, yearGanzhiName } = calendar.value.currentDay
    return `"${yearGanzhiName}(${yearAnimalName})"`
})
const nextHoliday = computed(() => {
    return calendar.value.getNextHoliday()
})
const nextJieqi = computed(() => {
    return calendar.value.getNextJieqi()
})

function setNewCalandar(data: number, type: 'month' | 'year') {
    const date = dayjs(new Date(calendar.value.year!, calendar.value.month! - 1, calendar.value.date)).set(type, type === 'month' ? (data - 1) : data).toDate()
    getNewCalandar(date)
}

function next(diff: number, type: 'month' | 'year') {
    const date = dayjs(new Date(calendar.value.year!, calendar.value.month! - 1, calendar.value.date)).add(diff, type).toDate()
    getNewCalandar(date)
}

function getNewCalandar(date: string | Date) {
    if (dayjs(date).year() >= dayjs().year() + 20) {
        return
    }
    calendar.value = Calendar.getCalandar(date)
}

function onMouseWheel(e: any) {
    if (e.deltaY > 0) {
        next(1, 'month')
    } else if (e.deltaY < -0) {
        next(-1, 'month')
    }
}

</script>
<style lang="scss">
:host([fullscreen]) {
    height: 100vh;

    .default-calendar-view {
        width: 100%;
        height: 100%;

        .calendar-wrap {
            .calendar-detail {
                flex: 0 0 30%;
            }
        }
    }
}
</style>
<style lang="scss" scoped>
.default-calendar-view {
    width: 820px;
    height: 520px;
    position: relative;
    user-select: none;

    .calendar-top {
        position: absolute;
        top: 0;
        left: 65px;
        height: 40px;
        display: flex;
        align-items: center;
        z-index: 2;

        .el-select {
            width: 80px;

            :deep(.el-input__inner) {
                text-align: center;
            }

            :deep(.el-input__suffix) {
                display: none;
            }
        }

        .back-today {
            font-size: 12px;
            background-color: #007AFF;
            color: #fff;
            padding: 2px 5px;
            border-radius: 10px;
            cursor: pointer;

            &:hover:active {
                background-color: #005ec3;
            }
        }
    }

    .calendar-wrap {
        display: flex;
        align-items: stretch;
        height: 100%;
        width: 100%;

        .calendar-container {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            grid-template-rows: 30px auto;
            width: 100%;
            height: 100%;
            user-select: none;
            gap: 10px;
            flex: auto;
            padding: 40px 10px 10px 10px;

            >* {
                display: flex;
                align-items: center;
                justify-content: center;

                &.calendar-day {
                    flex-direction: column;
                    opacity: .4;
                    cursor: pointer;
                    border-radius: 14px;
                    position: relative;
                    overflow: hidden;

                    &:hover {
                        background-color: #F2F2F7;

                        &:active {
                            background-color: #e8e8e8;
                        }
                    }

                    &.current-month {
                        opacity: 1;
                    }

                    &.rest-day {
                        color: #FF3B30;

                        &:active {
                            // background-color: #005ec3;
                        }

                        >.day {
                            color: #FF3B30;
                        }

                        >.day-footer {
                            color: #FF3B30;
                        }

                        &.today::before {
                            box-shadow: 0 0 20px rgba(0, 0, 0, .4);
                        }
                    }

                    &.current-day {
                        background-color: #007AFF;
                        color: #fff;

                        &:active {
                            background-color: #005ec3;
                        }

                        >.day {
                            color: #fff;
                        }

                        >.day-footer {
                            color: #fff;

                            &.solar-term {
                                color: #fff;
                            }
                        }

                        &.today::before {
                            box-shadow: 0 0 20px rgba(0, 0, 0, .4);
                        }
                    }

                    &.today {
                        &::before {
                            content: '今';
                            position: absolute;
                            width: 24px;
                            height: 24px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background-color: #007AFF;
                            color: #fff;
                            border-radius: 40px;
                            font-size: 12px;
                            transform-origin: 100% 0;
                            transform: scale(.8);
                            right: 6px;
                            top: 6px;
                        }
                    }

                    &.need-work {
                        &::before {
                            content: '班';
                            position: absolute;
                            width: 24px;
                            height: 24px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background-color: #a8a8a8;
                            color: #fff;
                            border-radius: 40px;
                            font-size: 12px;
                            transform-origin: 100% 0;
                            transform: scale(.8);
                            right: 6px;
                            top: 6px;
                        }
                    }

                    &.is-holiday {
                        &::before {
                            content: '休';
                            background-color: #FF3B30;
                            position: absolute;
                            width: 24px;
                            height: 24px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: #fff;
                            border-radius: 40px;
                            font-size: 12px;
                            transform-origin: 100% 0;
                            transform: scale(.8);
                            right: 6px;
                            top: 6px;
                        }
                    }

                    >.day {
                        font-size: 20px;
                        color: #323232;
                        font-weight: 600;
                    }

                    >.day-footer {
                        font-size: 12px;
                        color: #3C3C43;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: clip;
                        padding: 0 2px;
                        max-width: 100%;

                        &.solar-term {
                            color: #007AFF;
                        }
                    }

                }
            }
        }

        .calendar-detail {
            flex: 0 0 240px;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: #f7f7f7;
            padding-top: 40px;
            overflow: auto;

            .year-symbol {
                font-size: 50px;
                background-color: #ededed;
                width: 80px;
                flex: 0 0 80px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 14px;
                flex-direction: column;
                position: relative;
                margin-bottom: 36px;
                user-select: none;
                box-shadow: inset 0 0 20px 4px rgba(0, 0, 0, .1);
                text-shadow: 0 0 10px rgba(0, 0, 0, .4);

                &::after {
                    content: v-bind('animalTip');
                    font-size: 14px;
                    position: absolute;
                    bottom: -26px;
                    color: #929292;
                    text-shadow: none;
                }
            }

            .lunar-text {}

            .segment-warp {
                width: 100%;
                margin-top: 20px;
                color: #929292;

                .segment-text {
                    width: 100%;
                    padding: 8px 10px;
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    border-bottom: 1px solid #ededed;

                    &:first-child {
                        border-top: 1px solid #ededed;
                    }

                    &:last-child {
                        border-bottom: none;
                    }

                    .el-tag {
                        --el-tag-text-color: #fff;
                        --el-tag-border-color: transparent;
                        flex: 0 0 46px;
                    }
                }
            }
        }
    }
}
</style>