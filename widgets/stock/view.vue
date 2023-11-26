<template>
    <div class="stock-view-widget" ref="rootEl">
        <el-container class="stock-container">
            <el-aside class="stock-aside">
                <el-container>
                    <el-header class="stock-header-container">
                        <el-input v-model="keywords" placeholder="股票/代码" @input="debounceSearch()" tabindex="0"></el-input>
                        <ft-space class="stock-header" justify="space-between" v-if="!keywords">
                            <div>关注列表</div>
                            <el-link type="primary" @click="showEdit = !showEdit">
                                <ft-icon name="EditPen" v-if="!showEdit" title="编辑"></ft-icon>
                                <ft-icon name="Select" v-else title="完成"></ft-icon>
                            </el-link>
                        </ft-space>
                        <ft-space class="stock-header" justify="space-between" v-else>
                            <div>搜索列表</div>
                            <el-link type="primary" @click="closeSearch">
                                <ft-icon name="CircleCloseFilled"></ft-icon>
                            </el-link>
                        </ft-space>
                    </el-header>
                    <el-main>
                        <ft-space vertical :gap="4" class="stock-list" tabindex="1">
                            <ft-space class="stock-card" :class="{ active: i === index, up: stock.up, down: !stock.up }"
                                v-for="stock, i of list" fill justify="space-between" :gap="10"
                                @click="selectStock(stock, i)" :key="stock.id">
                                <ft-space vertical class="stock-info">
                                    <div class="stock-name">{{ stock.name }}</div>
                                    <ft-space :gap="10">
                                        <div class="stock-code">{{ stock.code }}</div>
                                        <el-text class="stock-type">{{ stock.typeName }}</el-text>
                                    </ft-space>
                                </ft-space>
                                <ft-space :gap="10">
                                    <ft-space vertical align="flex-end">
                                        <div class="stock-price">{{ stock.price || 12 }}</div>
                                        <div class="stock-updown">{{ stock.updownRate || '+20%' }}</div>
                                    </ft-space>
                                    <el-link type="primary" @click="addStock(stock)" v-if="canAddStock(stock)">
                                        <ft-icon name="CirclePlusFilled" :size="16"></ft-icon>
                                    </el-link>
                                    <el-link type="primary" @click="removeStock(stock)" v-if="canRemoveStock(stock)">
                                        <ft-icon name="RemoveFilled" :size="16"></ft-icon>
                                    </el-link>
                                </ft-space>
                            </ft-space>
                        </ft-space>
                    </el-main>
                </el-container>
            </el-aside>
            <el-main>
                <stock-detail :id="currentStock.id" v-if="currentStock"></stock-detail>
            </el-main>
        </el-container>
    </div>
</template>
<script lang="ts" setup>
import { computed, nextTick, onBeforeMount, onMounted, ref } from "vue"
import { Stock } from "./libs/stock";
import { store, StockInfo } from "./libs/store";
import StockChart from './chart.vue'
import StockDetail from './detail.vue'
import { setPageTitle } from 'widget'
import Sortable from 'sortablejs'

setPageTitle('')

interface StockPriceInfo {
    price?: string
    updownRate?: string
    up?: boolean
}

const keywords = ref('')
const searchList = ref<(StockInfo & StockPriceInfo)[]>([])
const stockList = ref<(StockInfo & StockPriceInfo)[]>(store.list)
const index = ref(0)
const showSearchDetail = ref(false)
const currentStock = computed(() => {
    return showSearchDetail.value ? searchList.value[index.value] : stockList.value[index.value]
})
const list = computed(() => {
    return keywords.value ? searchList.value : stockList.value;
})
const showEdit = ref(false)
const sortableInstance = ref<Sortable>()
const rootEl = ref<HTMLDivElement>()

getPriceInfo()

async function getPriceInfo() {
    if (stockList.value.length) {
        const infoList = await Stock.getInfoList(stockList.value.map(a => a.id))
        stockList.value.map((stock, i) => {
            Object.assign(stock, infoList[i]);
        })
    }
}

function closeSearch() {
    keywords.value = ''
    searchList.value.length = 0
    showSearchDetail.value = false
    index.value = 0
    nextTick(() => {
        setSortable()
    })
}

function canAddStock(stock: StockInfo) {
    if (keywords.value && !stockList.value.some(s => s.id === stock.id)) {
        return true;
    } else {
        return false;
    }
}

function canRemoveStock(stock: StockInfo) {
    if (!keywords.value && showEdit.value && stockList.value.some(s => s.id === stock.id)) {
        return true;
    } else {
        return false;
    }
}

