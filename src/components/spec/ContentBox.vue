<template>
  <div
    ref="scrollTargetRef"
    class="q-pa-md fit"
    style="max-height: calc(100vh - 51px); overflow: auto"
  >
    <!--<q-infinite-scroll @load="onLoad" :offset="250" :scroll-target="scrollTargetRef">-->

    <div
      v-for="(item, index) in items"
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
              <!-- <q-btn
                v-if="item.openEdit === false"
                round
                size="sm"
                flat
                icon="draw"
                @click="OpenEdit(item)"
              >
                <q-tooltip class="bg-grey-3 text-black">Edit</q-tooltip>
              </q-btn>
              <q-btn
                v-else
                round
                size="sm"
                flat
                icon="save"
                @click="CloseEdit(item)"
              >
                <q-tooltip class="bg-grey-3 text-black">Save</q-tooltip>
              </q-btn> -->

              <q-btn
                round
                size="sm"
                flat
                icon="smart_toy"
                @click="GetReqAnalysis(item)"
              >
                <q-tooltip class="bg-grey-3 text-black">AI评审</q-tooltip>
              </q-btn>

              <q-btn
                round
                size="sm"
                flat
                icon="bug_report"
                @click="GetTestAnalysis(item)"
              >
                <q-tooltip class="bg-grey-3 text-black">AI测试分析</q-tooltip>
              </q-btn>

              <!-- <q-btn
                round
                size="sm"
                flat
                icon="comment"
                @click="ShowCommentDialog(item.id, item.description)"
              >
                <q-tooltip class="bg-grey-3 text-black">Comment</q-tooltip>
              </q-btn> -->

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
          <!--TODO: 修改v-html，安全性-->
          <!-- <div v-if="item.openEdit === true">
            <q-editor v-model="item.description" min-height="5rem" />
          </div> -->
          <div v-html="item.description" />
        </q-card-section>

        <!-- <q-slide-transition>
          <div v-show="item.comment !== ''">
            <q-separator />
            <q-card-section class="text-subtitle2">
              {{ item.comment }}
            </q-card-section>
          </div>
        </q-slide-transition> -->
      </q-card>
    </div>

    <!--        <template v-slot:loading>-->
    <!--          <div class="row justify-center q-my-md">-->
    <!--            <q-spinner-dots color="primary" size="40px"/>-->
    <!--          </div>-->
    <!--        </template>-->
    <!--      </q-infinite-scroll>-->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDocumentStore } from 'stores/document';
const store = useDocumentStore();

const scrollTargetRef = ref();
const items = ref(store.DocEntrys);
let expanded = ref(false);
let ShowCommentDialogFlag = ref(false);
let CommentReqId = ref('');
let CommentReqDesc = ref('');

function ShowCommentDialog(reqId: string, reqDesc: string) {
  CommentReqId.value = reqId;
  CommentReqDesc.value = reqDesc;
  ShowCommentDialogFlag.value = true;
}

// function onLoad(index: any, done: any) {
//   setTimeout(() => {
//     items.value.push(
//       {summary: '', description: '', comment: '', openEdit: false},
//       {summary: '', description: '', comment: '', openEdit: false},
//       {summary: '', description: '', comment: '', openEdit: false},
//       {summary: '', description: '', comment: '', openEdit: false}
//     )
//     done()
//   }, 500)
// }

async function GetReqAnalysis(item: any) {
  const detailResp = await fetch('/api/stream-requirement', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      //'Authorization': 'Bearer ' + Password.value
    },
    body: JSON.stringify({
      model: 'gpt-4',
      requirement: item.description,
      temperature: 0.7,
    }),
  });

  const detailReader = detailResp.body!.getReader();
  const detailDecoder = new TextDecoder('utf-8');
  let oldConsoleLog = window.console.log;
  window.console.log = function () {
    return;
  };

  item.comment = '';
  while (true) {
    const { value, done } = await detailReader.read();
    expanded.value = true;
    if (value) {
      item.comment = item.comment + detailDecoder.decode(value);
    }

    if (done) {
      break;
    }
  }

  window.console.log = oldConsoleLog;
}

async function GetTestAnalysis(item: any) {
  const detailResp = await fetch('/api/stream-testpoint', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      //'Authorization': 'Bearer ' + Password.value
    },
    body: JSON.stringify({
      model: 'gpt-4',
      requirement: item.description,
      temperature: 0.7,
    }),
  });

  const detailReader = detailResp.body!.getReader();
  const detailDecoder = new TextDecoder('utf-8');
  let oldConsoleLog = window.console.log;
  window.console.log = function () {
    return;
  };

  item.comment = '';
  while (true) {
    const { value, done } = await detailReader.read();
    expanded.value = true;
    if (value) {
      item.comment = item.comment + detailDecoder.decode(value);
    }

    if (done) {
      break;
    }
  }

  window.console.log = oldConsoleLog;
}

function OpenEdit(item: any) {
  item.openEdit = true;
}

function CloseEdit(item: any) {
  item.openEdit = false;
}
</script>

<style>
.q-splitter__panel {
  z-index: auto;
}
</style>
