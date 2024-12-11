<template>
  <div class="column bg-grey-1 fit">
    <div class="column q-mx-sm q-mt-md full-height">
      <!-- Project Title -->
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

      <!-- Issues -->
      <div class="text-grey-7 text-weight-bold q-py-sm">PLANNING</div>
      <q-list>
        <q-item
          v-ripple
          v-for="menu in PlanMenuList"
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

const CurProject = ref('Falcon2.1');
const CurProjectIcon = ref('/icons/random/icon2.svg');
const SpecificationOpen = ref(true);

const SpecList = ref([
  { name: 'System Requirement', icon: 'article' },
  { name: 'System Architectural', icon: 'article' },
  { name: 'Software Requirement', icon: 'article' },
  { name: 'Software Architectural', icon: 'article' },
]);

const PlanMenuList = ref([{ name: 'Issues', icon: 'tips_and_updates' }]);
const DevelopMenuList = ref([{ name: 'Reviews', icon: 'reviews' }]);
const OtherMenuList = ref([{ name: 'Settings', icon: 'settings' }]);
</script>
