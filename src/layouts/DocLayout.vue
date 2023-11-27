<template>
  <q-layout view="hHh Lpr fFf">

    <!--header-->
    <q-header bordered class="bg-white">
      <div class="column">
        <HeaderBar></HeaderBar>
      </div>
    </q-header>

    <!--doc side drawer-->
    <q-drawer show-if-above v-model="DocSideShow" side="left" bordered :width="DocSideDrawerWidth">
      <DocSide @addClick="DocCreateShow = true"></DocSide>
      <div v-touch-pan.preserveCursor.prevent.mouse.horizontal="resizeDocSide" class="q-drawer_left_resizer"></div>
    </q-drawer>

    <!--doc create drawer-->
    <q-drawer side="right"
              overlay
              v-model="DocCreateShow"
              bordered
              :width="($q.screen.width > 800) ? 800: $q.screen.width "
              :breakpoint="800"
    >
      <DocCreate @close="DocCreateShow = !DocCreateShow"></DocCreate>
    </q-drawer>

    <!--doc detail drawer-->
    <q-drawer side="right" v-model="DocDetailShow" bordered
              :width="DocDetailDrawerWidth">
      <DocDetail></DocDetail>
      <div v-touch-pan.preserveCursor.prevent.mouse.horizontal="resizeDocDetail" class="q-drawer_right_resizer"></div>

    </q-drawer>

    <!--doc Content page-->
    <q-page-container padding>
      <router-view/>
    </q-page-container>

  </q-layout>
</template>
<style>

.q-drawer_left_resizer {
  position: absolute;
  top: 0;
  bottom: 0;
  right: -2px;
  width: 0;
  background-color: lightgray;
  cursor: ew-resize;
}

.q-drawer_left_resizer:after {
  content: '';
  position: absolute;
  top: 50%;
  height: 30px;
  left: -5px;
  right: -5px;
  transform: translateY(-50%);
  background-color: inherit;
  border-radius: 4px;
}

.q-drawer_right_resizer {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -2px;
  width: 0;
  background-color: lightgray;
  cursor: ew-resize;
}

.q-drawer_right_resizer:after {
  content: '';
  position: absolute;
  top: 50%;
  height: 30px;
  left: -5px;
  right: -5px;
  transform: translateY(-50%);
  background-color: inherit;
  border-radius: 4px;
}

</style>

<script setup lang="ts">
import {ref, nextTick} from 'vue'
import DocSide from 'components/DocSide.vue';
import HeaderBar from 'components/HeaderBar.vue';
import DocCreate from 'components/DocCreate.vue';
import DocDetail from 'components/DocDetail.vue';

const DocSideShow = ref(false)
const DocCreateShow = ref(false)
const DocDetailShow = ref(false)

let drawerInitWidth = 280
let DocSideDrawerWidth = ref(drawerInitWidth)
let DocDetailDrawerWidth = ref(drawerInitWidth)

function resizeDocSide(ev: any) {
  if (ev.isFirst === true) {
    drawerInitWidth = DocSideDrawerWidth.value
  }
  DocSideDrawerWidth.value = drawerInitWidth + ev.offset.x
  if (DocSideDrawerWidth.value < drawerInitWidth) {
    DocSideDrawerWidth.value = drawerInitWidth
  }
}

function resizeDocDetail(ev: any) {
  if (ev.isFirst === true) {
    drawerInitWidth = DocDetailDrawerWidth.value
  }
  DocDetailDrawerWidth.value = drawerInitWidth - ev.offset.x
  if (DocDetailDrawerWidth.value < 40) {
    DocDetailShow.value = false
  }
}

function init(){
  nextTick(()=>{
      DocDetailShow.value = false
  })
  return
}

</script>
