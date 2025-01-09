<template>
  <div class="column q-ma-md spec-detail">
    <q-input v-model="store.showDetailSpec.summary" filled class="spec-title" />

    <div class=" q-mt-lg">
      <div class="block-title">Description:</div>
      <div v-html="store.showDetailSpec.description" class="ProseMirror detail-content"
        v-if="!store.showDetailSpec.isInEdit"
        style="max-width: 100%;overflow-x: auto;scrollbar-width: thin; -webkit-overflow-scrolling: touch;"
        @click="editDescription" />
      <div v-else class="column q-mt-md q-gutter-xs">
        <MiEditor v-model="store.showDetailSpec.edit_content" />
        <div class="row q-gutter-xs">
          <q-btn label="Save" color="primary" @click="updateEditDescription" class="q-mt-md" :loading="isUpdating" />
          <q-btn label="Cancel" flat @click="cancelEditDescription" class="q-mt-md" />
        </div>
      </div>
    </div>

    <div class=" q-mt-lg">
      <div class="block-title" style="font-weight: 600;">Activity:</div>
      <div class="q-mt-xs">
        <q-tabs v-model="store.specDetailTap" dense class="text-grey" active-color="primary" indicator-color="primary"
          align="left" narrow-indicator>
          <q-tab name="comment" label="Comment" />
          <q-tab name="history" label="History" />
          <q-tab name="traceability" label="Traceability" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="store.specDetailTap">
          <q-tab-panel name="traceability">
            <SpecDetailTraceability />
          </q-tab-panel>

          <q-tab-panel name="comment">
            <SpecDetailComment />
          </q-tab-panel>

          <q-tab-panel name="history" style="padding-top:0">
            <SpecDetailHistory />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';
import { useSpecStore } from 'src/stores/spec';
import MiLoading from 'components/base/MiLoading.vue';
import API from 'src/api/satic';

// lazy import
const MiEditor = defineAsyncComponent({
  loader: () => import('components/base/MiEditor.vue'),
  loadingComponent: MiLoading,
  delay: 0,
  timeout: 15000,
});

const SpecDetailComment = defineAsyncComponent({
  loader: () => import('components/spec/SpecDetailComment.vue'),
  loadingComponent: MiLoading,
  delay: 0,
  timeout: 15000,
});

const SpecDetailHistory = defineAsyncComponent({
  loader: () => import('components/spec/SpecDetailHistory.vue'),
  loadingComponent: MiLoading,
  delay: 0,
  timeout: 15000,
});

const SpecDetailTraceability = defineAsyncComponent({
  loader: () => import('components/spec/SpecDetailTraceability.vue'),
  loadingComponent: MiLoading,
  delay: 0,
  timeout: 15000,
});

const store = useSpecStore();
const isUpdating = ref(false);

function editDescription() {
  if (window.getSelection()?.toString()) {
    return
  }
  store.showDetailSpec.edit_content = store.showDetailSpec.description;
  store.showDetailSpec.isInEdit = true;
}

function cancelEditDescription() {
  store.showDetailSpec.isInEdit = false
  store.showDetailSpec.edit_content = '';
}

async function updateEditDescription() {
  const item = store.showDetailSpec;
  if (item.edit_content === item.description) {
    // 没有修改内容
    item.isInEdit = false;
    item.edit_content = '';
    isUpdating.value = false;
    return;
  }
  const resp = await API.updateSpecItem(item.id, {
    description: item.edit_content,
    summary: item.summary,
  });
  if (resp.success) {
    item.isInEdit = false;
    item.description = item.edit_content || '';
  }
  isUpdating.value = false;
}

</script>

<style>
.spec-title .q-field__control {
  font-size: 20px;
  font-weight: bold;
  background: #fff;
}

.detail-content {
  background: #fff;
}

.detail-content:hover {
  background: #f5f5f5;
}

.spec-detail .ProseMirror {
  padding: 10px;
}

.block-title {
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.00714em;
}
</style>