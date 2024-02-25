<template>
    <q-splitter v-model="splitterModel" unit="px" :limits="[320, Infinity]"
        style="height: calc(100vh - 51px ); overflow: auto;">
        <template v-slot:before>
            <side-box></side-box>
        </template>

        <template v-slot:after>
            <content-box></content-box>
        </template> 

    </q-splitter>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SideBox from 'components/ide/SideBox.vue';
import ContentBox from 'components/ide/ContentBox.vue';

let splitterModel = ref(320)

</script>
