<template>
    <div class="wave" v-if="!out">
        <div class="star5 orbs in5 wave"></div>
        <div class="in star5 orbs in1 wave" style="animation-duration: 1s;"></div>
        <div class="in star5 orbs in2 wave" style="animation-duration: 1.2s;" @animationend="out = true; emit('nextstage')">
        </div>
        <div class="in star5 orbs in3 wave" style="animation-duration: 1.1s;"></div>
    </div>
    <div class="wave" v-if="out">
        <div class="star5 orbs out5 wave"></div>
        <div class="out star5 orbs out1 wave" style="animation-duration: 1s;"></div>
        <div class="out star5 orbs out2 wave" style="animation-duration: 1.2s;" @animationend="emit('finished')"></div>
        <div class="out star5 orbs out3 wave" style="animation-duration: 1.1s;"></div>
    </div>
</template>
<script lang="ts" setup>
import { ref } from "vue"

const out = ref(false)
const emit = defineEmits<{
    (name: 'finished'): void
    (name: 'nextstage'): void
}>()
</script>
<style lang="scss" scoped>
div.wave {
    aspect-ratio: 1/1;
}

.orbs.wave {
    background-color: transparent;
    border-radius: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    transform-origin: 0 0;
    opacity: 0
}

.in.wave {
    animation: wave-orbsIn forwards 1;
}

.in1.wave {
    width: 100%;
}

.in2.wave {
    width: 80%
}

.in3.wave {
    width: 40%
}

.in4.wave {
    width: 70%
}

.in5.wave {
    position: fixed;
    transform: translate(-50%, 50%);
    bottom: 0;
    width: 100vw;
    aspect-ratio: 1/1;
    opacity: 1;
    animation: wave-orbs2 forwards 1s 1
}

.out.wave {
    transform: scale(0) translate(-50%, -50%);
    opacity: 0
}

.out.wave {
    animation: wave-outOrbs forwards 1
}

.out1.wave {
    width: 50%;
    background-color: #fe853f0d
}

.out2.wave {
    width: 100%
}

.out3.wave {
    width: 150%
}

.star5.in1.wave {
    background-color: #fe853f0d;
    box-shadow: 0 0 50px #fe853f1a, inset 0 0 70px #fe853f1a
}

.star5.in2.wave {
    box-shadow: 0 0 50px #fd94304d, inset 0 0 70px #fd94304d
}

.star5.in3.wave {
    box-shadow: 0 0 50px #fbc13c7f, inset 0 0 70px #fbc13c00;
    background-image: radial-gradient(rgba(251, 193, 60, 1), rgb(251, 193, 60, 0))
}

.star5.in4.wave {
    box-shadow: 0 0 30px #fd94301a, inset 0 0 30px #fd94301a
}

.star5.in5.wave {
    background-image: radial-gradient(rgba(253, 148, 48, .5), rgb(253, 148, 48, 0), rgba(253, 148, 48, 0))
}

.star5.out1.wave {
    box-shadow: 0 0 50px #fbc13c7f, inset 0 0 50px #fbc13c7f
}

.star5.out2.wave {
    box-shadow: 0 0 150px #ffffff7f, inset 0 0 170px #ffffff7f
}

.star5.out3.wave {
    box-shadow: 0 0 200px #fd943099, inset 0 0 170px #fd943099
}


@keyframes wave-orbsIn {
    0% {
        transform: scale(0) translate(-50%, -50%)
    }

    90% {
        transform: scale(1) translate(-50%, -50%);
        opacity: 1
    }

    to {
        transform: scale(1) translate(-50%, -50%);
        opacity: 0
    }
}

@keyframes wave-orbs2 {
    0% {
        transform: scale(0) translate(-50%)
    }

    90% {
        transform: scale(1) translate(-50%);
        opacity: 1
    }

    to {
        transform: scale(1) translate(-50%);
        opacity: 0
    }
}

@keyframes wave-outOrbs {
    30% {
        opacity: 1
    }

    to {
        transform: scale(2) translate(-50%, -50%);
        opacity: 0
    }
}
</style>