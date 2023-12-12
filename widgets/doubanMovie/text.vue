<template>
    <div class="today-text" :title="movie?.comment" @click="openDialog('/view.vue')">
        {{ movie?.comment || '' }}
    </div>
</template>
<script lang="ts" setup>
import { ref } from "vue"
import { DoubanData, getToday } from './libs/douban'
import { openDialog } from 'widget'

const movie = ref<DoubanData>()

async function init() {
    movie.value = await getToday()
}

init()
</script>
<style lang="scss" scoped>
.today-text {
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    max-width: 80vw;
    margin: 0 auto;
    cursor: pointer;
}
</style>