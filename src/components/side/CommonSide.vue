<template>
  <div class="column bg-grey-1 fit">
    <div class="column q-mx-sm q-mt-md full-height">
      <!-- Project Title -->
      <q-item dense class="q-my-lg">
        <q-item-section avatar top style="margin: auto; min-width: 30px" v-if="curProjectIcon">
          <q-avatar square style="width: 35px; height: 35px">
            <img :src="'/icons/random/' + curProjectIcon" />
          </q-avatar>
        </q-item-section>

        <q-item-section v-if="curProjectName">
          <q-item-label lines="1">{{ curProjectName }}</q-item-label>
          <q-item-label caption>Software Project</q-item-label>
        </q-item-section>
        <q-inner-loading :showing="!curProjectIcon" />
      </q-item>

      <!-- Specifications -->
      <div class="text-grey-7 text-weight-bold q-pt-md q-pb-sm">
        DEVELOPMENT
      </div>
      <q-expansion-item v-model="SpecificationOpen" expand-separator label="Specifications" header-class="bg-grey-4">
        <q-list class="bg-grey-3">
          <!-- list all specs -->
          <q-item v-ripple v-for="spec in SpecList" :key="spec.name" clickable class="q-pl-lg"
            :to="GenerateSpecTo(spec)" active-class="menu-active">
            <q-item-section avatar style="margin: auto; min-width: 30px">
              <q-icon :name="spec.icon ?? 'article'" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ spec.name }}</q-item-label>
            </q-item-section>
          </q-item>

          <!-- create spec -->
          <q-item v-ripple clickable class="q-pl-lg bg-grey-2" @click="OpenSpecCreateDrawer">
            <q-item-section avatar style="margin: auto; min-width: 30px">
              <q-icon name="add" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Create Specification</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
      <q-list class="q-mt-sm">
        <q-item v-ripple v-for="menu in DevelopMenuList" :key="menu.name" :to="GenerateMenuTo(menu)"
          active-class="menu-active" clickable>
          <q-item-section avatar style="margin: auto; min-width: 30px">
            <q-icon :name="menu.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ menu.name }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <!-- Issues -->
      <div class="text-grey-7 text-weight-bold q-py-sm">PLANNING</div>
      <q-list>
        <q-item v-ripple v-for="menu in PlanMenuList" :key="menu.name" clickable :to="GenerateMenuTo(menu)"
          active-class="menu-active">
          <q-item-section avatar style="margin: auto; min-width: 30px">
            <q-icon :name="menu.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ menu.name }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-space />
      <q-list class="q-mb-md">
        <q-item v-ripple v-for="menu in OtherMenuList" :key="menu.name" clickable>
          <q-item-section avatar style="margin: auto; min-width: 30px">
            <q-icon :name="menu.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ menu.name }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>


</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useStateStore } from 'src/stores/state';
import { useDrawerStore } from 'src/stores/drawer';
import { useRoute, useRouter } from 'vue-router';
import API from 'src/api/satic';

const route = useRoute();
const router = useRouter();
const store = useStateStore();
const drawerStore = useDrawerStore();
const SpecificationOpen = ref(true);
const curProjectIcon = ref('');
const curProjectName = ref('');

const SpecList = ref([
  { name: 'System Requirement', icon: 'article', ID: '1' },
  { name: 'System Architectural', icon: 'article', ID: '2' },
  { name: 'Software Requirement', icon: 'article', ID: '3' },
  { name: 'Software Architectural', icon: 'article', ID: '4' },
]);

const PlanMenuList = ref([
  {
    name: 'Issues',
    icon: 'tips_and_updates',
    to: 'IssuesList',
  },
  {
    name: 'Releases',
    icon: 'directions_boat',
    to: 'ReleasesList',
  },
]);
const DevelopMenuList = ref([
  {
    name: 'Reviews',
    icon: 'reviews',
    to: 'ReviewsList',
  },
]);
const OtherMenuList = ref([
  {
    name: 'Settings',
    icon: 'settings',
  },
]);

// functions
function OpenSpecCreateDrawer() {
  drawerStore.CreateSpecDrawer.openDrawer();
}

// 生成跳转路由参数
function GenerateMenuTo(menu: any) {
  return {
    name: menu.to,
    params: { projectId: route.params.projectId }, // TODO: 根据curProjectID加载
  };
}

function GenerateSpecTo(spec: any) {
  return {
    name: 'SpecDetail',
    params: { projectId: route.params.projectId, specId: spec.ID },
  };
}

async function LoadCurProject() {
  if (!route.params.projectId) {
    return;
  }

  const resp = await API.getProject(route.params.projectId);
  if (resp.result) {
    store.State.curProject = resp.result;
    curProjectIcon.value = resp.result.icon;
    curProjectName.value = resp.result.name;
  } else {
    router.push({ path: '/errors/notfound' });
  }
}

watch(
  () => route.params.projectId,
  (newId, oldId) => {
    console.log('Switch Project:', { newId, oldId });
    curProjectName.value = '';
    curProjectIcon.value = '';
    drawerStore.CreateSpecDrawer.show = false
    drawerStore.DetailSpecDrawer.show = false
    LoadCurProject();
  }
);

LoadCurProject();
</script>

<style scoped>
.menu-active {
  background-color: #e3f2fd;
  color: #1976d2;
}
</style>
