<template>
  <div class="q-gutter-sm">
    <q-tree
      class="mitree"
      no-transition
      :nodes="nodes"
      dense
      node-key="key"
      ref="treeRef"
      @dblclick="doubleClick"
      selected-color="primary"
      v-model:expanded="expanded"
      v-model:selected="Selected"
      @update:selected="SelectedHandle"
      :selection-type="'multiple'"
      @lazy-load="onLazyLoad"
    >
      <template v-slot:default-header="prop">
        <div class="column fit">
          <div
            style="margin-bottom: 2px; margin-top: 2px"
            class="row items-center fit mitree-item cursor-pointer"
            draggable="true"
            @drop="drop($event, prop.key)"
            @dragenter="dragEnter"
            @dragover="dragOver($event)"
            @dragleave="dragLeave"
            @dragstart="dragStart($event, prop.key)"
            @dragend="dragStop"
            @contextmenu.prevent="showContextMenu($event, prop.node)"
          >
            <q-icon :name="prop.node.icon" style="margin-right: 3px" />
            {{ prop.node.label }}
          </div>
        </div>
      </template>
    </q-tree>
  </div>
  <!-- 右键菜单 -->
  <q-menu context-menu>
    <q-list dense style="min-width: 200px">
      <q-item clickable v-ripple @click="onMenuItemClick('item1')">
        <q-item-section>Item 1</q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="onMenuItemClick('item2')">
        <q-item-section>Item 2</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

interface Props {
  nodes: Array<any>;
}
const props = withDefaults(defineProps<Props>(), {
  nodes: () => [],
});

const emit = defineEmits(['doubleClick', 'singleClick']);

const Selected = ref('');
const expanded = ref([]);
const treeRef = ref();
const contextMenuVisible = ref(false);
let nodes = props.nodes;
let moveType = -1;
let positionIndicator: HTMLElement | null = null;
let lastSelected = '';

function showContextMenu(event: MouseEvent, node: any) {
  // 获取对应的node的数据
  console.log('Right Click: ', node.label);
  contextMenuVisible.value = true;
}

// methods
function SelectedHandle(selectKey: string) {
  // select会面临选中和取消选中的问题
  if (selectKey === null) {
    Selected.value = lastSelected;
    // emit('singleClick', Selected.value)
    return;
  }
  lastSelected = selectKey;
  emit('singleClick', selectKey);
}

function doubleClick(val: MouseEvent) {
  emit('doubleClick', Selected.value);
}

// TODO: 做成emit
function onLazyLoad({
  node,
  key,
  done,
  fail,
}: {
  node: any;
  key: string;
  done: (children: any[]) => void;
  fail: () => void;
}) {
  console.log('LazyLoad: ' + key);
  setTimeout(() => {
    if (key === 'SWRS-2') {
      done([
        {
          key: 'SWRS-20',
          label: 'Sleep Mode',
          icon: 'folder',
          lazy: true,
        },
        {
          key: 'SWRS-21',
          label: 'Standby Mode',
          icon: 'folder',
          lazy: true,
        },
        {
          key: 'SWRS-22',
          label: 'Normal Mode',
          icon: 'folder',
          lazy: true,
        },
      ]);
    } else if (key === 'SWRS-20') {
      done([
        {
          key: 'SWRS-201',
          label: 'Stop Polygon',
          icon: 'tips_and_updates',
          lazy: false,
        },
        {
          key: 'SWRS-202',
          label: 'Stop Galvo',
          icon: 'tips_and_updates',
          lazy: false,
        },
      ]);
    } else {
      done([]);
    }
  }, 250);
}

// 获取指定node的parent(q-tree_node)
function getNodeParent(elem: HTMLElement): HTMLElement | null {
  let parent = null;
  while (elem.parentNode && !parent) {
    // 遍历查找上层node
    elem = elem.parentNode as HTMLElement;
    if (elem.classList.contains('q-tree__node')) {
      // 找到对应的q-tree_node
      parent = elem;
    }
  }
  return parent;
}

function getNodeByKey(
  node: any,
  key: string,
  currentIndex: number,
  parentNode: any
): any {
  // 使用栈来模拟递归调用，避免递归带来的性能问题
  let stack = [{ node, currentIndex, parentNode }];

  while (stack.length > 0) {
    let popped = stack.pop();
    if (!popped) continue;
    let { node, currentIndex, parentNode } = popped;

    if (!Array.isArray(node)) {
      if (node.key === key) {
        return { node: node, index: currentIndex, parent: parentNode };
      }

      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({
            node: node.children[i],
            currentIndex: i,
            parentNode: node,
          });
        }
      }
    } else {
      for (let i = node.length - 1; i >= 0; i--) {
        stack.push({ node: node[i], currentIndex: i, parentNode: parentNode });
      }
    }
  }

  return null;
}

