<template>
    <div class="douban-movie-calendar" v-if="movie" @click="openDialog('/view.vue')">
        <Image :src="img" :link="movie.link" v-if="movie.link" />
        <div class="brief">
            <div class="brief-content">
                <ft-space vertical class="date-info">
                    <span class="day">{{ date.d }}</span>
                    <span class="month">{{ date.m }}</span>
                </ft-space>
                <ft-space vertical class="brief-info" justify="space-between" align="stretch">
                    <ft-space>
                        <span>《</span>
                        <span class="title">{{ movie.title }}</span>
                        <span>》</span>
                        <span v-if="movie.rating" class="rating">豆瓣评分{{ movie.rating }}</span>
                    </ft-space>
                    <span class="comment">{{ movie.comment }}</span>
                    <span class="tip">{{ movie.tip }}</span>
                </ft-space>
            </div>
        </div>
    </div>
    <div v-else class="cover">
        <img :src="coverImage">
        <div class="tip">请稍后...</div>
    </div>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, ref } from "vue"
import { DoubanData, getToday } from './libs/douban'
import dayjs from 'dayjs'
import { openDialog } from "widget";
import coverImage from './cover.jpg'
import Image from './img.vue';

const movie = ref<DoubanData>()
const img = ref('')
const date = ref({
    d: dayjs().format('DD'),
    m: dayjs().format('MMMM').substring(0, 2) + dayjs().format(' | dddd')
})

async function init() {
    movie.value = await getToday()
    img.value = movie.value!.image!.replace("s_ratio_poster", "l")
}

init()

onBeforeUnmount(() => {
    try {
        URL.revokeObjectURL(img.value)
    } catch (error) {

    }
})
</script>
<style lang="scss" scoped>
.cover {
    width: 100%;
    height: 100%;

    >img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .tip {
        position: absolute;
        width: 4em;
        top: 0;
        height: 1em;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        color: #fff;
        text-shadow: 0 0 1px #000;
        opacity: .4;
    }
}

.douban-movie-calendar {
    width: 100%;
    height: 100%;
    cursor: pointer;

    >::v-deep(img) {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center top;
    }

    .brief {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .3);
        display: flex;
        align-items: flex-end;
        color: #fff;
        text-shadow: 0 0 1px #000;
        width: 100%;


        .brief-content {
            padding: 0 10px 10px 10px;
            display: flex;
            align-items: stretch;
            width: 100%;
            gap: 10px;

            .date-info {
                flex: 0 0 70px;

                .day {
                    font-size: 60px;
                }

                .month {
                    font-size: 12px;
                }

            }

            .brief-info {
                flex: auto;
                padding-top: 10px;
                overflow: hidden;

                .title {
                    display: inline-block;
                    max-width: 120px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .rating {
                    background-color: #fbb84d;
                    border-radius: 20px;
                    font-size: 12px;
                    padding: 0 6px;
                    color: #4b2610;
                    text-shadow: 0 0 1px #df9e41;
                    box-shadow: 0 0 2px rgba(0, 0, 0, .2);
                }

                .comment {
                    display: inline-block;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .tip {
                    font-size: 12px;
                    text-align: right;
                }
            }

        }
    }
}
</style>