<template>
    <div class="row" style="height: calc(100vh - 51px ); overflow: auto;">
        <q-splitter v-model="splitterModel" unit="px">

            <template v-slot:before>
                <div class="q-pa-md">
                    <div class="text-h4 q-mb-md">Before</div>
                    <div v-for="n in 20" :key="n" class="q-my-md">{{ n }}. Lorem ipsum dolor sit, amet consectetur
                        adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus
                        obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</div>
                </div>
            </template>

            <template v-slot:after>
                <div class="q-pa-md">
                    <div class="text-h4 q-mb-md">After</div>
                    <div v-for="n in 20" :key="n" class="q-my-md">{{ n }}. Lorem ipsum dolor sit, amet consectetur
                        adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus
                        obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</div>
                </div>
            </template>

        </q-splitter>
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

let DocSideShow = ref(true);
let splitterModel = ref(300)
const CloseWindow = () => {
    // Emit the 'close' event to notify the parent component
    emit('close');
};
</script>

<style>
.q-splitter__before{
    min-width: 300px;
}
</style>