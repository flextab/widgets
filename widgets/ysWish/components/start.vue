<template>
    <div class="start-page" @animationend="end">
        <div class="icon"></div>
        <div class="text">
            <div>抵制不良游戏，拒绝盗版游戏，注意自我保护，谨防受骗上当，适度游戏益脑，沉迷游戏伤身，合理安排时间，享受健康生活。</div>
            <div>审批文号：国新出审［2020］1407号 ISBN 978-7-498-07852-0 出版单位：华东师范大学电子音像出版社有限公司</div>
            <div>著作权人：上海米哈游天命科技有限公司</div>
            <div>本公司积极履行《网络游戏行业防沉迷自律公约》</div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { } from 'vue'
import StartIcon from '../assets/start-text.png';

const emit = defineEmits<{
    (e: 'finished'): void
}>()

function end() {
    setTimeout(() => {
        emit('finished')
    }, 1500);
}
</script>
<style lang="scss" scoped>
.start-page {
    width: 100%;
    height: 100%;
    position: relative;

    .icon {
        width: 50%;
        height: 80%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        background-image: v-bind('`url(${StartIcon})`');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        animation: fade-in forwards 1s 1;
        animation-delay: .5s;
        opacity: 0;
    }

    .text {
        position: absolute;
        bottom: 10%;
        width: 100%;
        text-align: center;
        height: fit-content;
        animation: fade-in forwards .5s 1;
        color: #707070;
        opacity: 0;
        animation-delay: .7s;

        >div {
            font-family: Baskerville, Georgia, "Liberation Serif", "Kaiti SC", STKaiti, "AR PL UKai CN", "AR PL UKai HK", "AR PL UKai TW", "AR PL UKai TW MBE", "AR PL KaitiM GB", KaiTi, KaiTi_GB2312, DFKai-SB, TW-Kai, serif;
        }
    }
}

@keyframes fade-in {
    to {
        opacity: 1;
    }

}
</style>