<template>
    <div class="note-widget" @click="openDialog('/edit.vue')">
        <div class="bar"></div>
        <div class="lines"></div>
        <div class="lines"></div>
        <div class="lines"></div>
    </div>
</template>
<script lang="ts" setup>
import { } from "vue"
import { openDialog } from "widget";
</script>
<style lang="scss"></style>
<style lang="scss" scoped>
.note-widget {
    width: 100%;
    height: 100%;
    background-color: #fff;
    cursor: pointer;

    .bar {
        width: 100%;
        height: 24%;
        background: linear-gradient(#fcdf5d 0, #f8cb14 100%);
        box-shadow: 0 2px 2px rgba(0, 0, 0, .2);
    }

    .bar+.lines {
        margin-top: 5%;
        border-top-style: dashed;
    }

    .lines {
        border-top: 1px solid #cfcfcf;
        height: 24%;
    }

}
</style>