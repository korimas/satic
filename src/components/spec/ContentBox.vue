<template>

  <q-splitter reverse v-model="splitterModel" unit="px" :limits="splitterLimits"
    :class="{ 'doc-hide-splitter': !specStore.contentDetailVisible, 'content-box-splitter': true }">
    <template v-slot:before>
      <div ref="scrollTargetRef" class="q-pa-sm fit" style="max-height: calc(100vh - 51px); overflow: auto">
        <div ref="topSentinel" class="sentinel"></div>
        <div v-if="isReverseLoading" class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>

        <div v-for="(item, index) in specStore.curSpec.contentNodes" :key="index" flat
          class="column doc-content hover-highlight q-px-md q-pb-md full-width"
          style="white-space: pre-wrap; min-height: 60px" @click="specStore.curSpec.jumpToTreeNodeItem = item">

          <div class="row items-center no-wrap q-my-md">
            <div class="col">
              <div style="font-size: 1.5em;" v-if="!item.isInEdit">
                {{ item.summary }}
                <q-badge color="primary">v1.0</q-badge>
              </div>

              <q-input class="bg-white" v-else v-model="item.edit_summary" dense outlined />
            </div>

            <div class="col-auto q-ml-sm">
              <span v-if="!item.isInEdit">
                <q-btn round size="sm" flat icon="edit" @click="openEdit(item)">
                  <q-tooltip class="bg-grey-3 text-black">编辑</q-tooltip>
                </q-btn>

                <q-btn round size="sm" flat icon="visibility" @click="SpecDetailShow = true">
                  <q-tooltip class="bg-grey-3 text-black">详情</q-tooltip>
                </q-btn>

                <q-btn color="grey-7" round flat size="sm" icon="more_vert">
                  <q-menu auto-close>
                    <q-list dense>
                      <q-item clickable>
                        <q-item-section>Remove</q-item-section>
                      </q-item>
                      <q-item clickable>
                        <q-item-section>Edit</q-item-section>
                      </q-item>
                      <q-item clickable>
                        <q-item-section>Share</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </span>
              <span v-else>
                <q-btn round size="sm" flat icon="done" @click="updateSpecItem(item)" :loading="isUpdating">
                  <q-tooltip class="bg-grey-3 text-black">保存</q-tooltip>
                </q-btn>
                <q-btn round size="sm" flat icon="close" @click="closeEdit(item)">
                  <q-tooltip class="bg-grey-3 text-black">取消</q-tooltip>
                </q-btn>
              </span>
            </div>
          </div>

          <div v-if="item.description || item.isInEdit" class="full-width">
            <div v-html="item.description" class="ProseMirror" v-if="!item.isInEdit"
              style="max-width: 100%;overflow-x: auto;scrollbar-width: thin; -webkit-overflow-scrolling: touch;" />
            <MiEditor v-model="item.edit_content" v-else />
          </div>

        </div>

        <div ref="bottomSentinel" class="sentinel"></div>

        <div v-if="isLoading" class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </div>

      <q-drawer side="left" overlay v-model="SpecDetailShow" bordered
        :width="$q.screen.width > 1000 ? $q.screen.width - 200 : $q.screen.width" :breakpoint="1000"
        style="z-index: 1000">

        <MiWindow title="Spec Detail" @close="SpecDetailShow = false">
          <SpecDetialSide />
        </MiWindow>

      </q-drawer>
    </template>

    <template v-slot:after>
      <SpecDetialSide v-if="specStore.contentDetailVisible" />
    </template>
  </q-splitter>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, defineAsyncComponent } from 'vue';
import { useSpecStore } from 'src/stores/spec';
import { sleep } from 'src/utils/time';
import MiLoading from 'components/base/MiLoading.vue';
import { SpecItem } from 'src/data/structs';
import API from 'src/api/satic';

// lazy import
const MiEditor = defineAsyncComponent({
  loader: () => import('components/base/MiEditor.vue'),
  loadingComponent: MiLoading,
  delay: 0,
  timeout: 15000,
});

const SpecDetialSide = defineAsyncComponent({
  loader: () => import('components/spec/SpecDetialSide.vue'),
  loadingComponent: MiLoading,
  delay: 0,
  timeout: 15000,
});

const MiWindow = defineAsyncComponent({
  loader: () => import('components/base/MiWindow.vue'),
  loadingComponent: MiLoading,
  delay: 0,
  timeout: 15000,
});


const specStore = useSpecStore();
const scrollTargetRef = ref();
const topSentinel = ref();
const bottomSentinel = ref();
const isLoading = ref(false);
const isReverseLoading = ref(false);
const splitterMin = 330;
const splitterModel = ref(splitterMin);
const splitterLimits = ref([splitterMin, Infinity]);
const isUpdating = ref(false);
const SpecDetailShow = ref(false);

