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
        <div class="q-table__title text-h5">
          {{ tableTitle }}
        </div>
        <q-space></q-space>

        <!--批量删除按钮-->
        <q-btn
          outline
          size="13px"
          icon="delete"
          color="red"
          label="Delete"
          :disabled="selected.length < 1"
          @click="deleteSelectedWorks(dayWork)"
        />
        <!--创建按钮-->
        <q-btn
          unelevated
          size="13px"
          color="green"
          icon="add"
          label="ADD"
          @click="addWorkItem(dayWork)"
        />
      </div>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { AllProjects } from 'src/data/demo';

defineOptions({
  name: 'DailyWorkTable',
});

// props
interface Props {
  dayWork: string;
}

const props = defineProps<Props>();
let dayWork = ref(props.dayWork);
let tableTitle = 'Projects';
let rows = ref(AllProjects);
let selected = ref([]);
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
