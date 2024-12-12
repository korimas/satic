<template>
    <div>
        <div class="row full-width q-pa-xs q-gutter-xs bg-grey-2">
            <q-btn unelevated round size="sm" icon="add">
                <q-tooltip class="bg-grey-3 text-black">创建</q-tooltip>
            </q-btn>
            <q-btn unelevated round size="sm" icon="task_alt">
                <q-tooltip class="bg-grey-3 text-black">批量选择</q-tooltip>
            </q-btn>
            <q-btn unelevated round size="sm" icon="delete_forever">
                <q-tooltip class="bg-grey-3 text-black">删除</q-tooltip>
            </q-btn>
            <q-btn unelevated round size="sm" icon="output">
                <q-tooltip class="bg-grey-3 text-black">导出</q-tooltip>
            </q-btn>
            <q-btn unelevated round size="sm" icon="input">
                <q-tooltip class="bg-grey-3 text-black">导入</q-tooltip>
            </q-btn>
            <q-space />
            <q-btn unelevated size="sm" icon="more_horiz" padding="xs">
                <q-menu auto-close>
                    <q-list dense style="margin: 3px;">
                        <q-item clickable>
                            <q-item-section avatar>
                                <q-icon name="share" />
                            </q-item-section>
                            <q-item-section>分享链接</q-item-section>
                        </q-item>

                        <q-item clickable>
                            <q-item-section avatar>
                                <q-icon name="settings" />
                            </q-item-section>
                            <q-item-section>设置</q-item-section>
                        </q-item>

                    </q-list>
                </q-menu>
            </q-btn>
        </div>
        <MiTree style="margin-top: 1px" :nodes="nodes" @doubleClick="doubleClick" />

    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDocumentStore, DocTreeNode } from 'stores/document'
import MiTree from 'components/base/MiTree.vue';

let nodes = ref<DocTreeNode[]>([])
const store = useDocumentStore();
nodes.value = store.DocTree

function doubleClick(node: DocTreeNode) {
    console.log(node)
}

</script>