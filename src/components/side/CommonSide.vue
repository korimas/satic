<template>
  <div class="column bg-grey-1 fit">
    <div class="q-mx-sm q-mt-md">
      <q-item dense class="q-my-lg">
        <q-item-section avatar top style="margin: auto; min-width: 30px">
          <q-avatar square style="width: 26px; height: 26px">
            <img :src="CurProjectIcon" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">{{ CurProject }}</q-item-label>
          <q-item-label caption>Software Project</q-item-label>
        </q-item-section>
      </q-item>

      <div class="text-grey-7 text-weight-bold q-py-sm">PLANNING</div>
      <q-list>
        <q-item v-for="menu in PlanMenuList" :key="menu.name" clickable>
          <q-item-section avatar style="margin: auto; min-width: 30px">
            <q-icon :name="menu.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ menu.name }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <div class="text-grey-7 text-weight-bold q-pt-md q-pb-sm">
        DEVELOPMENT
      </div>
      <!-- Issues -->
      <q-expansion-item
        v-model="SpecificationOpen"
        expand-separator
        icon="article"
        label="Specifications"
        header-class="bg-grey-4"
      >
        <q-list class="bg-grey-3">
          <q-item
            v-for="spec in SpecList"
            :key="spec.name"
            clickable
            class="q-pl-lg"
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
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const CurProject = ref('Falcon2.1');
const CurProjectIcon = ref('/icons/random/icon2.svg');
const SpecificationOpen = ref(true);

const SpecList = ref([
  { name: 'System Requirement', icon: 'code' },
  { name: 'System Architectural', icon: 'code' },
  { name: 'Software Requirement', icon: 'code' },
  { name: 'Software Architectural', icon: 'code' },
]);

const PlanMenuList = ref([{ name: 'Issues', icon: 'tips_and_updates' }]);
</script>
