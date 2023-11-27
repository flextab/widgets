<template>
    <div class="stock-chart" ref="rootEl" @mousemove="updateMousePosition" @mouseenter="updateMousePosition"
        @mouseleave="updateMousePosition">
        <div class="svg-box" v-html="svg"></div>
        <img class="cross-axis" :src="feedbackSvg" v-if="feedbackSvg" />
    </div>
    <el-popover v-model:visible="showPopover" ref="popoverRef" :virtual-ref="popoverVirtualRef" trigger="click"
        virtual-triggering placement="top-start" :show-arrow="false" :teleported="false" popper-class="stock-pop-box"
        v-if="stockInfo.length">
        <ft-space vertical class="stock-info">
            <ft-space v-for="item of stockInfo" justify="space-between">
                <div>{{ item.label }}</div>
                <div :style="{ color: item.color }">{{ item.value }}</div>
            </ft-space>
        </ft-space>
    </el-popover>
</template>
<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { Chart } from './libs/chart.js'
import dayjs from "dayjs";
import { Stock } from "./libs/stock";
const { UP_COLOR, DOWN_COLOR } = Stock

const props = defineProps<{
    data: string[];
    type: 1 | 5 | 15 | 30 | 60 | 101 | 102 | 103
    /**昨日开盘价 */
    price: string
    /**昨日收盘价 */
    yeasterdayClosePrice: string;
    isKLine: boolean
}>()
const rootEl = ref<HTMLElement>()
const showPopover = ref(false)
const popoverVirtualRef = ref({
    rect: {} as DOMRect,
    getBoundingClientRect() {
        return this.rect;
    }
})
const svg = ref<string>()
const feedbackSvg = ref<string>()
const stockIndex = ref<number>()
const stockInfo = computed<{
    label: string
    value: string | number
    color?: string
}[]>(() => {
    const info = priceList.value[stockIndex.value!]
    if (info) {
        const closePrice = priceList.value[stockIndex.value! - 1]?.closePrice || +props.yeasterdayClosePrice
        const updown = +Number(+info.closePrice - closePrice).toFixed(2);
        const updwonRate = Number((updown / closePrice * 100).toFixed(2))
        const prefix = updown > 0 ? '+' : ''
        const color = updown > 0 ? UP_COLOR : DOWN_COLOR
        if (Stock.formatNumber(info.amount) === 'NaN') {
            debugger
        }
        let extraInfos: any = [];
        if (props.isKLine) {
            const i = stockIndex.value || 0
            const ma5 = +calcAvg(priceList.value.slice((i - 5) < 0 ? 0 : i - 5, i + 1).map(v => v.closePrice)).toFixed(2)
            const ma10 = +calcAvg(priceList.value.slice((i - 10) < 0 ? 0 : i - 10, i + 1).map(v => v.closePrice)).toFixed(2)
            const ma20 = +calcAvg(priceList.value.slice((i - 20) < 0 ? 0 : i - 20, i + 1).map(v => v.closePrice)).toFixed(2)
            extraInfos = [
                { label: 'MA5', value: ma5, color: "#FAA90E" },
                { label: 'MA10', value: ma10, color: "#FF6600" },
                { label: 'MA20', value: ma20, color: "#416DF9" },
            ]
        }
        return [
            { label: '时间', value: dayjs(info.date).format('MM-DD HH:mm') },
            { label: '开盘', value: info.price, color: info.price > closePrice ? UP_COLOR : DOWN_COLOR },
            { label: '收盘', value: info.closePrice, color: info.closePrice > closePrice ? UP_COLOR : DOWN_COLOR },
            { label: '最高', value: info.highPrice, color: info.highPrice > closePrice ? UP_COLOR : DOWN_COLOR },
            { label: '最低', value: info.lowPrice, color: info.lowPrice > closePrice ? UP_COLOR : DOWN_COLOR },
            { label: '涨跌额', value: prefix + updown, color },
            { label: '涨跌幅', value: prefix + updwonRate + '%', color },
            { label: '成交量', value: Stock.formatNumber(info.quantity) },
            { label: '成交额', value: Stock.formatNumber(info.amount) },
            ...extraInfos,
        ]
    } else {
        return []
    }
})
const chartDataTotal = computed(() => {
    return props.type === 1 && props.data.length < 200 ? 300 : props.data.length;
})
const priceList = computed(() => {
    return props.data.map(p => {
        // 时间,开盘,收盘,最高,最低,成交量,成交额
        const [date, price, closePrice, highPrice, lowPrice, quantity, amount] = p.split(',')
        return {
            date,
            price: +price,
            highPrice: +highPrice,
            lowPrice: +lowPrice,
            closePrice: +closePrice,
            quantity: +quantity,
            amount: +amount
        }
    })
})
const rootElRect = ref<DOMRect>()
const quantityHeight = ref(100)
const minPrice = computed(() => Math.min(...priceList.value.map(a => a.lowPrice)))
const maxPrice = computed(() => Math.max(...priceList.value.map(a => a.highPrice)))
const minQuantify = computed(() => Math.min(...priceList.value.map(a => a.quantity)))
const maxQuantify = computed(() => Math.max(...priceList.value.map(a => a.quantity)))
const chartOptions = computed(() => {
    if (!(rootElRect.value && rootElRect.value?.width && rootElRect.value?.height && priceList.value?.length)) {
        return
    }
    const gap = rootElRect.value.width / (chartDataTotal.value * 5)
    const xDelta = (rootElRect.value.width - (gap * chartDataTotal.value)) / chartDataTotal.value;
    return {
        width: rootElRect.value!.width,
        height: rootElRect.value!.height,
        data: {
            yData: [],
            contents: [
                ...props.isKLine ? [] : [{
                    type: 'line',
                    name: 'price',
                    data: priceList.value.map((p, i) => {
                        return {
                            x: xDelta / 2 + i * xDelta + i * gap,
                            y: calcY(p.price),
                        };
                    }),
                    color: "#416df9",
                    fillStartColor: "rgba(78, 110, 242, .2)",
                    fillEndColor: "rgba(255, 255, 255, 0)",
                    fillId: "price",
                    isFill: true,
                    isEndPoint: false,
                    yEndPoint: rootElRect.value!.height,
                }],
                ...!props.isKLine ? [] : [{
                    type: 'line',
                    name: 'ma5',
                    data: priceList.value.map((p, i, arr) => {
                        return {
                            x: xDelta / 2 + i * xDelta + i * gap,
                            y: calcAvgY(arr.slice(i - 5 < 0 ? 0 : i - 5, i + 1).map(p => p.closePrice)),
                        }
                    }),
                    color: "#FAA90E"
                },
                {
                    type: 'line',
                    name: 'ma10',
                    data: priceList.value.map((p, i, arr) => {
                        return {
                            x: xDelta / 2 + i * xDelta + i * gap,
                            y: calcAvgY(arr.slice(i - 10 < 0 ? 0 : i - 10, i + 1).map(p => p.closePrice)),
                        }
                    }),
                    color: "#FF6600"
                },
                {
                    type: 'line',
                    name: 'ma20',
                    data: priceList.value.map((p, i, arr) => {
                        return {
                            x: xDelta / 2 + i * xDelta + i * gap,
                            y: calcAvgY(arr.slice(i - 20 < 0 ? 0 : i - 20, i + 1).map(p => p.closePrice)),
                        }
                    }),
                    color: "#416DF9"
                },
                {
                    type: 'candle',
                    name: 'candle',
                    data: priceList.value.map((p, i) => {
                        return {
                            candleWidth: xDelta,
                            lineWidth: 1,
                            x: xDelta / 2 + i * xDelta + i * gap,
                            lineY: {
                                start: calcY(p.highPrice),
                                end: calcY(p.lowPrice),
                            },
                            candleY: {
                                start: calcY(p.price),
                                end: calcY(p.closePrice),
                            },
                            color: p.closePrice > p.price ? UP_COLOR : DOWN_COLOR,
                        }
                    })
                }],
                {
                    type: 'barGraph',
                    name: 'quantity',
                    data: priceList.value.map((p, i) => {
                        return {
                            width: xDelta,
                            x: xDelta / 2 + i * xDelta + i * gap,
                            y: {
                                start: rootElRect.value?.height,
                                end: calcQuantityY(p.quantity),
                            },
                            color: p.closePrice > p.price ? UP_COLOR : DOWN_COLOR,
                        }
                    })
                }
            ]
        }
    }
})
let chartInstance: InstanceType<typeof Chart>
let ob = new ResizeObserver(() => {
    const rect = rootEl.value?.getBoundingClientRect()
    rootElRect.value = rect;
})

