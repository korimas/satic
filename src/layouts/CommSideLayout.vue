<template>
  <q-splitter v-model="splitterModel" unit="px" :limits="splitterLimits"
    style="height: calc(100vh - 51px); overflow: auto"
    :class="{ 'menu-hide-splitter': !store.State.sideMenuShow, 'top-splitter': true }">
    <template v-slot:before>
      <CommonSide v-show="store.State.sideMenuShow"></CommonSide>
    </template>
    <template v-slot:after>
      <router-view />
    </template>
  </q-splitter>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CommonSide from 'src/components/side/CommonSide.vue';
import { useStateStore } from 'src/stores/state';
const splitterMin = 280;
let splitterModel = ref(splitterMin);
let splitterLimits = ref([splitterMin, Infinity]);
let store = useStateStore();

store.State.sideMenuShow = true;

</script>
<style>
.menu-hide-splitter>.q-splitter__separator {
  display: none !important;
}

.menu-hide-splitter>.q-splitter__before {
  display: none !important;
}

/* .menu-hide-splitter>.q-splitter__before {
  transform: translateX(100%);
  opacity: 0;
  pointer-events: none;
  width: 0 !important;
} */
/* .top-splitter>.q-splitter__before {
  transition: transform 0.15s ease, opacity 0.15s ease, width 0.15s ease;
  transform-origin: right;
  will-change: transform, opacity, width;
} */
</style>
