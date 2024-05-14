<template>
    <div class="douban-movie-page no-scrollbar" tabindex="0">
        <div v-if="!movie" class="cover">
            <img :src="coverImage" referrerpolicy="no-referrer">
            <div class="tip">请稍后...</div>
        </div>
        <div class="today" v-if="movie">
            <Image :src="img" :link="movie.link" v-if="img && movie.link" />
            <div class="brief" tabindex="0">
                <ft-space class="img" vertical align="center" :gap="40">
                    <Image :src="img" :link="movie.link" v-if="img && movie.link" />
                    <ft-space :gap="4" class="detail-btn" @click="openDouban" title="打开豆瓣详情">
                        <span>豆瓣详情</span>
                        <ft-icon name="Right"></ft-icon>
                    </ft-space>
                </ft-space>
                <div class="brief-content">
                    <div class="title">
                        <span>《</span>
                        <span>{{ movie?.title }}</span>
                        <span>》</span>
                    </div>
                    <div class="rate">
                        <el-rate :model-value="Number(parseFloat(movie?.rating || '0') / 10 * 5).toFixed(1)" :max="5"
                            disabled show-score text-color="#ff9900" :score-template="` ${movie?.rating} 分`" />
                    </div>
                    <div class="extra">
                        <div class="extra-item" v-for="item of movie?.extra">{{ item }}</div>
                    </div>
                    <div class="comment">
                        {{ movie?.comment }}
                    </div>
                    <div class="description">
                        {{ movie?.description }}
                    </div>
                </div>
            </div>
            <ft-icon class="down" name="ArrowDown" :size="40" color="#fbb84d"
                @click="moreMovieEl?.scrollIntoView({ behavior: 'smooth' })" title="向下滚动"
                v-if="nearMovies.length"></ft-icon>
        </div>
        <div class="more-movie" ref="moreMovieEl" v-if="nearMovies.length">
            <div class="movie-item" v-for="m of nearMovies">
                <ft-space class="date" vertical align="center" justify="center" :gap="10">
                    <div class="day">{{ dayjs(m.date).format('DD') }}</div>
                    <div class="month">
                        <span>{{ dayjs(m.date).format('MMMM').substring(0, 2) }}</span>
                        <span> | </span>
                        <span>周{{ dayjs(m.date).format('dd') }}</span>
                    </div>
                </ft-space>
                <Image :src="m.image" :link="m.link" v-if="m.image && m.link" />
                <div class="movie-info">
                    <div class="title">{{ m.title }}</div>
                    <div class="year">{{ m.extra?.[4] }}</div>
                    <div class="director">{{ m.extra?.[0] }}</div>
                    <div class="comment">
                        <div>{{ m.comment }}</div>
                    </div>
                    <div>
                        <ft-space class="go-detail" :gap="4">
                            <span>豆瓣详情</span>
                            <ft-icon name="Right"></ft-icon>
                        </ft-space>
                    </div>
                </div>
                <ft-space class="rating" vertical align="center" justify="center">
                    <div class="rating-title">豆瓣评分</div>
                    <div class="rating-number">{{ m.rating }}</div>
                </ft-space>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, ref, computed } from "vue"
import { DoubanData, getNearMovie, getToday } from './libs/douban'
import dayjs from 'dayjs'
import coverImage from './cover.jpg'
import Image from './img.vue';

const movie = ref<DoubanData>()
const img = ref('')
const nearMovies = computed(() => {
    if (movie.value) {
        return getNearMovie(dayjs().format('YYYY-MM-DD'))
    } else {
        return []
    }
})
const moreMovieEl = ref<HTMLDivElement>()

async function init() {
    movie.value = await getToday()
    img.value = movie.value!.image!.replace("s_ratio_poster", "l")
}

function openDouban() {
    if (movie.value?.link) {
        window.open(movie.value?.link)
    }
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

.douban-movie-page {
    width: 850px;
    height: 600px;
    overflow: hidden;
    overflow-y: auto;

    .today {
        width: 850px;
        height: 600px;
        position: relative;

        >::v-deep(img) {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        >.down {
            width: 1em;
            height: 1em;
            left: 0;
            right: 0;
            bottom: 0;
            position: absolute;
            z-index: 1;
            margin: auto;

            &:hover {
                filter: brightness(.5);
            }
        }
    }

    .brief {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        backdrop-filter: blur(10px);
        padding: 60px 40px 50px 40px;
        overflow: hidden;
        display: flex;
        gap: 40px;
        background-color: rgba(0, 0, 0, .2);

        >.img {
            flex: 0 0 200px;

            ::v-deep(img) {
                width: 200px;
                height: 300px;
                object-fit: cover;
                border-radius: 10px;
            }

            .detail-btn {
                color: #fbb84d;
                text-shadow: 0 0 1px #df9e41;
                cursor: pointer;

                &:hover {
                    color: #bb791c;
                }
            }
        }

        .brief-content {
            color: #fbb84d;
            text-shadow: 0 0 1px #df9e41;
            flex: auto;

            .title {
                font-size: 20px;
                margin-left: -6px;
            }

            .rate {
                .el-rate {
                    --el-rate-icon-margin: 0;
                    pointer-events: none;
                }
            }

            .extra {
                margin-top: 16px;

                .extra-item {
                    line-height: 2;
                    max-width: 50%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }

            .comment {
                color: #fff;
                font-size: 16px;
                line-height: 2;
                margin-top: 16px;
            }

            .description {
                color: #fff;
                font-size: 14px;
                line-height: 2;
                margin-top: 16px;
                max-height: 4*2*14px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 4;
                -webkit-box-orient: vertical;
            }
        }
    }

    .more-movie {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 40px 0;

        .movie-item {
            display: flex;
            margin: 0 40px;
            padding: 10px;
            gap: 20px;
            background-color: #f2f2f2;
            border-radius: 10px;
            overflow: hidden;

            &:hover {
                background-color: #e8e8e8;
            }

            >.date {
                flex: 0 0 80px;

                >.day {
                    font-size: 50px;
                    border-bottom: 1px solid #d2d2d2;
                    width: 100%;
                    text-align: center;
                }
            }

            >::v-deep(img) {
                flex: 0 0 100px;
                width: 100px;
                height: 147px;
                object-fit: cover;
                border-radius: 6px;
            }

            .movie-info {
                flex: auto;
                display: flex;
                flex-direction: column;
                gap: 4px;
                overflow: hidden;

                .title {
                    font-size: 16px;
                }

                .comment {
                    height: 2*1.5*14px;
                    font-size: 14px;
                    font-style: italic;
                    line-height: 1.5;
                    max-height: 2*1.5*14px;
                    overflow: hidden;
                    display: flex;
                    align-items: center;

                    >div {
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        display: -webkit-box;
                        text-overflow: ellipsis;
                    }
                }

                .go-detail {
                    color: #fbb84d;
                    cursor: pointer;
                    width: fit-content;

                    &:hover {
                        color: #bb791c;
                    }
                }
            }

            .rating {
                flex: 0 0 62px;
                color: #fbb84d;

                .rating-number {
                    font-size: 44px;
                }
            }
        }
    }
}
</style>