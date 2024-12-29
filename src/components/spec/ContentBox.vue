<template>
  <div ref="scrollTargetRef" class="q-pa-md fit">
    <q-infinite-scroll @load="onLoad" :reverse="isReverse" :offset="250">
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
import { ref } from 'vue';
import { useSpecStore } from 'src/stores/spec';
const specStore = useSpecStore();

const scrollTargetRef = ref();
// const items = ref([]);
let expanded = ref(false);
let ShowCommentDialogFlag = ref(false);
let CommentReqId = ref('');
let CommentReqDesc = ref('');
let isReverse = ref(false);

function ShowCommentDialog(reqId: string, reqDesc: string) {
  CommentReqId.value = reqId;
  CommentReqDesc.value = reqDesc;
  ShowCommentDialogFlag.value = true;
}

function onLoad(index: any, done: any) {
  done();
}

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
