<template>
  <div ref="scrollTargetRef" class="q-pa-sm fit" style="max-height: calc(100vh - 51px); overflow: auto">
    <!-- Top sentinel for reverse scrolling -->
    <div ref="topSentinel" class="sentinel"></div>
    <div v-if="isReverseLoading" class="row justify-center q-my-md">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <q-card v-for="(item, index) in specStore.curSpec.contentNodes" :key="index" flat
      class="q-hoverable caption doc-content" style="white-space: pre-wrap; min-height: 80px">
      <span class="q-focus-helper"></span>

      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6">{{ item.summary }}</div>
          </div>

          <div class="col-auto">
            <q-btn round size="sm" flat icon="smart_toy">
              <q-tooltip class="bg-grey-3 text-black">AI评审</q-tooltip>
            </q-btn>

            <q-btn round size="sm" flat icon="bug_report">
              <q-tooltip class="bg-grey-3 text-black">AI测试分析</q-tooltip>
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
          </div>
        </div>
      </q-card-section>

      <q-card-section v-if="item.description" class="text-body2">
        <div v-html="item.description" />
      </q-card-section>
    </q-card>

    <!-- Bottom sentinel for forward scrolling -->
    <div ref="bottomSentinel" class="sentinel"></div>

    <div v-if="isLoading" class="row justify-center q-my-md">
      <q-spinner-dots color="primary" size="40px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useSpecStore } from 'src/stores/spec';
import { sleep } from 'src/utils/time';

const specStore = useSpecStore();
const scrollTargetRef = ref();
const topSentinel = ref();
const bottomSentinel = ref();
const isLoading = ref(false);
const isReverseLoading = ref(false);
let hightTimer: ReturnType<typeof setTimeout> | null = null;
let preTargetElement: any = null;

let topObserver: IntersectionObserver | null = null;
let bottomObserver: IntersectionObserver | null = null;

async function loadContent(isReverse: boolean) {
  let loadingFlag = isReverse ? isReverseLoading : isLoading
  if (loadingFlag.value) return;

  const topNode = specStore.curSpec.contentNodes[0];

  loadingFlag.value = true;
  try {
    const success = isReverse
      ? await specStore.curSpec.loadPrevPageContentSpecs()
      : await specStore.curSpec.loadNextPageContentSpecs();

    if (!success) {
      console.log('load failed, waiting 1000ms');
      await sleep(1000);
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
    jumpToNode(topNode.id);
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

function jumpToNode(nodeId: number) {
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
  () => specStore.curSpec.selectedNodeId,
  async (newNodeId) => {
    if (!newNodeId || newNodeId < 0) return;
    await specStore.curSpec.loadContentSpecsNear(newNodeId);
    console.log('scroll to node:', newNodeId);
    jumpToNode(newNodeId);
  },
  {
    immediate: true, // 立即执行一次
  }
);
</script>

<style>
.q-splitter__panel {
  z-index: auto;
}

.sentinel {
  height: 1px;
  width: 100%;
}
</style>
