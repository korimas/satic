<template>
  <q-splitter v-model="splitterModel" unit="px" :limits="splitterLimits">
    <template v-slot:before>
      <div class="row no-wrap">
        <div class="sidebar-menu column">
          <q-tabs v-model="CurrentTab" shrink stretch vertical switch-indicator active-color="grey-7"
            active-bg-color="grey-4">
            <q-tab name="Explorer" icon="article" @click="EnterExplorer"><q-tooltip anchor="center right"
                self="center left" transition-show="scale" transition-hide="scale">
                Explorer
              </q-tooltip></q-tab>
            <q-tab name="Search" icon="search" @click="EnterSearch"><q-tooltip anchor="center right" self="center left"
                transition-show="scale" transition-hide="scale">
                Search
              </q-tooltip></q-tab>
            <q-tab name="Plugins" icon="widgets" @click="EnterPlugins">
              <q-tooltip anchor="center right" self="center left" transition-show="scale" transition-hide="scale">
                Plugins
              </q-tooltip>
              <q-badge color="red" floating style="right: -5px">9+</q-badge>
            </q-tab>
            <q-tab name="Chat" icon="question_answer" @click="EnterChat">
              <q-tooltip anchor="center right" self="center left" transition-show="scale" transition-hide="scale">
                AI Chat
              </q-tooltip>
            </q-tab>
          </q-tabs>
          <q-space />
          <q-btn flat icon="o_vertical_split" @click="store.State.sideMenuShow = !store.State.sideMenuShow"
            class="q-mb-md">
            <q-tooltip anchor="center right" self="center left" transition-show="scale" transition-hide="scale">
              Hide/Show
            </q-tooltip>
          </q-btn>
        </div>
        <div class="sidebar-content" style="overflow-x: hidden" v-show="isSiderBarContentShow">
          <q-tab-panels v-model="CurrentTab" vertical keep-alive class="fit">
            <q-tab-panel name="Explorer" class="no-padding">
              <ExplorerTab />
            </q-tab-panel>
            <q-tab-panel name="Search" class="no-padding column">
              <SearchTab />
            </q-tab-panel>
            <q-tab-panel name="Plugins" class="no-padding">
              <PluginsTab />
            </q-tab-panel>
            <q-tab-panel name="Chat" class="no-padding">
              <ChatTab />
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </template>
    <template v-slot:after>
      <ContentBox />
    </template>
  </q-splitter>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';
import ExplorerTab from 'components/spec/tabs/ExplorerTab.vue';
import MiLoading from 'components/base/MiLoading.vue';
import { useStateStore } from 'src/stores/state';

const SearchTab = defineAsyncComponent({
  loader: () => import('components/spec/tabs/SearchTab.vue'),
  loadingComponent: MiLoading,
  delay: 0,
  timeout: 15000,
});

const PluginsTab = defineAsyncComponent({
  loader: () => import('components/spec/tabs/PluginsTab.vue'),
  loadingComponent: MiLoading,
  delay: 0,
  timeout: 15000,
});

const ChatTab = defineAsyncComponent({
  loader: () => import('components/spec/tabs/ChatTab.vue'),
  loadingComponent: MiLoading,
  delay: 0,
  timeout: 15000,
});

const ContentBox = defineAsyncComponent({
  loader: () => import('components/spec/ContentBox.vue'),
  loadingComponent: MiLoading,
  delay: 0,
  timeout: 15000,
});

let splitterMin = 310;
let splitterModel = ref(splitterMin);
let splitterLimits = ref([splitterMin, Infinity]);

let isSiderBarContentShow = ref(true);

let CurrentTab = ref('Explorer');
let preTab = 'Explorer';
const store = useStateStore();

function EnterExplorer() {
  // console.log('Enter', CurrentTab.value);
  hiddenShowSideContent('Explorer');
  preTab = 'Explorer';
}

function EnterSearch() {
  // console.log('Enter', CurrentTab.value);
  hiddenShowSideContent('Search');
  preTab = 'Search';

}

function EnterPlugins() {
  // console.log('Enter', CurrentTab.value);
  hiddenShowSideContent('Plugins');
  preTab = 'Plugins';

}

function EnterChat() {
  // console.log('Enter', CurrentTab.value);
  hiddenShowSideContent('Chat');
  preTab = 'Chat';
}


function hiddenShowSideContent(tabName: string) {
  if (CurrentTab.value === preTab && isSiderBarContentShow.value) {
    isSiderBarContentShow.value = false;
    splitterMin = 57;
    splitterModel.value = splitterMin;
    splitterLimits.value = [splitterMin, Infinity];
  } else {
    console.log("show side content")
    splitterMin = 310;
    isSiderBarContentShow.value = true;
    splitterModel.value = splitterMin;
    splitterLimits.value = [splitterMin, Infinity];
  }
}

</script>

<style scoped>
.sidebar-menu {
  background: #f0f0f0;
  border-right: 1px solid #e6e6e6;
  height: calc(100vh - 51px);
}

.sidebar-content {
  height: calc(100vh - 51px);
  width: 100%;
}
</style>
