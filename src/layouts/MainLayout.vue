<template>
  <q-layout view="hHh Lpr fFf">

    <q-header bordered class="bg-white">
      <q-toolbar>
        <!--        <q-btn dense flat round icon="vertical_split" @click="toggleLeftDrawer" class=" text-grey-9"/>-->
        <q-toolbar-title>
          <div class="row">
            <q-btn dense flat round icon="polymer" class="text-primary"/>
            <div class="text-h7 text-grey-9" style="margin-left: 16px">SATIC</div>
          </div>
        </q-toolbar-title>
        <q-btn dense flat round icon="search" class="text-grey-8"/>
        <q-btn dense flat round icon="notifications" class="text-grey-8"/>
        <q-btn dense flat round icon="settings" class="text-grey-8"/>
        <q-btn dense flat round icon="account_circle" class="text-primary"/>

      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered :width="drawerWidth">
      <DocSide @addClick="openFieldDrawer"></DocSide>
      <div v-touch-pan.preserveCursor.prevent.mouse.horizontal="resizeDrawer" class="q-drawer__resizer"></div>
    </q-drawer>

    <q-drawer side="right"
              overlay
              v-model="rightDrawerOpen"
              bordered
              :width="($q.screen.width > 800) ? 800: $q.screen.width "
              :breakpoint="800"
    >
      <div class="q-pa-sm q-gutter-sm row" style="height: 56px">
        <div class="text-h6">Create Requirement</div>
        <q-space></q-space>
        <q-btn unelevated size="sm" icon="clear" color="red" @click="rightDrawerOpen = !rightDrawerOpen"/>
      </div>
      <q-separator/>
      <div class="column q-pa-md">

        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
        >
          <q-input
            dense
            filled
            v-model="editSummary"
            label="Summary"
          />

          <q-editor v-model="editDescription" min-height="10rem"/>

          <div>
            <q-btn unelevated  label="Submit" type="submit" color="blue-6"/>
          </div>
        </q-form>


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
  width: 0;
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
    let editDescription = ref('')
    let editSummary = ref('')

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
      editDescription,
      editSummary,
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
