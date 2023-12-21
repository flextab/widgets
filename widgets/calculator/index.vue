<template>
    <div class="calculator-widget">
        <div>+</div>
        <div>-</div>
        <div>×</div>
        <div>=</div>
    </div>
</template>
<script lang="ts" setup>
import { } from 'vue'
</script>
<style lang="less" scoped>
.calculator-widget {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template: repeat(2, 1fr) / repeat(2, 1fr);
    position: relative;
    cursor: pointer;

    >div {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        background-color: #fa980c;
        color: #fff;
        font-weight: 100;
        font-family: sans-serif;
        text-shadow: 0 0 2px rgba(0, 0, 0, .2);

        &:last-child {
            background-color: #e3e3e3;
            color: #787878;
        }
    }

    &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 1px;
        background-color: #c5780a;
        top: 0;
        bottom: 0;
        left: 0;
        margin: auto;
    }

    &::after {
        content: '';
        position: absolute;
        width: 1px;
        height: 100%;
        background-color: #c5780a;
        left: 0;
        right: 0;
        top: 0;
        margin: auto;
    }
}
</style>