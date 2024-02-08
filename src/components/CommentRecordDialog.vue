<template>
  <mi-window style="width: 60vw; max-width: 80vw;" title="Comment Records">
    <div v-html="ReviewRecordMD" class="markdown-body" style="min-height: 500px"/>
  </mi-window>

</template>

<script setup lang="ts">
import {marked} from 'marked';
import 'github-markdown-css';
import {ref} from 'vue'
import {useCommentStore} from 'stores/comments'
import MiWindow from './base/MiWindow.vue';

const store = useCommentStore()
let ReviewRecord = ref('')
let ReviewRecordMD = ref('')


async function AIReviewRecords() {
  const detailResp = await fetch('/api/stream-comment', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      //'Authorization': 'Bearer ' + Password.value
    },
    body: JSON.stringify({
      'model': 'gpt-4',
      'comments': JSON.stringify(store.Comments),
      'temperature': 0.7,
    })
  })

  const detailReader = detailResp.body!.getReader()
  const detailDecoder = new TextDecoder('utf-8')
  let oldConsoleLog = window.console.log;
  window.console.log = function () {
    return
  };

  ReviewRecord.value = ''
  while (true) {
    const {value, done} = await detailReader.read()
    if (value) {
      ReviewRecord.value = ReviewRecord.value + detailDecoder.decode(value)
      ReviewRecordMD.value = await marked(ReviewRecord.value)
    }

    if (done) {
      break
    }
  }
  window.console.log = oldConsoleLog
}
AIReviewRecords()

</script>

<style scoped>

</style>
