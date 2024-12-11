<template>
  <DropDownBtn label="Project">
    <template v-slot:drop-content>
      <div class="column">
        <div class="q-mt-md q-mx-md text-grey-7">Starred</div>
        <q-list padding style="width: 300px">
          <q-item
            dense
            clickable
            v-ripple
            v-for="project in starredProjects"
            :key="project.name"
            class="q-py-sm"
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
              <q-icon
                dense
                name="star"
                color="yellow-8"
                style="font-size: 14px"
              />
            </q-item-section>
          </q-item>
        </q-list>
        <div class="q-mx-md text-grey-7">Recent</div>
        <q-list padding style="width: 300px">
          <q-item
            dense
            clickable
            v-ripple
            v-for="project in starredProjects"
            :key="project.name"
            class="q-py-sm"
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
              <q-icon
                dense
                name="star"
                color="yellow-8"
                style="font-size: 14px"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </template>
  </DropDownBtn>
</template>

<script setup lang="ts">
import DropDownBtn from './DropDownBtn.vue';
import { ref } from 'vue';

const starredProjects = ref([
  { name: 'Falcon I', icon: '/icons/random/icon2.svg' },
  { name: 'Falcon G', icon: '/icons/random/icon3.svg' },
  { name: 'Falcon 10K', icon: '/icons/random/icon4.svg' },
]);
</script>
