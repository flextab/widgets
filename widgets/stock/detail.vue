<template>
    <el-container class="stock-container" :class="{ up: Number(stock?.updown) > 0, down: Number(stock?.updown) < 0 }">
        <el-header>
            <ft-space vertical :gap="20">
                <ft-space justify="space-between" align="flex-start">
                    <ft-space vertical :gap="6">
                        <div class="stock-name">{{ stock?.name }}</div>
                        <div class="stock-code">{{ stock?.code }}</div>
                    </ft-space>
                    <ft-space :gap="10" align="baseline">
                        <div class="stock-price">{{ stock?.tradeMoney }}</div>
                        <div class="stock-updown">
                            <span v-if="stock && stock?.updown > 0">+</span>
                            <span>{{ stock?.updown }}</span>
                        </div>
                        <div class="stock-updown-rate">
                            <span v-if="stock && stock?.updown > 0">+</span>
                            <span>{{ stock?.updownRate }}</span>
                        </div>
                    </ft-space>
                </ft-space>
                <ft-space :gap="10" v-if="stock">
                    <el-check-tag :checked="stock && tab.value === stock?.kLineType && tab.size === stock.kLinePageSize"
                        v-for="tab of tabs" @click="chooseKLineType(tab)">{{
                            tab.name
                        }}</el-check-tag>
                </ft-space>
            </ft-space>
        </el-header>
        <el-main class="stock-chart-container">
            <stock-chart :data="stock?.getKLineData()" :type="stock?.kLineType" :is-k-line="currentTab.isKLine"
                :price="stock?.openPrice" :yeasterday-close-price="stock?.yeasterdayClosePrice"></stock-chart>
        </el-main>
        <el-footer>
            <div class="stock-footer" :gap="16">
                <ft-space v-for="item of footerInfo" justify="space-between">
                    <div>{{ item.label }}</div>
                    <div :class="[item.color || '']">{{ item.value }}</div>
                </ft-space>
            </div>
        </el-footer>
    </el-container>
</template>
<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, watch } from "vue"
import { Stock } from "./libs/stock";
import StockChart from './chart.vue'

const props = defineProps<{
    id: string;
}>()
const stock = ref<Stock>()
const intervalId = setInterval(() => {
    if (stock.value?.update) {
        stock.value.update()
    }
}, 10 * 1000)

watch(computed(() => props.id), init)

function init() {
    stock.value = new Stock({
        id: props.id,
        enableKline: true,
    })
    stock.value.update()
}

const tabs = ref([
    { name: '分时', value: 1, size: 100000, isKLine: false },
    { name: '5日', value: 5, size: 60, isKLine: false },
    { name: '日K', value: 101, size: 60, isKLine: true },
    { name: '周K', value: 102, size: 60, isKLine: true },
    { name: '月K', value: 103, size: 60, isKLine: true },
    { name: '年', value: 101, size: 250, isKLine: false },
])
const tabIndex = ref(0)
const currentTab = computed(() => tabs.value[tabIndex.value])
const footerInfo = computed(() => {
    const getClass = (isDown: boolean) => isDown ? 'down' : 'up'
    const isDown = Number(stock.value?.updown) < 0
    const prefix = isDown ? '' : '+'
    return [
        { label: '今开', value: stock.value?.openPrice, color: getClass(Number(stock.value?.openPrice) < Number(stock.value?.tradeHigherMoney)) },
        { label: '最高', value: stock.value?.tradeHigherMoney, color: getClass(isDown) },
        { label: '成交量', value: stock.value?.tradeAmount },
        { label: '昨收', value: stock.value?.yeasterdayClosePrice },
        { label: '最低', value: stock.value?.tradeLowerMoney, color: 'down' },
        { label: '成交额', value: stock.value?.tradeMoneyAmount },
        { label: '振幅', value: stock.value?.shakeRate },
        { label: '涨跌额', value: prefix + stock.value?.updown, color: getClass(isDown) },
        { label: '涨跌幅', value: prefix + stock.value?.updownRate, color: getClass(isDown) },
        { label: '52周高', value: stock.value?.week52High },
        { label: '52周低', value: stock.value?.week52Low },
        { label: '量比', value: stock.value?.amountRate },
    ]
})

function chooseKLineType(tab: { value: number, size: number }) {
    if (stock.value) {
        tabIndex.value = tabs.value.indexOf(tab as any);
        stock.value.kLineType = tab.value as any
        stock.value.kLinePageSize = tab.size
        stock.value.update()
    }

}

init();

onBeforeUnmount(() => {
    clearInterval(intervalId)
})
</script>
<style lang="scss" scoped>
.el-footer,
.el-header,
.el-main {
    padding: 0;
}

.el-container {
    height: 100%;
    gap: 10px;
}

.stock-container {
    padding: 0 10px 10px 0;

    &.down {
        --color: v-bind('Stock.DOWN_COLOR');
    }

    &.up {
        --color: v-bind('Stock.UP_COLOR');
    }

    .stock-name {
        font-size: 28px;
        color: #4d4d4d;
        font-weight: bold;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 300px;
    }

    .stock-code {
        font-size: 16px;
        color: var(--el-text-color-secondary);
    }

    .stock-price {
        font-size: 28px;
        color: var(--color);
    }

    .stock-updown {
        font-size: 16px;
        color: var(--color);
    }

    .stock-updown-rate {
        font-size: 16px;
        color: var(--color);
    }

    .stock-chart-container {
        padding: 20px 0;
    }

    .stock-footer {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 4px 20px;
        width: 100%;
        font-size: 14px;

        >div {
            padding: 0 20px;

            >div:first-child {
                color: var(--el-text-color-secondary);
            }

            >div:last-child {
                color: #000;

                &.up {
                    color: v-bind('Stock.UP_COLOR');
                }

                &.down {
                    color: v-bind('Stock.DOWN_COLOR');
                }
            }
        }
    }
}
</style>