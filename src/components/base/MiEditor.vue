<template>
    <div class="editor-wrapper rounded-borders	">
        <!-- 工具栏 -->
        <div class="editor-toolbar row q-gutter-xs q-mb-xs">
            <q-btn dense flat @click="editor?.chain().focus().undo().run()"
                :disabled="!editor?.can().chain().focus().undo().run()">
                <q-icon name="undo" />
                <q-tooltip class="bg-grey-3 text-black">Undo</q-tooltip>
            </q-btn>
            <q-btn dense flat @click="editor?.chain().focus().redo().run()"
                :disabled="!editor?.can().chain().focus().redo().run()">
                <q-icon name="redo" />
                <q-tooltip class="bg-grey-3 text-black">Redo</q-tooltip>
            </q-btn>
            <q-separator :vertical="true" />

            <q-btn dense flat @click="editor.chain().focus().toggleBold().run()">
                <q-icon name="format_bold" />
                <q-tooltip class="bg-grey-3 text-black">Blod</q-tooltip>
            </q-btn>

            <q-btn dense flat @click="editor.chain().focus().toggleItalic().run()">
                <q-icon name="format_italic" />
            </q-btn>

            <q-btn dense flat @click="editor.chain().focus().toggleStrike().run()">
                <q-icon name="strikethrough_s" />
            </q-btn>

            <q-btn dense flat @click="editor.chain().focus().toggleCode().run()">
                <q-icon name="code" />
            </q-btn>

            <q-btn dense flat @click="editor.chain().focus().toggleHeading({ level: 1 }).run()">
                H1
            </q-btn>

            <q-btn dense flat @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">
                H2
            </q-btn>

            <q-btn dense flat @click="editor.chain().focus().toggleHeading({ level: 3 }).run()">
                H3
            </q-btn>

            <q-btn dense flat @click="editor.chain().focus().toggleBlockquote().run()">
                <q-icon name="format_quote" />
            </q-btn>

            <q-btn dense flat @click="editor.chain().focus().toggleBulletList().run()">
                <q-icon name="format_list_bulleted" />
            </q-btn>

            <q-btn dense flat @click="editor.chain().focus().toggleOrderedList().run()">
                <q-icon name="format_list_numbered" />
            </q-btn>

            <q-btn dense flat
                @click="editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()"
                icon="o_grid_on">
            </q-btn>
            <q-separator :vertical="true" />
            <span v-if="editor.isActive('table')">

                <q-btn dense flat @click="editor.chain().focus().deleteTable().run()">
                    <deleteTable />
                </q-btn>
                <q-btn dense flat @click="editor.chain().focus().addColumnBefore().run()">
                    <addColBefore />
                </q-btn>
                <q-btn dense flat @click="editor.chain().focus().addColumnAfter().run()">
                    <addColAfter />
                </q-btn>
                <q-btn flat dense @click="editor.chain().focus().deleteColumn().run()">
                    <deleteCol />
                </q-btn>
                <q-btn flat dense @click="editor.chain().focus().addRowBefore().run()">
                    <addRowBefore />
                </q-btn>
                <q-btn flat dense @click="editor.chain().focus().addRowAfter().run()">
                    <addRowAfter />
                </q-btn>
                <q-btn flat dense @click="editor.chain().focus().deleteRow().run()">
                    <deleteRow />
                </q-btn>
                <q-btn flat dense @click="editor.chain().focus().mergeOrSplit().run()">
                    <combineCell />
                </q-btn>
            </span>

        </div>
        <q-separator />

        <editor-content :editor="editor" class="q-pt-xs" />
    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';
import deleteTable from '../icons/deleteTable.vue';
import addColBefore from '../icons/addColBefore.vue';
import addColAfter from '../icons/addColAfter.vue';
import combineCell from '../icons/combineCell.vue';
import addRowAfter from '../icons/addRowAfter.vue';
import addRowBefore from '../icons/addRowBefore.vue';
import deleteRow from '../icons/deleteRow.vue';
import deleteCol from '../icons/deleteCol.vue';
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';

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
        Table.configure({
            resizable: true,
        }),
        TableCell,
        TableRow,
        TableHeader,
    ],
})

onBeforeUnmount(() => {
    editor.value.destroy()
})
</script>
<style>
.ProseMirror table {
    border-collapse: collapse;
    margin: 1rem 0;
    overflow: hidden;
    table-layout: fixed;
    width: 80%;
    max-width: 800px;
    margin-left: 0;
    margin-right: auto;
    font-size: 0.9em;
    /* 稍微减小字体大小 */
}

.ProseMirror td,
.ProseMirror th {
    border: 1px solid #ced4da;
    box-sizing: border-box;
    min-width: 1em;
    padding: 5px 7px;
    /* 减小内边距 */
    position: relative;
    vertical-align: top;
    line-height: 1.5;
    /* 减小行高 */
}

.ProseMirror th {
    background-color: #f8f9fa;
    font-weight: bold;
    text-align: left;
    padding: 5px 7px;
    /* 保持表头也是相同的紧凑度 */
}

.ProseMirror td:hover,
.ProseMirror th:hover {
    background-color: #f1f3f5;
}

/* 列宽调整相关样式 */
.ProseMirror .column-resize-handle {
    background-color: #adf;
    bottom: 0;
    pointer-events: none;
    position: absolute;
    right: -2px;
    top: 0;
    width: 4px;
    cursor: col-resize;
}

/* 减小段落间距 */
/* .ProseMirror p {
    margin: 0.5em 0;
} */

.ProseMirror.resize-cursor {
    cursor: col-resize;
}

.ProseMirror .column-resize-handle:hover {
    background-color: #68b5fb;
}

.ProseMirror .selectedCell:after {
    background: rgba(200, 200, 255, 0.4);
    content: "";
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: none;
    position: absolute;
    z-index: 2;
}

/* 表格内容紧凑化 */
.ProseMirror td p,
.ProseMirror th p {
    margin: 0;
    /* 移除单元格内段落的边距 */
}
</style>