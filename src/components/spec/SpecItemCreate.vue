<template>
  <mi-window @close="close" title="Add Item">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-select
        dense
        filled
        v-model="newSpecItem.type"
        :options="SpecItemTypes"
        stack-label
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section avatar top style="margin: auto; min-width: 30px">
              <q-avatar square style="width: 26px; height: 26px">
                <q-icon
                  :name="SpecItemTypeStyle[scope.opt as keyof typeof SpecItemTypeStyle].icon"
                  :color="SpecItemTypeStyle[scope.opt as keyof typeof SpecItemTypeStyle].color"
                />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">{{ scope.opt }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>

        <template v-slot:selected-item="scope">
          <div v-if="!scope.opt" class="text-grey-8">Type</div>
          <q-item v-else dense style="padding-left: 0px">
            <q-item-section avatar top style="margin: auto; min-width: 30px">
              <q-avatar square style="width: 26px; height: 26px">
                <q-icon
                  :name="SpecItemTypeStyle[scope.opt as keyof typeof SpecItemTypeStyle].icon"
                  :color="SpecItemTypeStyle[scope.opt as keyof typeof SpecItemTypeStyle].color"
                />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">{{ scope.opt }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-input
        dense
        filled
        v-model="newSpecItem.summary"
        placeholder="Summary"
      />

      <q-editor
        v-model="newSpecItem.description"
        placeholder="Description"
        min-height="10rem"
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
import { SpecItem } from 'src/data/structs';
import { SpecItemTypes, SpecItemTypeStyle } from 'src/data/style';
// import MiInput from '../base/MiInput.vue';
import API from 'src/api/satic';
import { useStateStore } from 'src/stores/state';
const store = useStateStore();

const emit = defineEmits(['close', 'success']);
let submintLoading = ref(false);
let newSpecItem = ref<SpecItem>(getSpecItem());

function getSpecItem() {
  return {
    id: 0,
    key: '',
    project_id: '',
    spec_id: 1,
    summary: '',
    description: '',
    priority: '',
    status: '',
    reporter_id: '',
    type: '',

    path: '',
    depth: 0,
    parent_id: 0,
    custom_fields: {},
    created_at: '',
    updated_at: '',
  };
}

async function createSpecItem() {
  submintLoading.value = true;
  newSpecItem.value.key = store.State.curProject.key; // TODO: key由后台根据project_id自动生成
  newSpecItem.value.project_id = store.State.curProject.id;
  let resp = await API.createSpecItem(newSpecItem.value);
  submintLoading.value = false;
  if (resp.success) {
    emit('close');
    // reset form
    onReset();
    emit('success');
  }
}

function close() {
  emit('close');
}

async function onSubmit() {
  createSpecItem();
}

function onReset() {
  newSpecItem.value = getSpecItem();
}
</script>
