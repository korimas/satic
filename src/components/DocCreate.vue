<template>
    <div class="q-pa-sm q-gutter-sm row bg-grey-2" style="height: 56px">
        <div class="text-h6">Create Requirement</div>
        <q-space></q-space>
        <q-btn unelevated size="sm" icon="clear" color="red-4" @click="close"/>
      </div>
      <q-separator/>
      <div class="column q-pa-md">

        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
        >
          <q-input
            dense
            outlined
            v-model="editSummary"
            label="Summary"
          />

          <q-editor v-model="editDescription" placeholder="Description" min-height="10rem"/>
          <q-input
            dense
            v-model="text"
            outlined
            type="textarea"
            label="Verification Standards"
          />

          <div>
            <q-btn unelevated label="Submit" type="submit" color="primary"/>
          </div>
        </q-form>


      </div>

</template>

<script setup lang="ts">

import {defineEmits} from 'vue'

const emit = defineEmits(['close'])

function close() {
  emit('close')
}

</script>


<style scoped>

</style>