let hightTimer: ReturnType<typeof setTimeout> | null = null;
let preTargetElement: any = null;

let topObserver: IntersectionObserver | null = null;
let bottomObserver: IntersectionObserver | null = null;

function openEdit(item: SpecItem) {
  item.edit_content = item.description;
  item.edit_summary = item.summary;
  item.isInEdit = true;
}

function closeEdit(item: SpecItem) {
  item.isInEdit = false;
  item.edit_content = '';
}

async function updateSpecItem(item: SpecItem) {
  isUpdating.value = true;
  console.log('update spec item:', item);
  if (item.edit_content === item.description && item.summary === item.edit_summary) {
    // 没有修改内容
    item.isInEdit = false;
    isUpdating.value = false;
    return;
  }
  const resp = await API.updateSpecItem(item.id, {
    summary: item.edit_summary,
    description: item.edit_content,
  });
  if (resp.success) {
    item.isInEdit = false;
    item.description = item.edit_content || '';
    item.summary = item.edit_summary || '';
  }
  isUpdating.value = false;
}

async function loadContent(isReverse: boolean) {
  let loadingFlag = isReverse ? isReverseLoading : isLoading
  if (isReverseLoading.value || isLoading.value) return;

  const topNode = specStore.curSpec.contentNodes[0];

  loadingFlag.value = true;
  try {
    const success = isReverse
      ? await specStore.curSpec.loadPrevPageContentSpecs()
      : await specStore.curSpec.loadNextPageContentSpecs();

    if (!success) {
      // console.log('load failed, waiting 1000ms');
      // await sleep(1000);
      return;
    }
  } catch (error) {
    console.log('Error loading content:');
    await sleep(1000);
  } finally {
    loadingFlag.value = false;
  }

  if (isReverse && topNode) {
    // 如果是向上滚动，加载完数据后，跳转到原来的位置
    jumpToContentNode(topNode.id);
  }
}

onMounted(() => {
  // Options for the Intersection Observer
  const options = {
    root: scrollTargetRef.value,
    rootMargin: '250px',
    threshold: 0,
  };

  // Create observer for top sentinel (reverse scrolling)
  topObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      console.log('top', entry.isIntersecting);
      if (entry.isIntersecting) {
        loadContent(true);
      }
    });
  }, options);

  // Create observer for bottom sentinel (forward scrolling)
  bottomObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      console.log('bottom', entry.isIntersecting);
      if (entry.isIntersecting) {
        loadContent(false);
      }
    });
  }, options);

  // Start observing the sentinels
  if (topSentinel.value) {
    topObserver.observe(topSentinel.value);
  }
  if (bottomSentinel.value) {
    bottomObserver.observe(bottomSentinel.value);
  }
});

onUnmounted(() => {
  // Cleanup observers
  if (topObserver) {
    topObserver.disconnect();
  }
  if (bottomObserver) {
    bottomObserver.disconnect();
  }
});

function jumpToContentNode(nodeId: number) {
  if (!nodeId || !scrollTargetRef.value) return;

  // 找到对应节点的索引
  const index = specStore.curSpec.contentNodes.findIndex(
    (node) => node.id === nodeId
  );

  if (index === -1) return;

  // 获取目标元素
  const targetElement = scrollTargetRef.value.children[index + 1]; // +1 是因为第一个子元素是 topSentinel

  if (!targetElement) return;

  // 使用 scrollIntoView 平滑滚动到目标位置
  targetElement.scrollIntoView({
    behavior: 'auto', // smooth or auto
    block: 'start', // start, center, end
  });

  //让对应的节点高亮显示
  targetElement.classList.add('bg-light-blue-1');
  if (hightTimer) {
    clearTimeout(hightTimer);
    preTargetElement.classList.remove('bg-light-blue-1');
  }
  preTargetElement = targetElement;

  // 1.5s 后取消高亮显示
  hightTimer = setTimeout(() => {
    targetElement.classList.remove('bg-light-blue-1');
  }, 300);
}

watch(
  () => specStore.curSpec.jumpToContentNodeId,
  async (newNodeId) => {
    if (!newNodeId || newNodeId < 0) return;
    await specStore.curSpec.loadContentSpecsNear(newNodeId);
    console.log('scroll to node:', newNodeId);
    jumpToContentNode(newNodeId);
  },
  {
    immediate: true, // 立即执行一次
  }
);
</script>

<style>
@import 'src/css/editor.css';

.q-splitter__panel {
  z-index: auto;
}

.doc-hide-splitter>.q-splitter__after {
  display: none !important;
}

.doc-hide-splitter>.q-splitter__separator {
  display: none !important;
}

.sentinel {
  height: 1px;
  width: 100%;
}

.hover-highlight {
  border-left: 4px solid #fff;
}

.hover-highlight:hover {
  border-left: 4px solid #5e98d1;
}
</style>
