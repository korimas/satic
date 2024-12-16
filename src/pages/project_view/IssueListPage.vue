<template>
  <q-table
    :loading="tableLoading"
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
          @click="IssueCreateShow = true"
        />
      </div>
    </template>

    <template v-slot:body-cell-key="props">
      <q-td :props="props">
        {{ props.row.key + '-' + props.row.id }}
      </q-td>
    </template>

    <template v-slot:body-cell-type="props">
      <q-td :props="props">
        <q-avatar square style="width: 26px; height: 26px">
          <q-icon
            :name="IssueTypeStyle[props.row.issue_type as keyof typeof IssueTypeStyle].icon"
            :color="IssueTypeStyle[props.row.issue_type as keyof typeof IssueTypeStyle].color"
          />
        </q-avatar>
      </q-td>
    </template>
  </q-table>

  <!--doc create drawer-->
  <q-drawer
    side="right"
    overlay
    v-model="IssueCreateShow"
    bordered
    :width="$q.screen.width > 800 ? 800 : $q.screen.width"
    :breakpoint="800"
  >
    <IssueCreate
      @close="IssueCreateShow = !IssueCreateShow"
      @success="getAllIssues"
    ></IssueCreate>
  </q-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Project } from 'src/data/structs';
import IssueCreate from 'src/components/issues/IssueCreate.vue';
import API from 'src/api/satic';
import { IssueTypeStyle } from 'src/data/style';

let IssueCreateShow = ref(false);
let rows = ref<Project[]>([]);
let selected = ref<Project[]>([]);
let tableLoading = ref(false);
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
    field: 'issue_type',
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

function deleteIssues() {
  console.log(selected.value);
}

async function getAllIssues() {
  tableLoading.value = true;
  const resp = await API.getAllIssues();

  rows.value = resp.result;
  tableLoading.value = false;
}

getAllIssues();
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
