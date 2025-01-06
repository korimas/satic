<template>
  <mi-window @close="close" title="Add Item">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md q-pa-md">
      <q-select dense filled v-model="newSpecItem.type" :options="SpecItemTypes" stack-label>
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section avatar top style="margin: auto; min-width: 30px">
              <q-avatar square style="width: 26px; height: 26px">
                <q-icon :name="SpecItemTypeStyle[scope.opt as keyof typeof SpecItemTypeStyle].icon"
                  :color="SpecItemTypeStyle[scope.opt as keyof typeof SpecItemTypeStyle].color" />
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
                <q-icon :name="SpecItemTypeStyle[scope.opt as keyof typeof SpecItemTypeStyle].icon"
                  :color="SpecItemTypeStyle[scope.opt as keyof typeof SpecItemTypeStyle].color" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">{{ scope.opt }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-input dense filled v-model="newSpecItem.summary" placeholder="Summary" />

      <!-- <q-editor v-model="newSpecItem.description" placeholder="Description" min-height="10rem" :toolbar="[
        ['removeFormat'],
        ['undo', 'redo'],
        ['left', 'center', 'right', 'justify'],
        ['ordered', 'unordered'],
        ['bold', 'italic', 'strike', 'underline'],
        ['link', 'image'],
        ['AI'],
      ]" /> -->
      <MiEditor v-model="newSpecItem.description" />

      <div class="row q-gutter-md">
        <q-space />
        <q-btn :loading="submintLoading" unelevated label="Submit" type="submit" color="primary" />
      </div>
    </q-form>
  </mi-window>
</template>

<script setup lang="ts">
import { defineEmits, ref, defineProps, defineAsyncComponent } from 'vue';
import MiWindow from 'components/base/MiWindow.vue';
import { SpecItem } from 'src/data/structs';
import { SpecItemTypes, SpecItemTypeStyle } from 'src/data/style';
import { useStateStore } from 'src/stores/state';
import { useSpecStore } from 'src/stores/spec';
import { allocateSpecItem } from 'src/service/spec';
import MiLoading from 'components/base/MiLoading.vue';


// lazy import
const MiEditor = defineAsyncComponent({
  loader: () => import('components/base/MiEditor.vue'),
  loadingComponent: MiLoading,
  delay: 0,
  timeout: 15000,
});

const store = useStateStore();
const specStore = useSpecStore();

const emit = defineEmits(['close', 'successCreate']);
let submintLoading = ref(false);
let newSpecItem = ref<SpecItem>(allocateSpecItem());

const props = defineProps({
  refNode: {
    type: Object,
    default: () => ({}),
  },
  positionType: {
    type: String,
    default: 'above',
  },
});

async function createSpecItem() {
  submintLoading.value = true;
  newSpecItem.value.key = store.State.curProject.key; // TODO: key由后台根据project_id自动生成
  newSpecItem.value.project_id = store.State.curProject.id;
  console.log('refNode', props.refNode);
  console.log('positionType', props.positionType);
  const success = await specStore.curSpec.createSpecItem(
    props.positionType,
    props.refNode ? props.refNode.id : -1,
    newSpecItem.value
  );
  submintLoading.value = false;
  if (success) {
    emit('close');
    onReset();
  }
}

function close() {
  onReset();
  emit('close');
}

async function onSubmit() {
  createSpecItem();
}

function onReset() {
  newSpecItem.value = allocateSpecItem();
}
</script>
