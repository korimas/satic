<template>
  <div class="fit column no-wrap">
    <div class="row col-auto full-width q-pa-xs q-gutter-xs bg-grey-2">
      <q-btn unelevated round size="sm" icon="task_alt" @click="switchTick">
        <q-tooltip class="bg-grey-3 text-black">批量选择</q-tooltip>
      </q-btn>
      <q-btn unelevated round size="sm" icon="delete_forever" @click="deleteItems" :disable="tickStrategy === 'none'">
        <q-tooltip class="bg-grey-3 text-black">删除</q-tooltip>
      </q-btn>
      <!-- <q-btn unelevated round size="sm" icon="output">
        <q-tooltip class="bg-grey-3 text-black">导出</q-tooltip>
      </q-btn>
      <q-btn unelevated round size="sm" icon="input" :disable="true">
        <q-tooltip class="bg-grey-3 text-black">导入</q-tooltip>
      </q-btn> -->
      <q-btn unelevated round size="sm" icon="refresh" @click="handleRefresh">
        <q-tooltip class="bg-grey-3 text-black">刷新</q-tooltip>
      </q-btn>

      <q-space />
      <q-btn unelevated round size="sm" icon="o_chrome_reader_mode"
        @click="store.contentDetailVisible = !store.contentDetailVisible" class="material-icons-outlined">
        <q-tooltip class="bg-grey-3 text-black">展开详细</q-tooltip>
      </q-btn>
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
    <MiTree class="col" style="margin-top: 1px" :nodes="store.curSpec.treeNodes" :item-menus="SpecTreeItemMenus"
      :empty-menus="SpecTreeEmptyMenus" :tick-strategy="tickStrategy" @doubleClick="doubleClick"
      @single-click="singleClick" @menu-click="menuClick" @lazy-load="lazyLoadChildren" @ticked-update="tickedUpdate" />
    <q-inner-loading :showing="loadingTree">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </div>

  <q-drawer side="right" overlay v-model="SpecItemCreateShow" bordered
    :width="$q.screen.width > 800 ? 800 : $q.screen.width" :breakpoint="800" style="z-index: 1000">
    <SpecItemCreate @close="SpecItemCreateShow = !SpecItemCreateShow" :ref-node="operationNode"
      :position-type="positionType"></SpecItemCreate>
  </q-drawer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import SpecItemCreate from 'components/spec/SpecItemCreate.vue';
import MiTree from 'components/base/MiTree.vue';
import {
  SpecTreeItemMenus,
  SpecTreeMenusAction,
  SpecTreeEmptyMenus,
} from 'src/data/style';
import { SpecItem } from 'src/data/structs';
import { SpecPositionType } from 'src/data/constances';
import { useSpecStore } from 'src/stores/spec';

// variables
const store = useSpecStore();
const emit = defineEmits(['close', 'success']);
const SpecItemCreateShow = ref(false); // 新建规范项窗口
const operationNode = ref<SpecItem>({} as SpecItem); // 当前操作的节点
const operationNodeParent = ref<SpecItem>({} as SpecItem); // 当前操作节点的父节点
const positionType = ref(SpecPositionType.Above); // 新建规范项的位置

let tickedItems = ref<string[]>([]); // 选中的规范项
let tickStrategy = ref<'none' | 'strict' | 'leaf' | 'leaf-filtered'>('none');
let loadingTree = ref(false);

// functions
function doubleClick(node: string) {
  console.log(node);
}

async function singleClick(node: string) {
  console.log(node);
  store.curSpec.selectedNodeId = Number(node);
  store.curSpec.jumpToContentNodeId = Number(node);
}

function handleRefresh() {
  store.curSpec.init();
}

function tickedUpdate(ticked: string[]) {
  // TODO: 提高性能
  console.log('ticked update: ', ticked);
  tickedItems.value = ticked;
}

function deleteItems() {
  console.log('delete items: ', tickedItems.value);
  if (tickedItems.value.length === 0) {
    return;
  }
  store.curSpec.deleteSpecItems(tickedItems.value);
  tickedItems.value = [];
}

function switchTick() {
  tickStrategy.value = tickStrategy.value === 'none' ? 'strict' : 'none';
}

async function lazyLoadChildren(
  node: any,
  key: string,
  done: (children: any[]) => void,
  fail: () => void
) {
  console.log('lazy load children: ', key);
  let childrens = await store.curSpec.loadChildrens(Number(key));
  done(childrens);
}

async function menuClick(menu: string, node: SpecItem, parentNode: SpecItem) {
  console.log('menu click: ', menu, node, parentNode);
  operationNode.value = node;
  operationNodeParent.value = parentNode;
  switch (menu) {
    case SpecTreeMenusAction.InsertAbove:
      positionType.value = SpecPositionType.Above;
      SpecItemCreateShow.value = true;
      break;
    case SpecTreeMenusAction.InsertBelow:
      positionType.value = SpecPositionType.Below;
      SpecItemCreateShow.value = true;
      break;
    case SpecTreeMenusAction.InsertChild:
      positionType.value = SpecPositionType.Child;
      SpecItemCreateShow.value = true;
      break;
    case SpecTreeMenusAction.Create:
      positionType.value = SpecPositionType.Below;
      SpecItemCreateShow.value = true;
      break;
    case SpecTreeMenusAction.Delete:
      await store.curSpec.deleteSpecItems([node.id]);
      break;
    default:
      break;
  }
}

function jumpToTreeNode(nodeItem: SpecItem) {
  console.log('jump to node:', nodeItem.path);

  if (nodeItem.depth < 2){
    // root node

  }

  const parents = nodeItem.path.split('/');
  if (parents.length === 0) {
    return;
  }

  console.log('parents:', parents);
  // const node = store.curSpec.findNodeById(nodeId);
  // if (!node) {
  //   return;
  // }


}

watch(
  () => store.curSpec.jumpToTreeNodeItem,
  async (newNodeItem) => {
    if (!newNodeItem || newNodeItem.id < 0) return;
    jumpToTreeNode(newNodeItem);
  },
  {
    immediate: true, // 立即执行一次
  }
);

store.curSpec.init();
</script>
