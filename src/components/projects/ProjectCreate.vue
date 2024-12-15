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
                <img :src="'/icons/random/' + scope.opt.icon" />
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
              <img :src="'/icons/random/' + scope.opt.icon" />
            </q-avatar>
          </q-chip>
        </template>
      </q-select>

      <q-input dense filled v-model="Name" label="Name"> </q-input>

      <q-input dense filled v-model="Key" label="Key"> </q-input>

      <q-input dense filled v-model="Description" autogrow label="Description">
      </q-input>
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
let Name = ref('');
let Key = ref('');
let Description = ref('');
let submintLoading = ref(false);

interface IconOption {
  icon: string;
}

let Icon = ref<IconOption | null>(null);
let iconOptions = [
  { icon: 'icon2.svg' },
  { icon: 'icon3.svg' },
  { icon: 'icon4.svg' },
];

function close() {
  emit('close');
}

async function onSubmit() {
  if (!Name.value || !Key.value || !Description.value || !Icon.value) {
    return;
  }
  submintLoading.value = true;
  let resp = await API.createProject({
    name: Name.value,
    key: Key.value,
    description: Description.value,
    icon: Icon.value.icon,
  });
  submintLoading.value = false;
  if (resp.success) {
    emit('close');
    // reset form
    onReset();
    emit('success');
  }
}

function onReset() {
  Name.value = '';
  Key.value = '';
  Description.value = '';
  Icon.value = null;
}
</script>
