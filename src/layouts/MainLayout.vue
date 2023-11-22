<template>
  <q-layout view="hHh Lpr fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="vertical_split" @click="toggleLeftDrawer"/>
        <q-toolbar-title>
          <div class="row">
            <q-icon name="polymer" size="30px"/>
            <div class="text-h5" style="margin-left: 8px">SATIC</div>
          </div>
        </q-toolbar-title>
        <div>v0.01</div>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered :width="drawerWidth">
      <DocSide @doubleClick="openFieldDrawer"></DocSide>
      <div v-touch-pan.preserveCursor.prevent.mouse.horizontal="resizeDrawer" class="q-drawer__resizer"></div>
    </q-drawer>

    <q-drawer side="right"
              overlay
              v-model="rightDrawerOpen"
              bordered
              :width="($q.screen.width > 600) ? 600: $q.screen.width "
              :breakpoint="600"
    >
      <div class="q-pa-sm q-gutter-sm row" style="height: 56px">
        <div class="text-h6">详细</div>
        <q-space></q-space>
        <q-btn unelevated size="sm" icon="clear" color="red" @click="rightDrawerOpen = !rightDrawerOpen"/>
      </div>
      <q-separator/>
      <div class="column q-pa-md">
        <q-editor v-model="editContent" min-height="5rem"/>

      </div>


    </q-drawer>

    <q-page-container padding>
      <router-view/>
    </q-page-container>

  </q-layout>
</template>
<style>

.q-drawer__resizer {
  position: absolute;
  top: 0;
  bottom: 0;
  right: -2px;
  width: 1px;
  background-color: lightgray;
  cursor: ew-resize;
}

.q-drawer__resizer:after {
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

<script>
import {ref} from 'vue'
import DocSide from 'components/DocSide.vue';

export default {
  components: {
    DocSide
  },
  setup() {
    const leftDrawerOpen = ref(false)
    const rightDrawerOpen = ref(false)
    let drawerInitWidth = 300
    let drawerWidth = ref(drawerInitWidth)
    let editContent = ref('<p>I’m running Tiptap with Vue.js. 🎉</p>')

    function resizeDrawer(ev) {
      if (ev.isFirst === true) {
        drawerInitWidth = drawerWidth.value
      }
      drawerWidth.value = drawerInitWidth + ev.offset.x
      if (drawerWidth.value < 280) {
        drawerWidth.value = 280
      }
    }

    function openFieldDrawer(nodeKey) {
      rightDrawerOpen.value = true
    }

    return {
      openFieldDrawer,
      editContent,
      resizeDrawer,
      drawerWidth,
      leftDrawerOpen,
      rightDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
}
</script>
