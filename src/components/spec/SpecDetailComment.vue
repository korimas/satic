<template>
    <div class="comment-box fit">
        <div class="comment-edit row no-wrap fit">
            <q-avatar size="md">
                <img src="/avatar/128.png" alt="avatar">
            </q-avatar>
            <q-input dense class="col-auto " outlined v-model="comment" placeholder="Add a comment"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const comment = ref('');
</script>