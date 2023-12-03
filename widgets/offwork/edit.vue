<template>
    <el-container>
        <el-main>
            <el-form class="offwork-edit-form" label-width="100px" require-asterisk-position="right" ref="formEl"
                :model="form">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="form.title" placeholder="下班倒计时"></el-input>
                </el-form-item>
                <el-form-item label="上班时间" prop="type" :rules="{ required: true, validator: checkWorkTime }">
                    <el-time-picker v-model="workTime" is-range range-separator="至" start-placeholder="上班时间"
                        end-placeholder="下班时间" @update:model-value="updateWorkTime" />
                    <span class="ft-input-error">请选择上班时间</span>
                </el-form-item>
                <el-form-item label="工作日类型" prop="type" required>
                    <el-select v-model="form.type">
                        <el-option v-for="item of types" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="hide-error" v-if="!showMore">
                    <el-link type="primary" @click="showMore = !showMore">更多设置</el-link>
                </el-form-item>
                <template v-if="showMore">
                    <el-form-item label="上班图片" prop="image">
                        <ft-upload-image v-model="form.image"></ft-upload-image>
                    </el-form-item>
                    <el-form-item label="下班图片" prop="workImage">
                        <ft-upload-image v-model="form.workImage"></ft-upload-image>
                    </el-form-item>
                </template>
            </el-form>
        </el-main>
        <el-footer>
            <ft-space justify="flex-end">
                <el-button @click="close()">取消</el-button>
                <el-button type="primary" @click="confirm()">保存</el-button>
            </ft-space>
        </el-footer>
    </el-container>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { OffWorkConfig, OffWorkType, OffWorkStatus } from './libs/offwork';
import { exitDialog } from 'widget'
import dayjs from 'dayjs'

const types = ref([
    { label: '依法定工作', value: OffWorkType.Official },
    { label: '依周末双休', value: OffWorkType.WeekendBreak },
    { label: '悲惨单休', value: OffWorkType.SingleDayOff },
])
const form = ref<OffWorkConfig>({
    start: '09:00',
    end: '18:00',
    type: OffWorkType.Official
} as OffWorkConfig)
const formEl = ref()
const showMore = ref(false)
const workTime = ref([new Date().setHours(9, 0, 0), new Date().setHours(18, 0, 0)])

function init() {
    const config = OffWorkStatus.getConfig()
    form.value = config
    if (form.value.image || form.value.workImage) {
        showMore.value = true
    }
    const start = config.start.split(':').map(a => parseInt(a))
    const end = config.end.split(':').map(a => parseInt(a))
    workTime.value = [new Date().setHours(start[0], start[1], 0), new Date().setHours(end[0], end[1], 0)]
}

function checkWorkTime(rule: any, value: any, cb: any) {
    if (form.value.start && form.value.end) {
        cb()
    } else {
        cb(Error())
    }
}

function updateWorkTime() {
    if (workTime.value === null) {
        form.value.start = ''
        form.value.end = ''
        return;
    }
    form.value.start = dayjs(workTime.value[0]).format('HH:mm')
    form.value.end = dayjs(workTime.value[1]).format('HH:mm')
}

function close() {
    exitDialog()
}

async function confirm() {
    await formEl.value.validate()
    OffWorkStatus.setConfig(form.value)
    close()
}

init()
</script>
<style lang="scss" scoped>
.el-main,
.el-footer {
    padding: 0;
}

.el-footer {
    padding: 10px;
}

.offwork-edit-form {
    width: 500px;
    height: 420px;
    padding: 10px 10px;

    :deep(.el-date-editor) {
        input {
            pointer-events: none;
        }
    }
}
</style>