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
              <q-btn
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
              </q-btn>

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

              <q-btn
                round
                size="sm"
                flat
                icon="comment"
                @click="ShowCommentDialog(item.id, item.description)"
              >
                <q-tooltip class="bg-grey-3 text-black">Comment</q-tooltip>
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
          <!--TODO: 修改v-html，安全性-->
          <div v-if="item.openEdit === true">
            <q-editor v-model="item.description" min-height="5rem" />
          </div>
          <div v-else v-html="item.description" />
        </q-card-section>

        <q-slide-transition>
          <div v-show="item.comment !== ''">
            <q-separator />
            <q-card-section class="text-subtitle2">
              {{ item.comment }}
            </q-card-section>
          </div>
        </q-slide-transition>
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

const scrollTargetRef = ref();
const items = ref([
  {
    id: '1',
    summary: 'PHY mode configuration',
    description:
      "The software must possess the capability to designate the radar's PHY mode as either Master or Slave, allowing for customization during the factory setting based on the client's requirements.",
    comment: '',
    openEdit: false,
  },
  {
    id: '2',
    summary: 'memory cache',
    description:
      'When encountering frequently accessed data, the software uses memory caching techniques to store the data in memory, which speeds up the data access speed.',
    comment: '',
    openEdit: false,
  },
  {
    id: '3',
    summary: 'memory pool',
    description:
      'In processes that require frequent memory allocation and deallocation, software shall optimize memory usage and reduce memory fragmentation by using memory pool technology, thereby improving memory allocation efficiency..',
    comment: '',
    openEdit: false,
  },
  {
    id: '4',
    summary: 'Survival priority',
    description:
      'During the runtime of the software, it shall ensure that the state machine for mode switching is always in an active stat unless the software crashes',
    comment: '',
    openEdit: false,
  },
  {
    id: '5',
    summary: 'Disable noise filtering in calibration mode',
    description:
      'In calibration mode, the software shall not perform the operation of noise filtering.',
    comment: '',
    openEdit: false,
  },
  {
    id: '6',
    summary: 'collect info for INNO_LIDAR_IN_FAULT_EXCESSIVE_BLOOMING',
    description:
      'when fault INNO_LIDAR_IN_FAULT_EXCESSIVE_BLOOMING occured, the software shall collect the information on the angle of the high reflection area, reference light intensity, and duration.',
    comment: '',
    openEdit: false,
  },
  {
    id: '7',
    summary: 'Configure noise filtering operations',
    description:
      'The software shall support the ability to specify through configuration whether to perform the operation of noise filtering.',
    comment: '',
    openEdit: false,
  },
  {
    id: '8',
    summary: '8-neighbor filtering mode',
    description:
      'When the filtering mode is set to 8-neighbor, it shall select the points in the following directions of this point to determint whether they are neighbor points: top left, top, top right, left, right, bottom left, bottom, and bottom right.',
    comment: '',
    openEdit: false,
  },
  {
    id: '9',
    summary: '2-neighbor filtering mode',
    description:
      'When the filtering mode is set to 2-neighbor, it shall determine whether the left and right points of the point are adjacent points.\n',
    comment: '',
    openEdit: false,
  },
  {
    id: '10',
    summary: 'judgment of neighbor points',
    description:
      'The judgment of neighbor points needs to simultaneously satisfy the following conditions:\n' +
      '1. The interpolation distance between the current point and the adjacent point is less than the threshold.\n' +
      '2. The difference in trigger period between the current point and the adjacent point is greater than 24ns.\n' +
      '3. The distance measurement of adjacent points is non-zero.',
    comment: '',
    openEdit: false,
  },
  {
    id: '11',
    summary: 'trigger period difference configurable',
    description:
      'The software shall support specifying the trigger period difference between valid neighbor points and the current return point through a configuration file.\n',
    comment: '',
    openEdit: false,
  },
  {
    id: '12',
    summary: 'Forced 2-neighbor filtering mode',
    description:
      'The software must enforce the use of dual adjacency filtering when the following conditions are simultaneously met: the total number of noise points filtered out in a frame is greater than the return light count multiplied by a threshold value 10000, and the software is not currently in the forced dual adjacency filtering mode.',
    comment: '',
    openEdit: false,
  },
  {
    id: '13',
    summary: 'Not noise',
    description:
      'During the noise reduction process, if the following conditions are simultaneously met, the point is considered not to be noise:\n' +
      '1) The distance measurement of the return point is not zero.\n' +
      '2) The number of valid neighbor points reaches the threshold value or there is at least one high-quality adjacent point.',
    comment: '',
    openEdit: false,
  },
  {
    id: '14',
    summary: 'Configure the parameters for noise detection.',
    description:
      'The software shall support specifying the threshold values for the number of neighbor points in noise judgment through a configuration file.',
    comment: '',
    openEdit: false,
  },
  {
    id: '15',
    summary: 'High-quality neighbor point identification.',
    description:
      'The software shall identify high-quality neighbor points based on the following rule: within the range of distance difference for that adjacent point, there should exist a confirmed real return point.',
    comment: '',
    openEdit: false,
  },
  {
    id: '16',
    summary: 'Configure the parameters for High-quality neighbor point',
    description:
      'The software shall support specifying the distance difference parameter for high-quality neighbor point determination through configuration.',
    comment: '',
    openEdit: false,
  },
  {
    id: '17',
    summary:
      'Print the statistical information of noise points for each frame.',
    description:
      'If the number of noise points in a frame exceeds the return light count multiplied by 20,000, the software shall print the statistical information of noise points for that frame.',
    comment: '',
    openEdit: false,
  },
  {
    id: '18',
    summary: 'Calculate and print the processing time for noise filtering.',
    description:
      'The software shall calculate the processing time for noise filtering for each scan line, and print it every 50 seconds.',
    comment: '',
    openEdit: false,
  },
]);
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
