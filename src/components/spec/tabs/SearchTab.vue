<template>
    <div>
        <q-input outlined v-model="SesarchText" dense style="padding: 5px">
            <template v-slot:append>
                <q-btn dense flat icon="search" />
            </template>
        </q-input>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

let SesarchText = ref('')
</script>