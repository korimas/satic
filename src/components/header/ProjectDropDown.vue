<template>
  <DropDownBtn label="Project">
    <template v-slot:drop-content>
      <q-list
        dense
        bordered
        padding
        class="rounded-borders"
        style="width: 100%; width: 200px"
      >
        <q-item clickable v-close-popup>
          <q-item-section avatar>
            <q-icon name="join_right" />
          </q-item-section>
          <q-item-section> Falcon I </q-item-section>
        </q-item>

        <q-item clickable v-close-popup>
          <q-item-section avatar>
            <q-icon name="view_cozy" />
          </q-item-section>
          <q-item-section> Falcon G </q-item-section>
        </q-item>

        <q-item clickable v-close-popup>
          <q-item-section avatar>
            <q-icon name="join_left" />
          </q-item-section>
          <q-item-section> Falcon 10K </q-item-section>
        </q-item>
      </q-list>
    </template>
  </DropDownBtn>
</template>

<script setup lang="ts">
import DropDownBtn from './DropDownBtn.vue';
</script>
