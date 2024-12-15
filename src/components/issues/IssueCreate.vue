<template>
  <mi-window @close="close" title="Add Issue">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input dense filled v-model="Summary" label="Summary"> </q-input>

      <q-editor
        v-model="Description"
        placeholder="Description"
        min-height="10rem"
        :definitions="{
          AI: {
            tip: 'AI生成',
            icon: 'assistant',
            label: 'AI生成',
            handler: AIGenerate,
          },
        }"
        :toolbar="[
          ['removeFormat'],
          ['undo', 'redo'],
          ['left', 'center', 'right', 'justify'],
          ['ordered', 'unordered'],
          ['bold', 'italic', 'strike', 'underline'],
          ['link', 'image'],
          ['AI'],
        ]"
      />

      <div class="row q-gutter-md">
        <q-space />
        <q-btn
          :loading="submintLoading"
          unelevated
          label="Submit"
          type="submit"
          color="primary"
        />
      </div>
    </q-form>
  </mi-window>
</template>

<script setup lang="ts">
import { defineEmits, ref } from 'vue';
import MiWindow from 'components/base/MiWindow.vue';
import API from 'src/api/satic';

const emit = defineEmits(['close', 'success']);
let Summary = ref('');
let Description = ref('');
let submintLoading = ref(false);

function close() {
  emit('close');
}

async function onSubmit() {
  console.log('submit');
}

function onReset() {
  console.log('reset');
}
</script>
