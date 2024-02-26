<template>
  <q-toolbar>
    <!--<q-btn dense flat round icon="vertical_split" @click="toggleLeftDrawer" class=" text-grey-9"/>-->
    <q-toolbar-title>
      <div class="row q-gutter-xs">
        <q-btn dense flat class="text-capitalize" color="grey-9" to="/"
               style="width: 130px; margin-right: 10px; font-size: 16px; font-weight: normal">
          <q-icon size="sm" name="polymer" color="primary" style="margin-right: 10px"/>
          SaticBoard
        </q-btn>
        <!--<q-badge style="margin-left: 2px" class="text-lowercase" color="primary" >v1.0.0</q-badge>-->
        <q-btn dense flat icon-right="expand_more" class="text-capitalize text-grey-7">Project
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
        <q-btn dense flat icon-right="expand_more" class="text-capitalize text-grey-7">Tracker
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

    <q-btn dense flat round icon="reviews" class="text-grey-8" @click="ShowCommentDialogFlag = true"/>

    <q-btn dense flat round icon="assistant" class="text-light-blue-6">
      <q-tooltip class="bg-grey-3 text-black">AI助手</q-tooltip>
      <q-menu>
        <AIAssistant></AIAssistant>
      </q-menu>
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

  <q-dialog v-model="ShowCommentDialogFlag" persistent>
    <CommentRecordDialog />
  </q-dialog>

</template>


<script setup lang="ts">
import {defineAsyncComponent, ref} from 'vue'
// const AIAssistant = defineAsyncComponent(() => import('components/AIAssistant.vue'))
import AIAssistant from 'components/AIAssistant.vue';
const CommentRecordDialog = defineAsyncComponent(() => import('components/CommentRecordDialog.vue'))
// import CommentRecordDialog from 'components/CommentRecordDialog.vue'

let ShowCommentDialogFlag = ref(false)
</script>


<style scoped>

</style>
