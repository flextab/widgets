<template>
    <ft-space class="stock-widget" vertical :gap="20" :class="{
        'state-up': Number(stock?.updown) > 0,
        'state-down': Number(stock?.updown) <= 0
    }">
        <ft-space justify="space-between">
            <ft-space vertical :gap="4">
                <div class="stock-name">{{ stock?.name }}</div>
                <div class="stock-code">{{ stock?.code }}</div>
            </ft-space>
            <ft-space vertical justify-content="end" :gap="4">
                <div class="stock-updown">{{ stock?.updown }}</div>
                <div class="stock-updown-precent">{{ stock?.updownRate }}</div>
            </ft-space>
        </ft-space>
        <ft-space class="stock-chart">
            <div v-html="stock?.getTrendsChart()"></div>
        </ft-space>
        <div class="stock-trade-money">{{ stock?.tradeMoney }}</div>
    </ft-space>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from "vue"
import { Stock } from "./libs/stock";
import { store } from "./libs/store";
import { openDialog } from 'widget'
import Storage from "storage";
const { UP_COLOR, DOWN_COLOR } = Stock

const stock = ref<Stock>()
const svg = ref('')

function init() {
    if (store.list.length && store.list[0].id !== stock.value?.id) {
        stock.value = new Stock({
            id: store.list[0].id
        })
        stock.value.update()
    }
}

let interval = setInterval(() => {
    if (stock.value) {
        stock.value.update()
    }
}, 10 * 1000)

init()

onMounted(() => {
    Storage.on('stock_list', init)
})

onBeforeUnmount(() => {
    Storage.off('stock_list', init)
    clearInterval(interval)
})
</script>
<style lang="scss" scoped>
.stock-widget {
    background-color: #fff;
    width: 100%;
    height: 100%;
    padding: 10px;
    user-select: none;
    cursor: pointer;

    .stock-name {
        font-size: 18px;
        font-weight: bold;
    }

    .stock-code {
        font-size: 12px;
        color: var(--el-text-color-secondary);
    }

    .stock-updown {
        font-size: 16px;
        font-weight: bold;
    }

    .stock-updown-precent {
        font-size: 16px;
        font-weight: bold;
    }

    &.state-up {

        .stock-updown,
        .stock-updown-precent {
            color: v-bind('UP_COLOR');
        }
    }

    &.state-down {

        .stock-updown,
        .stock-updown-precent {
            color: v-bind('DOWN_COLOR');
        }
    }

    .stock-chart {
        width: 100%;
        height: 50%;
    }

    .stock-trade-money {
        font-size: 32px;
        font-weight: bold;
        position: absolute;
        width: 100%;
        bottom: 30px;
        text-align: center;
        left: 0;
    }
}
</style>