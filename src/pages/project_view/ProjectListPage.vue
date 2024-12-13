<template>
  <q-table
    class="work-item-table"
    flat
    selection="multiple"
    :rows="rows"
    v-model:selected="selected"
    :columns="columns"
    row-key="ID"
    :pagination="initialPagination"
  >
    <!--表格顶部内容:插槽-->
    <template v-slot:top>
      <div class="q-gutter-sm row full-width" style="margin: 0">
        <!--表格标题-->
        <div class="q-table__title text-h5">Projects</div>
        <q-space></q-space>

        <!--批量删除按钮-->
        <q-btn
          outline
          size="13px"
          icon="delete"
          color="red"
          label="Delete"
          :disabled="selected.length < 1"
          @click="deleteProjects"
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
          :to="{ name: 'IssuesList', params: { projectId: props.row.ID } }"
          dense
          clickable
          class="q-py-sm"
          active-class="my-active-q-item"
        >
          <q-item-section avatar top style="margin: auto; min-width: 30px">
            <q-avatar square style="width: 26px; height: 26px">
              <img :src="props.row.icon" />
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
    <ProjectCreate
      @close="ProjectCreateShow = !ProjectCreateShow"
    ></ProjectCreate>
  </q-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { AllProjects } from 'src/data/demo';
import { Project } from 'src/data/structs';
import ProjectCreate from 'src/components/projects/ProjectCreate.vue';

let ProjectCreateShow = ref(false);
let rows = ref<Project[]>(AllProjects);
let selected = ref<Project[]>([]);
let columns = [
  {
    name: 'project',
    required: true,
    label: 'Name',
    align: 'left' as const,
    field: 'name',
    // format: (val) => `${val}`,
    headerStyle: 'width: 150px',
  },
  {
    name: 'key',
    required: true,
    label: 'Key',
    align: 'left' as const,
    field: 'key',
    // headerStyle: 'width: 100px',
    // format: (val) => `${val}`,
  },
  {
    name: 'ID',
    required: true,
    label: 'ID',
    align: 'left' as const,
    field: 'ID',
    // format: (val) => `${val}`,
  },
  {
    name: 'description',
    required: true,
    label: 'Description',
    align: 'left' as const,
    field: 'desc',
    // format: (val) => `${val}`,
  },
];
let initialPagination = {
  sortBy: 'date',
  descending: false,
  page: 1,
  rowsPerPage: 50,
};

function deleteProjects() {
  rows.value = rows.value.filter((row) => !selected.value.includes(row));
  selected.value = [];
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
