<template>
  <q-page class="row items-center">
    <div ref="scrollTargetRef" class="q-pa-md fit" style="max-height: calc(100vh - 50px ); overflow: auto;">
      <q-infinite-scroll @load="onLoad" :offset="250" :scroll-target="scrollTargetRef">

        <div v-for="(item, index) in items" :key="index" class="caption doc-content">
          <q-card flat class="q-hoverable" >
            <span class="q-focus-helper"></span>

            <q-card-section>
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-h6">Our Planet</div>
                </div>

                <div class="col-auto">
                  <q-btn round size="sm" flat icon="smart_toy" @click="GetAnalysis"/>

                  <q-btn color="grey-7" round flat size="sm" icon="more_vert">
                    <q-menu cover auto-close>
                      <q-list>
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
              <div v-html="content"/>
            </q-card-section>

            <q-slide-transition>
              <div v-show="expanded">
                <q-separator />
                <q-card-section class="text-subtitle2">
                  {{ result }}
                </q-card-section>
              </div>
            </q-slide-transition>
          </q-card>


        </div>

        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px"/>
          </div>
        </template>

      </q-infinite-scroll>

    </div>
  </q-page>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';

export default defineComponent({
  name: 'DocPage',
  setup() {
    const scrollTargetRef = ref()
    const items = ref([{}, {}, {}, {}, {}, {}, {}, {}, {}])
    let splitterModel = ref(50)
    let content = ref('In calibration mode, the software shall not perform the operation of noise filtering.')
    let expanded = ref(false)
    let result = ref('')


    async function GetAnalysis() {
      const detailResp = await fetch('/api/stream-requirement', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          //'Authorization': 'Bearer ' + Password.value
        },
        body: JSON.stringify({
          // 'model': store.model,
          'requirement': content.value,
          'temperature': 0.7,
        })
      })

      const detailReader = detailResp.body!.getReader()
      const detailDecoder = new TextDecoder('utf-8')
      let oldConsoleLog = window.console.log;
      window.console.log = function () {
        return
      };

      while (true) {
        const {value, done} = await detailReader.read()
        expanded.value = true
        if (value) {
          result.value = result.value + detailDecoder.decode(value)
        }

        if (done) {
          break
        }
      }

      window.console.log = oldConsoleLog

    }

    return {
      scrollTargetRef,
      content,
      result,
      splitterModel,
      items,
      expanded,
      GetAnalysis,
      onLoad(index: any, done: any) {
        setTimeout(() => {
          items.value.push({}, {}, {}, {}, {}, {}, {}, {}, {})
          done()
        }, 500)
      }
    };
  }
});
</script>

<style>

.doc-content .q-card__section--vert {
  padding: 3px 16px;
}

</style>
