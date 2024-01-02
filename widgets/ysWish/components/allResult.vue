<template>
    <div class="all-result-table">
        <div class="bookmark" v-for="item of items.slice(0, 10)" @mouseenter="SoundPlayer.playSound('beep')">
            <div class="wrap">
                {{ item }}
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { } from "vue"
import BookMark from '../assets/bookmark.png'
import { SoundPlayer } from '../libs/sound'

const props = defineProps<{
    items: string[]
}>()

function playSound(i = 0) {
    setTimeout(() => {
        if (i < Math.min(props.items.length, 10)) {
            SoundPlayer.playSound('roll')
            playSound(i + 1)
        }
    }, 200);
}

playSound()
</script>
<style lang="scss">
:host([fullscreen]) {
    .all-result-table {
        height: 800px;

        .bookmark {
            width: 150px;

            .wrap {
                font-size: 100px;
            }
        }
    }
}
</style>
<style lang="scss" scoped>
.all-result-table {
    height: 500px;
    max-width: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    gap: 10px;

    .bookmark {
        width: 90px;
        height: 100%;
        animation: slip-to-left forwards .6s 1;
        transform: translateX(2000px);

        .wrap {
            background-image: v-bind('`url(${BookMark})`');
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            display: flex;
            align-items: center;
            justify-content: center;
            writing-mode: vertical-rl;
            text-orientation: upright;
            font-size: 45px;
            white-space: nowrap;
            color: #000;
            text-shadow: 0 -1px 1px #fff;
            transition: all ease-in .1s;

            &:hover {
                transform: scale(1.1);
            }
        }

        @for $i from 0 through 10 {
            $index: $i + 1;

            &:nth-child(#{$index}) {
                animation-delay: $index * .1s;
            }
        }
    }
}



@keyframes slip-to-left {
    from {
        transform: translateX(2000px);
    }

    to {
        transform: translateX(0);
    }
}
</style>