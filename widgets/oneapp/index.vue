<template>
    <img class="one-widget" :src="logo" @click="openDialog('/view.vue')">
</template>
<script lang="ts" setup>
import { } from "vue"
import logo from './assets/logo.png'
import { openDialog } from 'widget'

</script>
<style lang="scss" scoped>
.one-widget {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
}
</style>