<template>
  <mi-window @close="close" title="Add Requirement">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input dense outlined v-model="editSummary" label="Summary" />

      <q-editor
        v-model="editDescription"
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

      <q-card v-show="AIGeneratingContent" flat bordered class="bg-grey-2">
        <q-card-section horizontal style="width: 100%">
          <div class="q-ma-md col">
            {{ AIGeneratingContent }}
          </div>

          <q-card-actions vertical class="justify-around q-px-md col-auto">
            <q-btn
              :disable="AIGenerating"
              flat
              round
              color="grey-8"
              icon="publish"
              @click="Publish"
            />
          </q-card-actions>
        </q-card-section>
      </q-card>

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
let editSummary = ref('');
let editDescription = ref('');
let AIGenerating = ref(false);
let AIGeneratingContent = ref('');

function close() {
  emit('close');
}

async function AIGenerate() {
  if (AIGenerating.value || editDescription.value === '') {
    return;
  }

  AIGenerating.value = true;
  const detailResp = await fetch('/api/stream-gen-req', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      //'Authorization': 'Bearer ' + Password.value
    },
    body: JSON.stringify({
      model: 'gpt-4',
      requirement: editDescription.value,
      temperature: 0.7,
    }),
  });

  const detailReader = detailResp.body!.getReader();
  const detailDecoder = new TextDecoder('utf-8');
  let oldConsoleLog = window.console.log;
  window.console.log = function () {
    return;
  };

  AIGeneratingContent.value = '';
  while (true) {
    const { value, done } = await detailReader.read();
    if (value) {
      AIGeneratingContent.value =
        AIGeneratingContent.value + detailDecoder.decode(value);
    }

    if (done) {
      break;
    }
  }
  AIGenerating.value = false;
  window.console.log = oldConsoleLog;
}

function onSubmit() {
  console.log(editSummary.value);
  console.log(editDescription.value);
  console.log(AIGeneratingContent.value);
}

function onReset() {
  editSummary.value = '';
  editDescription.value = '';
  AIGeneratingContent.value = '';
}

function Publish() {
  editDescription.value = AIGeneratingContent.value;
  AIGeneratingContent.value = '';
}
</script>
