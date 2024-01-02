<template>
    <div class="setting">
        <ft-space justify="space-between">
            <div class="label">许愿次数</div>
            <input class="input" type="text" v-model="form.wishCount" @blur="validateWishCount(); save();">
        </ft-space>
    </div>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from "vue"
import Storage from 'storage'

const props = defineProps<{
    kind: string
}>()
const emit = defineEmits<{
    (name: 'update'): void
}>()
const form = ref({
    wishCount: 10
})

watch(computed(() => props.kind), () => {
    init();
})

function stringToHashId(str: string) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
        hash = hash & hash
    }
    return (hash >>> 0).toString(36)
}

function init() {
    const id = stringToHashId(props.kind)
    const data = Storage.get(`setting_${id}`) as string;
    if (data) {
        const config = JSON.parse(data)
        form.value = config;
    }
}

function save() {
    const id = stringToHashId(props.kind)
    Storage.set(`setting_${id}`, JSON.stringify(form.value))
}

function validateWishCount() {
    form.value.wishCount = parseInt(`${form.value.wishCount}`) || 10
    if (form.value.wishCount < 2) {
        form.value.wishCount = 2
    } else if (form.value.wishCount > 10) {
        form.value.wishCount = 10
    }
}

init();
</script>
<style lang="scss" scoped>
.setting {
    >* {
        border-top: 1px solid #dadada;
        padding: 10px 20px;

        &:hover {
            background-color: #14120f13;
        }

        .label {
            color: #292727;
            font-weight: bold;
        }

        .input {
            width: 100px;
            border-radius: 50px;
            border: 2px solid #beaf83;
            padding: 0 10px;
            height: 30px;
            font-size: 12px;
            text-align: center;

            &:focus {
                outline: none;
                border-color: #a49464;
                box-shadow: 0 0 4px rgba(0, 0, 0, .2);
            }
        }
    }
}
</style>