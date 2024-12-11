<template>
  <q-layout view="hHh lpR fFf">
    <!--header-->
    <q-header bordered class="bg-white">
      <div class="column">
        <HeaderBar></HeaderBar>
      </div>
    </q-header>

    <q-page-container> <router-view /> </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import HeaderBar from 'components/HeaderBar.vue';
import CommonSide from 'src/components/side/CommonSide.vue';
const splitterMin = 300;
let splitterModel = ref(splitterMin);
let splitterLimits = ref([splitterMin, Infinity]);
</script>
