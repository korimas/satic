<template>
    <q-splitter reverse v-model="splitterModel" unit="px" :limits="splitterLimits" class="fit custom-splitter">
        <template v-slot:before>
            <SpecDetailContent />
        </template>
        <template v-slot:after>
            <SpecDetialSide />
        </template>
    </q-splitter>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SpecDetialSide from './SpecDetialSide.vue';
import SpecDetailContent from './SpecDetailContent.vue';

const splitterMin = 350;
const splitterModel = ref(splitterMin);
const splitterLimits = ref([splitterMin, Infinity]);
</script>

<style>
.custom-splitter .q-splitter__separator {
    /* 默认状态的分割线样式 */
    width: 2px;
    background: #ffffff;
}

.custom-splitter .q-splitter__separator:hover {
    /* 鼠标悬停时的分割线样式 */
    width: 2px;
    background: #1976d2;
    /* Quasar 默认的主题蓝色 */
}
</style>