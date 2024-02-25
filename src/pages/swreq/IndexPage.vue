<template>
    <q-splitter v-model="splitterModel" unit="px" :limits="[320, Infinity]"
        style="height: calc(100vh - 51px ); overflow: auto;">
        <template v-slot:before>
            <div class="row full-height">
                <div class="bg-grey-3" style="border-right: 1px solid #cfcfcf;">
                    <q-tabs vertical switch-indicator active-color="grey-7">
                        <q-route-tab icon="article" to="/main/swreq/article" exact>
                            <q-tooltip anchor="center right" self="center left" transition-show="scale"
                                transition-hide="scale">
                                Article
                            </q-tooltip>
                        </q-route-tab>

                        <q-route-tab icon="search" to="/main/swreq/search" exact>
                            <q-tooltip anchor="center right" self="center left" transition-show="scale"
                                transition-hide="scale">
                                Search
                            </q-tooltip>
                        </q-route-tab>

                        <q-route-tab icon="question_answer" to="/main/swreq/comment" exact>
                            <q-badge color="red" floating style="right: -5px">9+</q-badge>
                            <q-tooltip anchor="center right" self="center left" transition-show="scale"
                                transition-hide="scale">
                                Comments
                            </q-tooltip>
                        </q-route-tab>

                    </q-tabs>
                </div>

                <div class="col-grow">
                    <router-view />
                </div>
            </div>
        </template>

        <template v-slot:after>
            <content-box></content-box>
        </template>

    </q-splitter>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ContentBox from 'components/ide/ContentBox.vue';
let splitterModel = ref(320)
</script>