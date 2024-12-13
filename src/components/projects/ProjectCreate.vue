<template>
  <mi-window @close="close" title="Add Project">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-file dense color="teal" filled v-model="Icon" label="图标">
        <template v-slot:prepend>
          <q-icon name="cloud_upload" />
        </template>
      </q-file>

      <q-input
        dense
        standout="bg-teal text-white"
        v-model="Name"
        prefix="Name:"
      >
        <template v-slot:prepend>
          <q-icon name="wysiwyg" />
        </template>
      </q-input>

      <q-input dense standout="bg-teal text-white" v-model="Key" prefix="Key: ">
        <template v-slot:prepend>
          <q-icon name="key" />
        </template>
      </q-input>

      <q-input
        dense
        standout="bg-teal text-white"
        v-model="Description"
        type="textarea"
        label="Project Description"
      >
        <template v-slot:prepend>
          <q-icon name="description" />
        </template>
      </q-input>
      <div class="row q-gutter-md">
        <q-space />
        <q-btn unelevated label="Submit" type="submit" color="primary" />
      </div>
    </q-form>
  </mi-window>
</template>

<script setup lang="ts">
import { defineEmits, ref } from 'vue';
import MiWindow from 'components/base/MiWindow.vue';

const emit = defineEmits(['close']);
let Name = ref('');
let Key = ref('');
let Description = ref('');
let Icon = ref<File | null>(null);

function close() {
  emit('close');
}

function onSubmit() {
  console.log(Name.value);
}

function onReset() {
  Name.value = '';
}
</script>
