<template>
  <div
    ref="scrollTargetRef"
    class="q-pa-md fit"
    style="max-height: calc(100vh - 51px); overflow: auto"
  >
    <q-infinite-scroll
      @load="onLoad"
      :reverse="isReverse"
      :offset="250"
      :scroll-target="scrollTargetRef"
      :disable="isDisabled"
      @scroll="handleScroll"
    >
      <div
        v-for="(item, index) in specStore.curSpec.contentNodes"
        :key="index"
        class="caption doc-content"
      >
        <q-card
          flat
          class="q-hoverable"
          style="white-space: pre-wrap; min-height: 120px"
        >
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

          <q-card-section>
            <div v-html="item.description" />
          </q-card-section>
        </q-card>
      </div>

      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSpecStore } from 'src/stores/spec';
import { sleep } from 'src/utils/time';

const specStore = useSpecStore();
const scrollTargetRef = ref();
const isReverse = ref(false);
const isDisabled = ref(true); // 初始设为 true
let lastScrollTop = 0;

// 处理滚动事件
const handleScroll = (event: Event) => {
  console.log('handleScroll');
  if (!scrollTargetRef.value) return;

  const currentScrollTop = scrollTargetRef.value.scrollTop;
  isReverse.value = currentScrollTop < lastScrollTop;
  lastScrollTop = currentScrollTop;
  console.log('isReverse:', isReverse.value);
};

async function onLoad(index: any, done: any) {
  try {
    const success = await specStore.curSpec.loadNextPageContentSpecs();
    if (!success) {
      console.log('load next wait 1000s');
      await sleep(1000); // 加载失败时延迟 1 秒
      done(true);
      return;
    }
    done();
  } catch (error) {
    console.log('load next wait 1000s');
    await sleep(1000); // 加载失败时延迟 1 秒
    done(); // 出错时停止加载
  }
}

onMounted(() => {
  // 确保组件挂载后启用无限滚动
  setTimeout(() => {
    isDisabled.value = false;
  }, 100);
});
</script>

<style>
.q-splitter__panel {
  z-index: auto;
}
</style>
