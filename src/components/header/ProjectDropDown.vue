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
        <q-item clickable v-ripple>
          <q-item-section avatar top>
            <q-avatar>
              <img src="/public/icon1.png" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">Falcon I</q-item-label>
            <q-item-label caption>Software Project</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="star" color="green" />
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
  { name: 'Falcon I', id: 1 },
  { name: 'Falcon G', id: 2 },
  { name: 'Falcon 10K', id: 3 },
]);
</script>
