<template>
    <div class="column q-ma-md spec-detail">
        <q-input v-model="store.showDetailSpec.summary" filled  class="spec-title"/>

        <div v-html="store.showDetailSpec.description" class="ProseMirror q-mt-md detail-content" v-if="!store.showDetailSpec.isInEdit"
              style="max-width: 100%;overflow-x: auto;scrollbar-width: thin; -webkit-overflow-scrolling: touch;" 
              @click="editDescription"
        />
        <MiEditor v-model="store.showDetailSpec.edit_content" v-else  class="q-mt-md" />
    </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { useSpecStore } from 'src/stores/spec';
import MiLoading from 'components/base/MiLoading.vue';

// lazy import
const MiEditor = defineAsyncComponent({
  loader: () => import('components/base/MiEditor.vue'),
  loadingComponent: MiLoading,
  delay: 0,
  timeout: 15000,
});

const store = useSpecStore();

function editDescription() {
    store.showDetailSpec.edit_content = store.showDetailSpec.description;
    store.showDetailSpec.isInEdit = true;
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

</style>