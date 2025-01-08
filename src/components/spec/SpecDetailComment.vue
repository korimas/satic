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
            <div v-for="(item, index) in comments" :key="index" class="comment-item row no-wrap">
                <q-avatar size="md">
                    <img src="/avatar/128.png" alt="avatar">
                </q-avatar>
                <div class="column q-ml-md col-grow">
                    <div class="text-grey-7">Zhiping Zhou</div>
                    <div v-html="item.content" class="ProseMirror"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, onMounted } from 'vue';
import MiLoading from 'components/base/MiLoading.vue';
import API from 'src/api/satic';
import { useSpecStore } from 'src/stores/spec';

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
// const commentContent = ref('Lorem ipsum dolor sit amet consectetur adipisicing elit.');
const store = useSpecStore();
const comments = ref<any>([]);

function openCommentEdit() {
    isOpenCommentEdit.value = true;
    console.log('open comment edit');
}

function closeCommentEdit() {
    isOpenCommentEdit.value = false;
    console.log('close comment edit');
}

async function getAllComments() {
    console.log('get all comments');
    if (!store.showDetailSpec) {
        return;
    }
    const resp = await API.getSpecComments(store.showDetailSpec.id);
    if (resp.success) {
        comments.value = resp.result;
    }
}

async function updateComment() {
    console.log('update comment');
    const resp = await API.createSpecComment({
        content: comment.value,
        spec_item_id: store.showDetailSpec.id,
        reporter_id: 'a621d1d7-30d9-4f19-89fc-efe5126ca8a4',
        spec_id: store.showDetailSpec.spec_id,
        parent_id: -1,
    });
    if (resp.success) {
        comment.value = '';
        isOpenCommentEdit.value = false;
        comments.value.push(resp.result);
    }
}

onMounted(() => {
    getAllComments();
});
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

.comment-list .ProseMirror{
    padding: 0;
}
</style>