function save() {
    store.list = stockList.value.map(({ name, code, id,
        type, typeName, market, marketType }) => {
        return { name, code, id, type, typeName, market, marketType }
    })
}

function addStock(stock: StockInfo) {
    stockList.value.push(stock)
    save()
}

function removeStock(stock: StockInfo) {
    stockList.value = stockList.value.filter(s => s.id !== stock.id)
    save()
}

function debounce(fn: Function, delay: number) {
    let timer: any = null
    return function (...args: any[]) {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn(...args)
        }, delay)
    }
}

function selectStock(e: StockInfo, i: number) {
    index.value = i
    showSearchDetail.value = searchList.value.includes(e)
}

function querySearch() {
    if (!keywords.value) {
        searchList.value = []
        return
    }
    const name = `stock_cb_${Date.now()}`;
    (<any>window)[name] = async (data: any) => {
        delete (<any>window)[name];
        if (keywords.value === keywords.value && data.QuotationCodeTable.Data) {
            const infos = await Stock.getInfoList(data.QuotationCodeTable.Data.map((a: any) => a.QuoteID))
            searchList.value = data.QuotationCodeTable.Data.map((item: any, i: number) => {
                return {
                    code: item.Code,
                    name: item.Name,
                    id: item.QuoteID,
                    marketType: item.MarketType,
                    market: item.MktNum,
                    type: item.SecurityType,
                    typeName: item.SecurityTypeName,
                    ...infos[i],
                }
            })
        } else {
            searchList.value = []
        }
    }
    const url = `https://searchadapter.eastmoney.com/api/suggest/get?${new URLSearchParams({
        type: '14',
        input: keywords.value,
        token: 'D43BF722C8E33BDC906FB84D85E326E8',
        count: '8',
        cb: name,
    })}`
    const script = document.createElement('script')
    script.src = url;
    script.onerror = () => {
        delete (<any>window)[name];
        searchList.value = []
    }
    document.body.append(script)
}

function setSortable() {
    if (sortableInstance.value) {
        sortableInstance.value.destroy()
    }
    if (rootEl.value) {
        const cards = (<HTMLElement>rootEl.value!).querySelector('.stock-list')! as HTMLDivElement;
        sortableInstance.value = new Sortable(cards, {
            group: 'stock',
            sort: true,
            animation: 180,
            delay: 0,
            onEnd: e => {
                const data = stockList.value.splice(e.oldIndex!, 1)[0]
                stockList.value.splice(e.newIndex!, 0, data)
                save()
            }
        })
    }
}

const debounceSearch = debounce(querySearch, 500)

onMounted(() => {
    setSortable()
})

onBeforeMount(() => {
    if (sortableInstance.value) {
        sortableInstance.value.destroy()
    }
})
</script>
<style lang="scss">
:host([fullscreen]) {
    height: 100%;

    .stock-view-widget {
        width: 100%;
        height: 100%;
    }
}
</style>
<style lang="scss" scoped>
.stock-view-widget {
    padding: 40px 10px 10px 10px;
    width: 1000px;
    height: 650px;

    .el-footer,
    .el-header,
    .el-main {
        padding: 0;
    }

    .stock-aside {
        width: 200px;

        >.el-container {
            height: 100%;
        }

        .stock-header {
            padding: 14px 0 4px 0;
        }
    }

    .stock-container {
        height: 100%;
        gap: 10px;

        .stock-header-container {
            padding: 0 10px;
            font-size: 12px;
            color: #aaa;
        }
    }

    .stock-list {
        height: 100%;
        position: relative;
    }

    .stock-card {
        --color: v-bind('Stock.UP_COLOR');
        font-size: 14px;
        padding: 6px 10px;
        border-radius: 10px;
        line-height: 1.5;
        cursor: pointer;

        &.up {
            --color: v-bind('Stock.UP_COLOR');
        }

        &.down {
            --color: v-bind('Stock.DOWN_COLOR');
        }

        &:hover,
        &.active {
            background-color: #ededed;
        }

        .stock-info {
            overflow: hidden;
        }

        .stock-name {
            font-size: 16px;
            font-weight: bold;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .stock-code {
            font-size: 12px;
        }

        .stock-type {
            font-size: 12px;
        }

        .stock-price {
            font-weight: bold;
        }

        .stock-updown {
            background-color: var(--color);
            color: #fff;
            font-size: 10px;
            padding: 2px 4px;
            border-radius: 6px;
        }
    }
}
</style>