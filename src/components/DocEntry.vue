<template>
  <q-card flat class="q-hoverable" style="white-space: pre-wrap; min-height: 120px">
    <span class="q-focus-helper"></span>

    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="text-h6">{{ item.summary }}</div>
        </div>

        <div class="col-auto">
          <q-btn v-if="!item.openEdit" round size="sm" flat icon="draw" @click="OpenEdit(item)">
            <q-tooltip class="bg-grey-3 text-black">Edit</q-tooltip>
          </q-btn>
          <q-btn v-else round size="sm" flat icon="save" @click="CloseEdit(item)">
            <q-tooltip class="bg-grey-3 text-black">Save</q-tooltip>
          </q-btn>

          <q-btn round size="sm" flat icon="smart_toy" @click="GetReqAnalysis(item)">
            <q-tooltip class="bg-grey-3 text-black">AI评审</q-tooltip>
          </q-btn>

          <q-btn round size="sm" flat icon="bug_report" @click="GetTestAnalysis(item)">
            <q-tooltip class="bg-grey-3 text-black">AI测试分析</q-tooltip>
          </q-btn>


          <q-btn color="grey-7" round flat size="sm" icon="more_vert">
            <q-menu cover auto-close>
              <q-list dense>
                <q-item clickable>
                  <q-item-section>Remove</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Edit</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Share</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>


        </div>
      </div>
    </q-card-section>

    <q-card-section>
      <!--TODO: 修改v-html，安全性-->
      <div v-if="item.openEdit">
        <q-editor v-model="item.description" min-height="5rem"/>
      </div>
      <div v-else v-html="item.description"/>
    </q-card-section>

    <q-slide-transition>
      <div v-show="item.comment !=='' ">
        <q-separator/>
        <q-card-section class="text-subtitle2">
          {{ item.comment }}
        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
</template>

<script setup lang="ts">
import {ref, reactive, toRefs, defineProps, defineEmits, PropType} from 'vue';

interface DocEntryObj {
  summary: string;
  description: string,
  comment: string,
  openEdit: boolean
}

defineProps({
  item: {
    type: Object as PropType<DocEntryObj>,
    required: true,
    default: () => {
      return {
        summary: '',
        description: '',
        comment: '',
        openEdit: false
      }
    }
  }
})

function OpenEdit(item: any) {
  item.openEdit = true
}

function CloseEdit(item: any) {
  item.openEdit = false
}

</script>

<style scoped>

</style>
