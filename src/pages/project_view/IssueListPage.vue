<template>
  <q-table
    :loading="projectLoading"
    class="work-item-table"
    flat
    selection="multiple"
    :rows="rows"
    v-model:selected="selected"
    :columns="columns"
    row-key="id"
    :pagination="initialPagination"
  >
    <!--表格顶部内容:插槽-->
    <template v-slot:top>
      <div class="q-gutter-sm row full-width" style="margin: 0">
        <!--表格标题-->
        <div class="q-table__title text-h5">Issues</div>
        <q-space></q-space>

        <!--批量删除按钮-->
        <q-btn
          outline
          size="13px"
          icon="delete"
          color="red"
          label="Delete"
          :disabled="selected.length < 1"
          @click="deleteIssues"
        />
        <!--创建按钮-->
        <q-btn
          unelevated
          size="13px"
          color="green"
          icon="add"
          label="ADD"
          @click="ProjectCreateShow = true"
        />
      </div>
    </template>

    <template v-slot:body-cell-project="props">
      <q-td :props="props">
        <q-item
          :to="{ name: 'IssuesList', params: { projectId: props.row.id } }"
          dense
          clickable
          class="q-py-sm"
          active-class="my-active-q-item"
        >
          <q-item-section avatar top style="margin: auto; min-width: 30px">
            <q-avatar square style="width: 26px; height: 26px">
              <img :src="'/icons/random/' + props.row.icon" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">{{ props.row.name }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-td>
    </template>
  </q-table>

  <!--doc create drawer-->
  <q-drawer
    side="right"
    overlay
    v-model="ProjectCreateShow"
    bordered
    :width="$q.screen.width > 800 ? 800 : $q.screen.width"
    :breakpoint="800"
  >
    <IssueCreate
      @close="ProjectCreateShow = !ProjectCreateShow"
      @success="getAllIssues"
    ></IssueCreate>
  </q-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Project } from 'src/data/structs';
import IssueCreate from 'src/components/issues/IssueCreate.vue';
import API from 'src/api/satic';

let ProjectCreateShow = ref(false);
let rows = ref<Project[]>([]);
let selected = ref<Project[]>([]);
let projectLoading = ref(false);
let columns = [
  {
    name: 'key',
    required: true,
    label: 'Key',
    align: 'left' as const,
    field: 'key',
    headerStyle: 'width: 100px',
    // format: (val) => `${val}`,
  },
  {
    name: 'type',
    required: true,
    label: 'Type',
    align: 'left' as const,
    headerStyle: 'width: 50px',
    field: 'type',
    // format: (val) => `${val}`,
  },
  {
    name: 'summary',
    required: true,
    label: 'Summary',
    align: 'left' as const,
    field: 'summary',
    // format: (val) => `${val}`,
  },
  {
    name: 'fixVersion',
    required: true,
    label: 'FixVersion',
    align: 'left' as const,
    field: 'fixVersion',
    // format: (val) => `${val}`,
  },
  {
    name: 'reporter',
    required: true,
    label: 'Reporter',
    align: 'left' as const,
    field: 'reporter',
    // format: (val) => `${val}`,
  },
  {
    name: 'assignee',
    required: true,
    label: 'Assignee',
    align: 'left' as const,
    field: 'assignee',
    // format: (val) => `${val}`,
  },
  {
    name: 'status',
    required: true,
    label: 'Status',
    align: 'left' as const,
    field: 'status',
    // format: (val) => `${val}`,
  },
];
let initialPagination = {
  sortBy: 'date',
  descending: false,
  page: 1,
  rowsPerPage: 50,
};

function getIssueIcon(issue_type: string) {
  switch (issue_type) {
    case 'bug':
      return 'bug_report';
    case 'task':
      return 'task';
    default:
      return 'data_saver_off';
  }
}

function deleteIssues() {
  console.log(selected.value);
}

function getAllIssues() {
  console.log('get all issues');
}
</script>

<style>
.work-item-table .q-textarea {
  width: 100% !important;
  height: 100% !important;
}

.work-item-table .q-textarea.q-field--dense .q-field__control,
.work-item-table .q-textarea.q-field--dense .q-field__native {
  min-height: 36px;
  height: 100%;
}
</style>
