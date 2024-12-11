<template>
  <DropDownBtn label="Project">
    <template v-slot:drop-content>
      <div class="column">
        <div class="q-mt-md q-mx-md text-grey-7">Starred</div>
        <q-list padding style="width: 300px">
          <q-item
            v-for="project in starredProjects"
            :to="{ name: 'IssuesList', params: { projectId: project.ID } }"
            @click="UpdateCurProject(project)"
            dense
            clickable
            :key="project.name"
            class="q-py-sm"
            active-class="my-active-q-item"
          >
            <q-item-section avatar top style="margin: auto; min-width: 30px">
              <q-avatar square style="width: 26px; height: 26px">
                <img :src="project.icon" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">{{ project.name }}</q-item-label>
              <q-item-label caption>Software Project</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn
                color="yellow-8"
                class="gt-xs"
                size="10px"
                flat
                dense
                round
                icon="star"
              />
            </q-item-section>
          </q-item>
        </q-list>
        <div class="q-mx-md text-grey-7">Recent</div>
        <q-list padding style="width: 300px">
          <q-item
            @click="UpdateCurProject(project)"
            dense
            clickable
            v-for="project in recentProjects"
            :to="{ name: 'IssuesList', params: { projectId: project.ID } }"
            :key="project.name"
            class="q-py-sm"
            active-class="my-active-q-item"
          >
            <q-item-section avatar top style="margin: auto; min-width: 30px">
              <q-avatar square style="width: 26px; height: 26px">
                <img :src="project.icon" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">{{ project.name }}</q-item-label>
              <q-item-label caption>Software Project</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn
                color="yellow-8"
                class="gt-xs"
                size="10px"
                flat
                dense
                round
                icon="star_border"
              />
            </q-item-section>
          </q-item>
        </q-list>
        <q-separator />
        <q-list padding style="width: 300px">
          <q-item clickable>
            <q-item-section avatar style="margin: auto; min-width: 30px">
              <q-icon name="apps" />
            </q-item-section>
            <q-item-section>View all projects</q-item-section>
          </q-item>
          <q-item clickable>
            <q-item-section avatar style="margin: auto; min-width: 30px">
              <q-icon name="add" />
            </q-item-section>
            <q-item-section>Add Project</q-item-section>
          </q-item>
        </q-list>
      </div>
    </template>
  </DropDownBtn>
</template>

<script setup lang="ts">
import DropDownBtn from './DropDownBtn.vue';
import { ref } from 'vue';

import { Project, useStateStore } from 'src/stores/state';
const store = useStateStore();
const starredProjects = ref<Project[]>([
  { name: 'Falcon I', icon: '/icons/random/icon2.svg', ID: '1', desc: '' },
  { name: 'Falcon G', icon: '/icons/random/icon3.svg', ID: '2', desc: '' },
  { name: 'Falcon 10K', icon: '/icons/random/icon4.svg', ID: '3', desc: '' },
]);
const recentProjects = ref([
  { name: 'Falcon II', icon: '/icons/random/icon2.svg', ID: '4', desc: '' },
  { name: 'Falcon 2.1', icon: '/icons/random/icon3.svg', ID: '5', desc: '' },
  { name: 'Falcon II Pro', icon: '/icons/random/icon4.svg', ID: '6', desc: '' },
]);

function UpdateCurProject(project: Project) {
  console.log('UpdateCurProject', project);
  store.State.curProject = project;
}
</script>

<style scoped>
.my-active-q-item {
  background-color: #e3f2fd;
  color: #1976d2;
}
</style>
