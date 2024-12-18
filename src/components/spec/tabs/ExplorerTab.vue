<template>
  <div>
    <div class="row full-width q-pa-xs q-gutter-xs bg-grey-2">
      <q-btn
        unelevated
        round
        size="sm"
        icon="add"
        @click="SpecItemCreateShow = true"
      >
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
          <q-list dense style="margin: 3px">
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
    <MiTree
      style="margin-top: 1px"
      :nodes="nodes"
      :menus="SpecTreeMenus"
      @doubleClick="doubleClick"
      @menu-click="menuClick"
    />
  </div>

  <q-drawer
    side="right"
    overlay
    v-model="SpecItemCreateShow"
    bordered
    :width="$q.screen.width > 800 ? 800 : $q.screen.width"
    :breakpoint="800"
    style="z-index: 1000"
  >
    <SpecItemCreate
      @close="SpecItemCreateShow = !SpecItemCreateShow"
      @success="handleSuccess"
    ></SpecItemCreate>
  </q-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDocumentStore, DocTreeNode } from 'stores/document';
import SpecItemCreate from 'components/spec/SpecItemCreate.vue';
import MiTree from 'components/base/MiTree.vue';
import { SpecTreeMenus, SpecTreeMenusAction } from 'src/data/style';

const emit = defineEmits(['close', 'success']);
let SpecItemCreateShow = ref(false);
let nodes = ref<DocTreeNode[]>([]);
const store = useDocumentStore();
nodes.value = store.DocTree;

function doubleClick(node: string) {
  console.log(node);
}

function menuClick(menu: string, nodeKey: string) {
  console.log('menu click: ', menu, nodeKey);
  switch (menu) {
    case SpecTreeMenusAction.InsertAbove:
    case SpecTreeMenusAction.InsertBelow:
    case SpecTreeMenusAction.InsertChild:
      SpecItemCreateShow.value = true;
      break;

    default:
      break;
  }
}

function handleSuccess() {
  emit('success');
}
</script>
