<template>
    <div class="row full-height">
        <div class="bg-grey-3" style="border-right: 1px solid #cfcfcf;">
            <q-tabs v-model="innerTab" vertical switch-indicator active-color="grey-7">
                <q-tab name="innerArticle" icon="article">
                    <q-tooltip anchor="center right" self="center left" transition-show="scale" transition-hide="scale">
                        Article
                    </q-tooltip>
                </q-tab>
                <q-tab name="innerSearch" icon="search">
                    <q-tooltip anchor="center right" self="center left" transition-show="scale" transition-hide="scale">
                        Search
                    </q-tooltip>
                </q-tab>
                <q-tab name="innerComment" icon="question_answer">
                    <q-badge color="red" floating style="right: -5px">9+</q-badge>
                    <q-tooltip anchor="center right" self="center left" transition-show="scale" transition-hide="scale">
                        Comments
                    </q-tooltip>
                </q-tab>
            </q-tabs>
        </div>

        <div class="col-grow">
            <q-tab-panels v-model="innerTab" swipeable vertical>
                <q-tab-panel name="innerComment" style="padding: 0;">
                    Comments
                </q-tab-panel>

                <q-tab-panel name="innerArticle">
                    <div class="row full-width q-pa-xs q-gutter-xs bg-grey-4">
                        <q-btn unelevated round size="sm" icon="add" @click="addClick">
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
                        <q-btn unelevated round size="sm" icon="more_vert">
                            <q-menu auto-close>
                                <q-list dense style="margin: 3px;">
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
                </q-tab-panel>

                <q-tab-panel name="innerSearch">
                    <q-input outlined v-model="SesarchText" dense style="padding: 5px">
                        <template v-slot:append>
                            <q-btn dense flat icon="search" />
                        </template>
                    </q-input>
                </q-tab-panel>
            </q-tab-panels>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
let tab = ref('mails')
let innerTab = ref('innerArticle')
let SesarchText = ref('')
</script>

<style> .q-tab-panel {
     padding: 0;
 }
</style>