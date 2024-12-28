<template>
  <div class="fit column no-wrap">
    <div class="row col-auto full-width q-pa-xs q-gutter-xs bg-grey-2">
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
      <q-btn unelevated round size="sm" icon="refresh" @click="handleRefresh">
        <q-tooltip class="bg-grey-3 text-black">刷新</q-tooltip>
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
      class="col"
      style="margin-top: 1px"
      :nodes="store.curSpec.treeNodes"
      :item-menus="SpecTreeItemMenus"
      :empty-menus="SpecTreeEmptyMenus"
      @doubleClick="doubleClick"
      @menu-click="menuClick"
      @lazy-load="lazyLoadChildren"
    />
    <q-inner-loading :showing="loadingTree">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
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
      :ref-node="operationNode"
      :position-type="positionType"
    ></SpecItemCreate>
  </q-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SpecItemCreate from 'components/spec/SpecItemCreate.vue';
import MiTree from 'components/base/MiTree.vue';
import {
  SpecTreeItemMenus,
  SpecTreeMenusAction,
  SpecTreeEmptyMenus,
} from 'src/data/style';
import { SpecItem } from 'src/data/structs';
import { SpecPositionType } from 'src/data/constances';
import API from 'src/api/satic';
import { useSpecStore } from 'src/stores/spec';

// variables
const store = useSpecStore();
const emit = defineEmits(['close', 'success']);
const SpecItemCreateShow = ref(false); // 新建规范项窗口
const operationNode = ref<SpecItem>({} as SpecItem); // 当前操作的节点
const operationNodeParent = ref<SpecItem>({} as SpecItem); // 当前操作节点的父节点
const positionType = ref(SpecPositionType.Above); // 新建规范项的位置
let loadingTree = ref(false);

// functions
function doubleClick(node: string) {
  console.log(node);
}

function handleRefresh() {
  store.curSpec.init();
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
      await store.curSpec.deleteSpecItem(node.id);
      break;
    default:
      break;
  }
}

store.curSpec.init();
</script>
