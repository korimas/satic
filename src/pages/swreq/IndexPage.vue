<template>
    <q-splitter v-model="splitterModel" unit="px" :limits="[320, Infinity]"
        style="height: calc(100vh - 51px ); overflow: auto;">
        <template v-slot:before>
            <div class="row full-height">
                <div class="bg-grey-3" style="border-right: 1px solid #cfcfcf;">
                    <q-tabs v-model="CurrentTab" vertical switch-indicator active-color="grey-7">
                        <q-tab name="Explorer" icon="article" @click="EnterExplorer">
                            <q-tooltip anchor="center right" self="center left" transition-show="scale"
                                transition-hide="scale">
                                Explorer
                            </q-tooltip>
                        </q-tab>

                        <q-tab name="Search" icon="search" @click="EnterSearch">
                            <q-tooltip anchor="center right" self="center left" transition-show="scale"
                                transition-hide="scale">
                                Search
                            </q-tooltip>
                        </q-tab>

                        <q-tab name="Plugins" icon="widgets" @click="EnterPlugins">
                            <q-badge color="red" floating style="right: -5px">9+</q-badge>
                            <q-tooltip anchor="center right" self="center left" transition-show="scale"
                                transition-hide="scale">
                                Plugins
                            </q-tooltip>
                        </q-tab>

                    </q-tabs>

                </div>

                <div class="col-grow">
                    <q-tab-panels v-model="CurrentTab" vertical keep-alive class="fit">

                        <q-tab-panel name="Explorer" class="no-padding">
                            <ExplorerTab></ExplorerTab>
                        </q-tab-panel>

                        <q-tab-panel name="Search" class="no-padding">
                            <SearchTab v-if="InitSearchTab"></SearchTab>
                        </q-tab-panel>

                        <q-tab-panel name="Plugins" class="no-padding">
                            <PluginsTab v-if="InitPluginsTab"></PluginsTab>
                            <q-inner-loading :showing="true">
                                <q-spinner-gears size="50px" color="primary" />
                            </q-inner-loading>
                        </q-tab-panel>

                    </q-tab-panels>
                </div>
            </div>
        </template>

        <template v-slot:after>
            content
        </template>

    </q-splitter>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';
import ExplorerTab from 'components/ide/swreq/ExplorerTab.vue';

const SearchTab = defineAsyncComponent(() => import('components/ide/swreq/SearchTab.vue'));
const PluginsTab = defineAsyncComponent(() => import('components/ide/swreq/PluginsTab.vue'));

let splitterModel = ref(320)
let CurrentTab = ref('Explorer')
let InitSearchTab = ref(false)
let InitPluginsTab = ref(false)

function EnterExplorer() {
    console.log('EnterExplorer')
}

function EnterSearch() {
    InitSearchTab.value = true
    console.log('EnterSearch')
}

function EnterPlugins() {
    InitPluginsTab.value = true
    console.log('EnterPlugins')
}
</script>