<template>
    <div class="column q-ma-md spec-detail">
        <q-input v-model="store.showDetailSpec.summary" filled  class="spec-title"/>

        <div v-html="store.showDetailSpec.description" class="ProseMirror q-mt-md detail-content" v-if="!isInEdit"
              style="max-width: 100%;overflow-x: auto;scrollbar-width: thin; -webkit-overflow-scrolling: touch;" 
              @click="editDescription"
        />
        <MiEditor v-model="newDescription" v-else  class="q-mt-md" />
    </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';
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
const isInEdit = ref(false);
const newDescription = ref('');

function editDescription() {
    newDescription.value = store.showDetailSpec.description;
    isInEdit.value = true;
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