function moveToChildren(fromResult: any, toResult: any) {
  if (!fromResult || !toResult) return;

  // 如果能在from节点或它的children中能找到to（代表把parent移到children中，禁止）
  if (getNodeByKey(fromResult.node, toResult.node.key, -1, null)) return;

  // 处理from
  if (fromResult.parent && fromResult.parent.children) {
    // 如果移动的node有parent且parent有children，意味着我们正在处理的不是根级别的节点，
    fromResult.parent.children.splice(fromResult.index, 1);
  } else {
    // 如果移动的node没有parent或有parent但没有children
    nodes.splice(fromResult.index, 1);
  }

  // 如果to存在children
  if (toResult.node.children) {
    // 插入到children列表的开头
    toResult.node.children.splice(0, 0, fromResult.node);
  } else {
    // 如果没有children，创建node的children列表
    toResult.node['children'] = [fromResult.node];
  }
  // move后自动展开tree
  treeRef.value.setExpanded(toResult.node.key, true);
}

function moveAbove(fromResult: any, toResult: any) {
  // 同一个node，直接返回
  if (fromResult.node.key === toResult.node.key) return;

  // 处理from
  if (fromResult.parent && fromResult.parent.children) {
    // 如果移动的node有parent且parent有children，意味着我们正在处理的不是根级别的节点，
    fromResult.parent.children.splice(fromResult.index, 1);
  } else {
    // 如果移动的node没有parent
    nodes.splice(fromResult.index, 1);
  }

  // 处理to
  if (toResult.parent && toResult.parent.children) {
    // 如果移动的node有parent且parent有children，意味着我们正在处理的不是根级别的节点，
    const toIndex = toResult.parent.children.indexOf(toResult.node);
    toResult.parent.children.splice(toIndex, 0, fromResult.node);
  } else {
    // 如果移动的node没有parent
    const toIndex = nodes.indexOf(toResult.node);
    nodes.splice(toIndex, 0, fromResult.node);
  }
}

function moveBelow(fromResult: any, toResult: any) {
  // 同一个node，直接返回
  if (fromResult.node.key === toResult.node.key) return;

  // 处理from
  if (fromResult.parent && fromResult.parent.children) {
    // 如果移动的node有parent且parent有children，意味着我们正在处理的不是根级别的节点，
    fromResult.parent.children.splice(fromResult.index, 1);
  } else {
    // 如果移动的node没有parent或有parent但没有children
    nodes.splice(fromResult.index, 1);
  }

  // 处理to
  if (toResult.parent && toResult.parent.children) {
    const toIndex = toResult.parent.children.indexOf(toResult.node);
    toResult.parent.children.splice(toIndex + 1, 0, fromResult.node);
  } else {
    const toIndex = nodes.indexOf(toResult.node);
    nodes.splice(toIndex + 1, 0, fromResult.node);
  }
}

function moveNode(from: string, to: string) {
  // from, to是key

  if (moveType === -1) return;

  // 如果源和目的相同，直接返回
  if (from === to) return;

  // 查找from对应的node
  const fromResult = getNodeByKey(nodes, from, -1, null);

  // 如果要move到root，把toResult置为null
  const toResult = getNodeByKey(nodes, to, -1, null);

  if (moveType === 1) {
    moveAbove(fromResult, toResult);
  } else if (moveType === 2) {
    moveBelow(fromResult, toResult);
  } else {
    moveToChildren(fromResult, toResult);
  }
}

// 开始拖动
function dragStart(event: any, key: string) {
  // target通常指向触发事件的元素。
  if (event.target) {
    const target = event.target;

    // 查找被拖动的node的parnet
    const parent = getNodeParent(target);

    if (parent) {
      // 如果找到了父元素，则向父元素的类列表中添加dragging类。这可以
      // 用来通过CSS更改正在被拖动的元素的视觉表示，例如改变背景颜色或添加其他视觉效果。
      parent.classList.add('dragging');
    }
  }
  if (event.dataTransfer && event.target) {
    // dataTransfer对象用于在拖动操作期间保存被拖动的数据，key可能是标识被拖动节点的一个唯一标识符。

    // setData它的第一个参数是一个字符串，表示数据的类型或格式，第二个参数是要存储的实际数据。这个类型可
    // 以是任何字符串，它为数据提供了一个标识符，允许在拖放操作的不同阶段（例如在放置（drop）操作中）正确地检索和解释该数据。
    event.dataTransfer.setData('node', key);
  }
}

