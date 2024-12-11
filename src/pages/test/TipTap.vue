<template>
  <editor-content :editor="editor" />
</template>

<script setup lang="ts">
import { defineComponent, ref } from 'vue';

import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'

let editor = ref()
let content = '<p>I’m running Tiptap with Vue.js. 🎉</p>'

editor.value = new Editor({
  content: content,
  extensions: [
    StarterKit,
    Document,
    Paragraph,
    Text,
    Heading.configure({
      levels: [1, 2, 3],
    }),
  ],
})



// beforeUnmount() {
//   this.editor.destroy()
// },

</script>
