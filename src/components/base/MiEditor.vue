<template>
    <div class="editor-wrapper rounded-borders	">
        <!-- 工具栏 -->
        <div class="editor-toolbar row q-gutter-x-xs q-ma-xs">
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

        <editor-content :editor="editor" class="q-pt-xs editor" />

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
import Gapcursor from "@tiptap/extension-gapcursor"

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
        Gapcursor,
    ],
})

onBeforeUnmount(() => {
    editor.value.destroy()
})
</script>
<style>
/* 编辑器容器样式 */
.editor-wrapper {
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
}

/* 移除编辑器默认轮廓 */
.ProseMirror {
    outline: none !important;
    padding: 1rem;
}

/* 编辑器获得焦点时的样式 */
.ProseMirror:focus {
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

/* 编辑器内容区域样式 */
.tiptap {
    min-height: 200px;
    background-color: white;
}

/* 表格样式 */
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

/* 代码块样式 */
.ProseMirror code {
    background-color: #f5f5f5;
    color: #24292e;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
    font-size: 0.9em;
}

/* 引用块样式 */
.ProseMirror blockquote {
    border-left: 4px solid #ddd;
    margin: 1rem 0;
    padding: 0.5rem 1rem;
    color: #666;
    background-color: #f8f9fa;
}

.ProseMirror blockquote p {
    margin: 0;
    line-height: 1.5;
}

/* 标题 */
.ProseMirror h1 {
    font-size: 2em;
    color: #2c3e50;
    font-weight: 600;
    line-height: 1.3;
    /* margin: 1.5em 0 0.8em; */
    padding-bottom: 0.3em;
    border-bottom: 2px solid #eaecef;
}

.ProseMirror h2 {
    font-size: 1.5em;
    color: #34495e;
    font-weight: 600;
    line-height: 1.35;
    margin: 1.3em 0 0.7em;
    padding-bottom: 0.2em;
    border-bottom: 1px solid #eaecef;
}

.ProseMirror h3 {
    font-size: 1.25em;
    color: #3c4858;
    font-weight: 600;
    line-height: 1.4;
    margin: 1.2em 0 0.6em;
}

/* 当标题被选中时的样式 */
.ProseMirror h1.is-active,
.ProseMirror h2.is-active,
.ProseMirror h3.is-active {
    background-color: rgba(44, 62, 80, 0.05);
    border-radius: 4px;
    padding-left: 0.5em;
}
</style>
