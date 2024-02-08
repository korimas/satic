<template>
  <mi-window title="Comments" style="width: 60vw; max-width: 80vw;">
    <div class="column q-gutter-y-md">
        <q-input v-model="Name" label="Name"/>

        <q-input
          v-model="CommentInput"
          filled
          type="textarea"
        >
          <template v-slot:append>
            <q-btn round dense flat icon="send" @click="addComment"/>
          </template>
        </q-input>

        <div class="q-gutter-md q-pt-md">
          <q-card  flat bordered v-for="(comment, index) in RequirementComment.comments" :key="index">
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png">
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ comment.name }}</q-item-label>
                <q-item-label caption>
                  Requirement Engineer
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-separator/>

            <q-card-section>
              {{ comment.comment }}
            </q-card-section>
          </q-card>
        </div>

      </div>
    </mi-window>
</template>

<script setup lang="ts">

import {computed, defineProps, ref} from 'vue'
import {useCommentStore} from 'stores/comments'
import MiWindow from './base/MiWindow.vue';

// const emit = defineEmits(['close'])
const props = defineProps({
  reqId: {
    type: String,
    required: true
  },
  reqDesc: {
    type: String,
    required: true
  }
})


const store = useCommentStore();
let RequirementComment = computed(() => store.Comments[props.reqId] || {requirementID:props.reqId, comments: []})

let CommentInput = ref('')
let Name = ref('')

// function close() {
//   emit('close')
// }

function addComment() {
  store.addComment(props.reqId, CommentInput.value, Name.value, props.reqDesc)
  CommentInput.value = ''
}

</script>

<style scoped>

</style>
