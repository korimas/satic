<template>
  <div class="fit column">
    <div class="row full-width q-pa-xs q-gutter-xs bg-grey-2">
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
      <q-btn
        unelevated
        round
        size="sm"
        icon="refresh"
        @click="getSpecRootItems"
      >
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
      class="col-grow"
      style="margin-top: 1px"
      :nodes="SpecNodes"
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
      @success-create="handleSuccessCreate"
      :ref-node="operationNode"
      :position-type="positionType"
    ></SpecItemCreate>
  </q-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useDocumentStore } from 'stores/document';
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

const store = useDocumentStore();
const emit = defineEmits(['close', 'success']);
const SpecItemCreateShow = ref(false);
// const nodes = ref<SpecItem[]>(store.DocEntrys as SpecItem[]);
const SpecNodes = ref<SpecItem[]>([]);
const operationNode = ref<SpecItem>({} as SpecItem);
const positionType = ref(SpecPositionType.Above);
let loadingTree = ref(false);
function doubleClick(node: string) {
  console.log(node);
}

async function lazyLoadChildren(
  node: any,
  key: string,
  done: (children: any[]) => void,
  fail: () => void
) {
  console.log('lazy load children: ', key);
  let resp = await API.getSpecChildItems(key);
  if (resp.success) {
    reformatNodes(resp.result);
    done(resp.result);
  } else {
    fail();
  }
}

async function menuClick(menu: string, node: SpecItem) {
  console.log('menu click: ', menu, node);
  operationNode.value = node;
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
      await API.deleteSpecItems([node.id]);
      break;
    default:
      break;
  }
}

function handleSuccessCreate(
  positionType: SpecPositionType,
  refNode: SpecItem,
  createdItem: SpecItem
) {
  console.log('handleSuccessCreate', positionType, refNode, createdItem);

  switch (positionType) {
    case SpecPositionType.Above:
      // 更新nodes
      const index = SpecNodes.value.findIndex((node) => node.id === refNode.id);
      SpecNodes.value.splice(index, 0, createdItem);

      break;
    case SpecPositionType.Below:
      break;
    case SpecPositionType.Child:
      // refNode.lazy = false;
      refNode.has_children = true;
      refNode.children = refNode.children || [];
      refNode.children.push(createdItem);
      refNode.expandable = true;
      // createdItem.selectable = true;
      break;
    default:
      break;
  }
  emit('success');
}

function reformatNodes(nodes: SpecItem[]) {
  nodes.forEach((node) => {
    node.lazy = node.has_children;
    node.key = node.id.toString();
  });
}

async function getSpecRootItems() {
  try {
    loadingTree.value = true;
    const resp = await API.getSpecRootItems();
    console.log('getSpecRootItems', resp);
    if (resp.success) {
      loadingTree.value = false;
      SpecNodes.value = resp.result;

      reformatNodes(SpecNodes.value);
    }
  } catch (error) {
    console.error('Failed to fetch spec root items', error);
  }
}

onMounted(() => {
  getSpecRootItems();
});
</script>
