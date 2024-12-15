<template>
  <mi-window @close="close" title="Add Project">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-select
        prefix="Icon:"
        dense
        filled
        v-model="Icon"
        :options="iconOptions"
        stack-label
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section avatar>
              <q-avatar square style="width: 26px; height: 26px">
                <img :src="scope.opt.icon" />
              </q-avatar>
            </q-item-section>
          </q-item>
        </template>

        <template v-slot:selected-item="scope">
          <q-chip
            removable
            dense
            @remove="scope.removeAtIndex(scope.index)"
            :tabindex="scope.tabindex"
            color="white"
            text-color="secondary"
            class="q-ma-none"
          >
            <q-avatar square style="width: 26px; height: 26px">
              <img :src="scope.opt.icon" />
            </q-avatar>
          </q-chip>
        </template>
      </q-select>

      <q-input dense filled v-model="Name" prefix="Name:"> </q-input>

      <q-input dense filled v-model="Key" prefix="Key: "> </q-input>

      <q-input
        dense
        filled
        v-model="Description"
        type="textarea"
        prefix="Description: "
      >
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
let iconOptions = [
  { icon: '/icons/random/icon2.svg' },
  { icon: '/icons/random/icon3.svg' },
  { icon: '/icons/random/icon4.svg' },
];

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
