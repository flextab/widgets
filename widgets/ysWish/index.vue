<template>
    <div class="ys-wish" @click="openDialog('/view.vue')">
        <img :src="Logo">
    </div>
</template>
<script lang="ts" setup>
import { } from "vue"
import Logo from './assets/logo.jpeg'
import { openDialog } from 'widget'
</script>
<style lang="scss" scoped>
.ys-wish {
    width: 100%;
    height: 100%;
    cursor: pointer;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
</style>