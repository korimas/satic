<template>
    <div class="column comment-box fit q-gutter-md">
        <div class="comment-edit row no-wrap fit">
            <q-avatar size="md">
                <img src="/avatar/128.png" alt="avatar">
            </q-avatar>
            <div v-if="!isOpenCommentEdit" dense class="col-grow q-ml-md comment-block text-grey-7"
                @click="openCommentEdit">
                Add a comment
            </div>
            <div v-else class="column q-ml-md q-gutter-xs col-grow">
                <MiEditor v-model="comment" />
                <div class="row q-gutter-xs">
                    <q-btn label="Save" color="primary" @click="updateComment" class="q-mt-md" :loading="isUpdating" />
                    <q-btn label="Cancel" flat @click="closeCommentEdit" class="q-mt-md" />
                </div>
            </div>
        </div>
        <div class="comment-list">
            <div class="comment-item row no-wrap">
                <q-avatar size="md">
                    <img src="/avatar/128.png" alt="avatar">
                </q-avatar>
                <div class="column q-ml-md col-grow">
                    <div class="text-grey-7">Zhiping Zhou</div>
                    <div v-html="commentContent" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';
import MiLoading from 'components/base/MiLoading.vue';
import API from 'src/api/satic';

// lazy import
const MiEditor = defineAsyncComponent({
    loader: () => import('components/base/MiEditor.vue'),
    loadingComponent: MiLoading,
    delay: 0,
    timeout: 15000,
});

const comment = ref('');
const isOpenCommentEdit = ref(false);
const isUpdating = ref(false);
const commentContent = ref('Lorem ipsum dolor sit amet consectetur adipisicing elit.');

function openCommentEdit() {
    isOpenCommentEdit.value = true;
    console.log('open comment edit');
}

function closeCommentEdit() {
    isOpenCommentEdit.value = false;
    console.log('close comment edit');
}

function updateComment() {
    console.log('update comment');
}
</script>

<style>
.comment-block {
    border: 1px solid #cfcfcf;
    border-radius: 4px;
    height: 40px;
    line-height: 40px;
    padding-left: 12px
}

.comment-block:hover {
    background-color: #f8f8f8;
    cursor: text;
}
</style>