watch(computed(() => props.data), init)
watch(chartOptions, init)

function init() {
    if (!chartInstance) {
        chartInstance = new Chart({
            feedbackCallback: (e: any) => {
                showPopover.value = e.show;
                if (!e.show) {
                    feedbackSvg.value = ''
                    return;
                }
                let x = e.x, y = e.y;
                const lines = chartOptions.value?.data.contents[0].data;
                if (lines?.length && lines[e.index]) {
                    x = lines[e.index].x
                }
                stockIndex.value = e.index;
                popoverVirtualRef.value.rect = DOMRect.fromRect({
                    x: (rootElRect.value?.left || 0) + x,
                    y: (rootElRect.value?.top || 0) + y,
                    width: 0,
                    height: 0
                })
                feedbackSvg.value = (<any>chartInstance).getFeedBackSvgImg({
                    x: x,
                    y: y,
                    tipCircles: [],
                })
            }
        })
    }
    if (rootEl.value && chartOptions.value) {
        nextTick(() => {
            chartInstance.setOptions(chartOptions.value);
            (<any>chartInstance).draw()
            svg.value = (<any>chartInstance).getSvgStr()
        })
    }
}

function calcY(target: number) {
    return (maxPrice.value - target) * (rootElRect.value!.height - quantityHeight.value) / (maxPrice.value - minPrice.value)
}

function calcQuantityY(target: number) {
    return (maxQuantify.value - target) * (quantityHeight.value) / (maxQuantify.value - minQuantify.value) + (rootElRect.value!.height - quantityHeight.value);
}

function calcAvg(arr: number[]) {
    return arr.reduce((a, b) => a + b, 0) / arr.length
}

function calcAvgY(arr: number[]) {
    return calcY(calcAvg(arr))
}

function updateMousePosition(e: any) {
    chartInstance.feedbackEvent(e, chartDataTotal.value);
}

onMounted(() => {
    ob.observe(rootEl.value!)
    const rect = rootEl.value?.getBoundingClientRect()
    rootElRect.value = rect;
    init();
})
onBeforeUnmount(() => {
    ob.disconnect()
})
</script>
<style lang="scss" scoped>
.stock-chart {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;

    .svg-box {
        width: 100%;
        height: 100%;
    }

    .cross-axis {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        pointer-events: none;
    }

}
</style>
<style lang="scss">
.stock-pop-box {
    --el-bg-color-overlay: rgba(255, 255, 255, .8);
    --el-border-color-light: transparent;
    --el-popover-padding: 5px;
    pointer-events: none;

    .stock-info {
        font-size: 12px;
        line-height: 2;
        z-index: 2;
    }
}
</style>