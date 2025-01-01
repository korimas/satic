<template>
  <q-splitter v-model="splitterModel" unit="px" :limits="splitterLimits"
    style="height: calc(100vh - 51px); overflow: auto" :class="{ 'menu-hide-splitter': !store.State.sideMenuShow }">
    <template v-slot:before>
      <CommonSide v-show="store.State.sideMenuShow"></CommonSide>
    </template>
    <template v-slot:after>
      <router-view />
    </template>
  </q-splitter>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import CommonSide from 'src/components/side/CommonSide.vue';
import { useStateStore } from 'src/stores/state';
const splitterMin = 280;
let splitterModel = ref(splitterMin);
let splitterLimits = ref([splitterMin, Infinity]);
let store = useStateStore();

store.State.sideMenuShow = true;

watch(() => store.State.sideMenuShow, (val) => {
  console.log('sideMenuShow: ', val);
  if (val) {
    splitterModel.value = splitterMin;
  } else {
    splitterModel.value = 0;
  }
});

</script>
<style>
.menu-hide-splitter>.q-splitter__before {
  display: none !important;
}

.menu-hide-splitter>.q-splitter__separator {
  display: none !important;
}
</style>
