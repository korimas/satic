<template>
    <mi-window @close="close" title="Create Spec">


    </mi-window>

</template>

<script setup lang="ts">
import { defineEmits, ref, defineProps, defineAsyncComponent } from 'vue';
import MiWindow from 'components/base/MiWindow.vue';
import { useDrawerStore } from 'src/stores/drawer';

const emit = defineEmits(['successCreate']);
const store = useDrawerStore();


function close() {
    onReset();
    store.CreateSpecDrawer.closeDrawer();
}

function onReset() {
    console.log('onReset');
}
</script>