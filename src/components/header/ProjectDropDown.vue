<template>
  <DropDownBtn label="Project">
    <template v-slot:drop-content>
      <q-list
        dense
        bordered
        padding
        class="rounded-borders"
        style="width: 300px"
      >
        <q-item
          dense
          clickable
          v-ripple
          v-for="project in starredProjects"
          :key="project.name"
        >
          <q-item-section avatar top>
            <q-avatar square>
              <img :src="project.icon" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">{{ project.name }}</q-item-label>
            <q-item-label caption>Software Project</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon dense name="star" color="yellow-8" />
          </q-item-section>
        </q-item>
      </q-list>
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