// 结束拖动
function dragStop(event: any) {
  if (event.target) {
    const target = event.target;

    // 查找被拖动的node的parnet
    const parent = getNodeParent(target);
    if (parent) {
      // 去除拖动的视觉效果
      parent.classList.remove('dragging');
    }
  }
}

// 当拖拽元素进入目标元素时触发
// 可以在这个事件中改变目标元素的样式，以示拖拽元素可以放置在此
function dragEnter(event: any) {
  // preventDefault通常用于允许放置
  event.preventDefault();
}

// 当拖拽元素在目标元素上移动时触发
// 可以在这个事件中阻止默认行为，以允许放置操作
function dragOver(event: any) {
  event.preventDefault(); // 阻止默认行为
  const target = event.target;

  if (target) {
    if (!positionIndicator) {
      positionIndicator = document.createElement('div');
      positionIndicator.className = 'position-indicator';
      //target.parentNode.insertBefore(positionIndicator, target);
    }

    // 计算鼠标在目标元素内的Y坐标位置
    const rect = target.getBoundingClientRect();
    const mouseY = event.clientY - rect.top;

    // 根据鼠标位置更新指示器位置
    if (mouseY < rect.height / 3) {
      // 插入到元素上部
      moveType = 1;
      target.parentNode.insertBefore(positionIndicator, target);
      target.style.marginTop = 0;
      target.style.marginBottom = '2px';
      target.classList.remove('tree-item-dragging-container');
    } else if (mouseY > (rect.height * 2) / 3) {
      // 插入到元素底部
      moveType = 2;
      target.parentNode.insertBefore(positionIndicator, target.nextSibling);
      target.style.marginTop = '2px';
      target.style.marginBottom = 0;
      target.classList.remove('tree-item-dragging-container');
    } else {
      // 插入到children
      moveType = 0;
      positionIndicator.remove();
      positionIndicator = null;
      target.style.marginBottom = '2px';
      target.style.marginTop = '2px';
      target.classList.add('tree-item-dragging-container');
    }
  }
}

// 当拖拽元素离开目标元素时触发
// 可以在这个事件中恢复目标元素的样式
function dragLeave(event: any) {
  event.preventDefault();

  if (positionIndicator) {
    positionIndicator.remove();
    positionIndicator = null; // 重置为 null
  }

  // 离开的元素对象
  const target = event.target;
  if (target) {
    // 去除样式类
    target.style.marginBottom = '2px';
    target.style.marginTop = '2px';
    target.classList.remove('tree-item-dragging-container');
  }

  moveType = -1;
}

// 当拖拽元素被放下时触发
// 在这个事件处理函数中，可以执行拖拽元素的放置逻辑，如更新数据结构、移动元素位置等
function drop(event: any, key: string) {
  // 允许放置
  event.preventDefault();

  // 放开的对象
  const target = event.target;
  let nodeKey = '';

  if (event.dataTransfer) {
    // 读取设置的数据
    nodeKey = event.dataTransfer.getData('node');
  }
  console.log('move ' + nodeKey + ' to ' + key);

  if (target) {
    // 去除拖动的视觉效果
    target.classList.remove('tree-item-dragging-container');
  }

  if (nodeKey) {
    // key是目标node的key
    moveNode(nodeKey, key);
  }

  if (target && positionIndicator) {
    positionIndicator.remove();
    positionIndicator = null;
  }
  target.style.marginBottom = '2px';
  target.style.marginTop = '2px';
  target.classList.remove('tree-item-dragging-container');
  moveType = -1;
}
</script>

<style>
.mitree .q-tree__node-header-content {
  user-select: none;
}

[draggable='true'] {
  /*
   To prevent user selecting inside the drag source
  */
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

.mitree .q-tree__node--child > .q-tree__node-header :focus {
  box-shadow: none;
}

.mitree .q-tree__node .dragging {
  background: lightgray;
  border-radius: 4px;
}

.mitree .q-tree__node .dragging .q-hoverable:hover > .q-focus-helper {
  background: none;
  opacity: 0;
}

.position-indicator {
  width: 100%;
  height: 2px;
  background-color: blue;
}

.mitree-item {
  border-radius: 4px;
}

.tree-item-dragging-container {
  background: #00b4ff;
}

.q-tree__node {
  padding-top: 0;
}
</style>
