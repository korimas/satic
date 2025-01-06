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
import { ref, onBeforeUnmount, watch } from 'vue';
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
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:modelValue'])

let editor = ref()
editor.value = new Editor({
    content: props.modelValue,
    extensions: [
        StarterKit.configure({  
            // 可以在这里配置 StarterKit 中包含的扩展  
            heading: {  
                levels: [1, 2, 3]  
            }  
        }),  
        Table.configure({
            resizable: true,
        }),
        TableCell,
        TableRow,
        TableHeader,
    ],
    onUpdate: ({ editor }) => {
        // 当编辑器内容变化时，发送更新事件  
        emit('update:modelValue', editor.getHTML())
    },
})

watch(
    () => props.modelValue,
    (newValue) => {
        // 只有当编辑器内容与新值不同时才更新  
        const editorContent = editor.value?.getHTML()
        if (newValue !== editorContent) {
            editor.value?.commands.setContent(newValue, false)
        }
    }
)

onBeforeUnmount(() => {
    editor.value.destroy()
})
</script>
<style>
@import 'src/css/editor.css';
</style>
