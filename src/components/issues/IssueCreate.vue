<template>
  <mi-window @close="close" title="Add Issue">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-select
        dense
        filled
        v-model="newIssue.issue_type"
        :options="IssueTypes"
        stack-label
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section avatar top style="margin: auto; min-width: 30px">
              <q-avatar square style="width: 26px; height: 26px">
                <q-icon
                  :name="IssueTypeStyle[scope.opt as keyof typeof IssueTypeStyle].icon"
                  :color="IssueTypeStyle[scope.opt as keyof typeof IssueTypeStyle].color"
                />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">{{ scope.opt }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>

        <template v-slot:selected-item="scope">
          <div v-if="!scope.opt" class="text-grey-8">Issue type</div>
          <q-item v-else dense style="padding-left: 0px">
            <q-item-section avatar top style="margin: auto; min-width: 30px">
              <q-avatar square style="width: 26px; height: 26px">
                <q-icon
                  :name="IssueTypeStyle[scope.opt as keyof typeof IssueTypeStyle].icon"
                  :color="IssueTypeStyle[scope.opt as keyof typeof IssueTypeStyle].color"
                />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">{{ scope.opt }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-input dense filled v-model="newIssue.summary" placeholder="Summary" />

      <q-editor
        v-model="newIssue.description"
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

      <q-input
        dense
        filled
        v-model="newIssue.due_date"
        mask="date"
        :rules="['date']"
        placeholder="Due Date"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="newIssue.due_date">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
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
import { Issue } from 'src/data/structs';
import { IssueTypes, IssueTypeStyle } from 'src/data/style';
// import MiInput from '../base/MiInput.vue';
import API from 'src/api/satic';
import { useStateStore } from 'src/stores/state';
const store = useStateStore();

const emit = defineEmits(['close', 'success']);
let submintLoading = ref(false);
let newIssue = ref<Issue>(getNewIssue());

function getNewIssue() {
  return {
    id: 0,
    key: store.State.curProject.key,
    project_id: store.State.curProject.id,
    issue_type: '',
    summary: '',
    description: '',
    priority: '',
    status: '',
    reporter_id: '',
    assignee_id: '',
    due_date: '',
    start_date: '',
    parent_issue_id: 0,
    custom_fields: {},
    created_at: '',
    updated_at: '',
  };
}

async function createIssue() {
  let resp = await API.createIssue(newIssue.value);
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
  createIssue();
}

function onReset() {
  newIssue.value = getNewIssue();
}
</script>
