<template>
  <q-splitter v-model="splitterModel" unit="px" :limits="splitterLimits"
    style="height: calc(100vh - 51px); overflow: auto">
    <template v-slot:before>
      <CommonSide></CommonSide>
    </template>
    <template v-slot:after>
      <router-view />
    </template>
  </q-splitter>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CommonSide from 'src/components/side/CommonSide.vue';
const splitterMin = 280;
let splitterModel = ref(splitterMin);
let splitterLimits = ref([splitterMin, Infinity]);
</script>
