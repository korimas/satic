<template>
    <div>
        <div v-if="showTitleBar" class="q-pa-sm q-gutter-sm row bg-grey-2" style="height: 56px">
            <div class="text-h6">{{ title }}</div>
            <q-space></q-space>
            <q-btn unelevated size="sm" icon="clear" color="red-4" @click="CloseWindow" v-close-popup />
        </div>
        <q-separator color="grey-4" />
        <div class="q-pa-md bg-white">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineEmits, ref } from 'vue';

const emit = defineEmits(['close'])
const props = defineProps({
    showTitleBar: {
        type: Boolean,
        default: true
    },
    title: {
        type: String,
        default: "Window Title"
    }
})

const CloseWindow = () => {
    // Emit the 'close' event to notify the parent component
    emit('close');
};
</script>