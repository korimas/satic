<template>
  <div class="column bg-grey-1 fit">
    <div class="column q-mx-sm q-mt-md full-height">
      <!-- Project Title -->
      <q-item dense class="q-my-lg">
        <q-item-section avatar top style="margin: auto; min-width: 30px">
          <q-avatar square style="width: 26px; height: 26px">
            <img :src="store.State.curProject.icon" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">{{
            store.State.curProject.name
          }}</q-item-label>
          <q-item-label caption>Software Project</q-item-label>
        </q-item-section>
      </q-item>

      <!-- Specifications -->
      <div class="text-grey-7 text-weight-bold q-pt-md q-pb-sm">
        DEVELOPMENT
      </div>
      <q-expansion-item
        v-model="SpecificationOpen"
        expand-separator
        label="Specifications"
        header-class="bg-grey-4"
      >
        <q-list class="bg-grey-3">
          <q-item
            v-ripple
            v-for="spec in SpecList"
            :key="spec.name"
            clickable
            class="q-pl-lg"
            :to="GenerateSpecTo(spec)"
          >
            <q-item-section avatar style="margin: auto; min-width: 30px">
              <q-icon :name="spec.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ spec.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
      <q-list class="q-mt-sm">
        <q-item
          v-ripple
          v-for="menu in DevelopMenuList"
          :key="menu.name"
          :to="GenerateMenuTo(menu)"
          active-class="menu-active"
          clickable
        >
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
        <q-item
          v-ripple
          v-for="menu in PlanMenuList"
          :key="menu.name"
          clickable
          :to="GenerateMenuTo(menu)"
          active-class="menu-active"
        >
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
        <q-item
          v-ripple
          v-for="menu in OtherMenuList"
          :key="menu.name"
          clickable
        >
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
import { ref } from 'vue';
import { Project, useStateStore } from 'src/stores/state';
import { useRoute } from 'vue-router';

const route = useRoute();
const store = useStateStore();
const SpecificationOpen = ref(true);

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

function LoadCurProject() {
  if (!store.State.curProject) {
    // TODO: 根据当前projectID加载
    store.State.curProject = {
      ID: '1',
      name: 'Falcon I',
      icon: '/icons/random/icon2.svg',
      desc: '',
    };
  }
}
LoadCurProject();
</script>

<style scoped>
.menu-active {
  background-color: #e3f2fd;
  color: #1976d2;
}
</style>
