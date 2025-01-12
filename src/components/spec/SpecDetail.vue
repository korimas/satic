<template>
    <MiWindow title="Detail" @close="drawerStore.DetailSpecDrawer.closeDrawer()">
        <q-splitter reverse v-model="splitterModel" unit="px" :limits="splitterLimits" class="fit custom-splitter">
            <template v-slot:before>
                <SpecDetailContent />
            </template>
            <template v-slot:after>
                <SpecDetialSide />
            </template>
        </q-splitter>
    </MiWindow>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SpecDetialSide from './SpecDetialSide.vue';
import SpecDetailContent from './SpecDetailContent.vue';
import MiWindow from '../base/MiWindow.vue';
import { useDrawerStore } from 'src/stores/drawer';

const splitterMin = 350;
const splitterModel = ref(splitterMin);
const splitterLimits = ref([splitterMin, Infinity]);
const drawerStore = useDrawerStore();


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