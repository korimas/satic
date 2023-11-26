<template>
  <q-layout view="hHh Lpr fFf">

    <q-header bordered class="bg-white">
      <q-toolbar>
        <!--<q-btn dense flat round icon="vertical_split" @click="toggleLeftDrawer" class=" text-grey-9"/>-->
        <q-toolbar-title>
          <div class="row q-gutter-xs">
            <q-btn dense flat label="SaticTool" icon="polymer" class="text-capitalize text-primary"
                   style="width: 130px">

            </q-btn>
            <!--<q-badge style="margin-left: 2px" class="text-lowercase" color="primary" >v1.0.0</q-badge>-->
            <q-btn dense flat icon-right="expand_more" class="text-capitalize text-grey-8">Project
              <q-menu style="width: 100%; width: 200px">
                <q-list dense bordered padding class="rounded-borders">
                  <q-item clickable v-close-popup>
                    <q-item-section avatar>
                      <q-icon name="join_right"/>
                    </q-item-section>
                    <q-item-section>
                      Falcon I
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup>
                    <q-item-section avatar>
                      <q-icon name="view_cozy"/>
                    </q-item-section>
                    <q-item-section>
                      Falcon G
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup>
                    <q-item-section avatar>
                      <q-icon name="join_left"/>
                    </q-item-section>
                    <q-item-section>
                      Falcon 10K
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>

            <q-btn dense flat icon-right="expand_more" class="text-capitalize text-grey-8">Tracker
              <q-menu style="width: 100%; width: 250px">
                <q-list dense bordered padding class="rounded-borders">
                  <q-item clickable v-close-popup>
                    <q-item-section avatar>
                      <q-icon name="join_right"/>
                    </q-item-section>
                    <q-item-section>
                      System Requirement
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup>
                    <q-item-section avatar>
                      <q-icon name="view_cozy"/>
                    </q-item-section>
                    <q-item-section>
                      Software Requirement
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup>
                    <q-item-section avatar>
                      <q-icon name="join_left"/>
                    </q-item-section>
                    <q-item-section>
                      Software Architecture
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>

            <!--<q-btn unelevated label="Create" color="primary" class="text-capitalize"/>-->

          </div>
        </q-toolbar-title>

        <q-btn dense flat round icon="assistant" class="text-pink-2">
          <q-tooltip class="bg-grey-3 text-black">AI助手</q-tooltip>
          <q-menu>
            <AIAssistant></AIAssistant>
          </q-menu>
        </q-btn>

        <q-btn dense round flat icon="g_translate" class="text-grey-8">
          <q-tooltip class="bg-grey-3 text-black">翻译</q-tooltip>
        </q-btn>
        <q-btn dense flat round icon="search" class="text-grey-8"/>
        <q-btn dense flat round icon="notifications" class="text-grey-8"/>
        <q-btn dense flat round icon="settings" class="text-grey-8"/>
        <q-btn dense flat round icon="account_circle" class="text-primary">
          <q-menu>
            <div class="row no-wrap q-pa-md">

              <div class="column items-center">
                <q-avatar size="72px">
                  <img src="https://cdn.quasar.dev/img/avatar4.jpg">
                </q-avatar>

                <div class="text-subtitle1 q-mt-md q-mb-xs">John Doe</div>

                <q-btn
                  color="primary"
                  label="Logout"
                  push
                  size="sm"
                  v-close-popup
                />
              </div>
            </div>
          </q-menu>
        </q-btn>

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
      <div class="q-pa-sm q-gutter-sm row bg-grey-2" style="height: 56px">
        <div class="text-h6">Create Requirement</div>
        <q-space></q-space>
        <q-btn unelevated size="sm" icon="clear" color="red-4" @click="rightDrawerOpen = !rightDrawerOpen"/>
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
            outlined
            v-model="editSummary"
            label="Summary"
          />

          <q-editor v-model="editDescription" placeholder="Description" min-height="10rem"/>
          <q-input
            dense
            v-model="text"
            outlined
            type="textarea"
            label="Verification Standards"
          />

          <div>
            <q-btn unelevated label="Submit" type="submit" color="primary"/>
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

<script lang="ts">
import {ref} from 'vue'
import DocSide from 'components/DocSide.vue';
import AIAssistant from 'components/AIAssistant.vue';

export default {
  components: {
    DocSide,
    AIAssistant
  },
  setup() {
    const leftDrawerOpen = ref(false)
    const rightDrawerOpen = ref(false)
    let drawerInitWidth = 300
    let drawerWidth = ref(drawerInitWidth)
    let editDescription = ref('')
    let editSummary = ref('')


    function resizeDrawer(ev: any) {
      if (ev.isFirst === true) {
        drawerInitWidth = drawerWidth.value
      }
      drawerWidth.value = drawerInitWidth + ev.offset.x
      if (drawerWidth.value < 280) {
        drawerWidth.value = 280
      }
    }

    function openFieldDrawer(nodeKey: any) {
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
