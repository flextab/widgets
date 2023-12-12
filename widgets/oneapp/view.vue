<template>
    <div class="one-widget-detail">
        <div class="content one" v-if="oneData">
            <div class="one-pic-today" :style="{ 'background-image': `url(${oneData.pic})` }">
                <div class="one-today-description">
                    <div>{{ oneData.description }}</div>
                </div>
            </div>
            <el-divider class="article-divider">阅读</el-divider>
            <div class="one-article">
                <h4>{{ oneData.article.title }}</h4>
                <div class="one-author">{{ oneData.article.author }}</div>
                <div class="one-content" v-html="oneData.article.content"></div>
            </div>
            <el-divider>问答</el-divider>
            <div class="one-question">
                <h4>{{ oneData.question.title }}</h4>
                <div>{{ oneData.question.subtitle }}</div>
                <div class="one-content" v-html="oneData.question.content"></div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref } from "vue"
import { getOneData, OneData } from './libs/one'
import { enableFullscreen } from 'widget'
enableFullscreen()

const oneData = ref<OneData>()

async function init() {
    oneData.value = await getOneData()
}

init()
</script>
<style lang="scss">
:host([fullscreen]) {
    .one-widget-detail {
        width: 100%;
        height: 100%;
        scrollbar-width: 4px;

        &::-webkit-scrollbar {
            display: block;
        }

        >.content>.one-pic-today>.one-today-description {
            backdrop-filter: blur(10px);
        }
    }
}
</style>
<style lang="scss" scoped>
.one-widget-detail {
    width: 800px;
    height: 500px;
    overflow: hidden;
    overflow-y: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }

    .content {
        position: relative;

        .one-pic-today {
            width: 100%;
            height: 500px;
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            position: relative;
        }

        .one-today-description {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            width: 100%;
            height: 100%;
            font-size: 14px;
            color: #fff;
            text-shadow: 0 0 2px #000;
            display: flex;
            align-items: center;
            justify-content: center;

            >div {
                width: 60%;
                max-width: 700px;
            }
        }

        .article-divider {
            margin-top: 0px;
        }

        .one-article,
        .one-question {
            font-size: 15px;
            width: 70%;
            max-width: 700px;
            margin: 20px auto;

            .one-author {
                font-size: 12px;
            }

            .one-content {
                margin-top: 20px;

                :deep(img) {
                    max-width: 100%;
                }

                :deep(.one-img-container) {
                    img {
                        display: block;
                        margin: 0 auto;
                    }
                }

                :deep(p) {
                    line-height: 2;
                }

                :deep(p:not([style])) {
                    &::first-letter {
                        margin-left: 2em;
                    }
                }
            }
        }
    }

}
</style>