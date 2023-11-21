<template>
  <div class="column">
    <div class="row full-width q-pa-xs q-gutter-xs">
      <q-btn unelevated round size="sm" icon="add">
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
      <q-space/>
      <q-btn unelevated round size="sm" icon="more_vert">
        <q-tooltip class="bg-grey-3 text-black">更多</q-tooltip>
        <q-menu cover auto-close>
          <q-list dense style="margin: 5px 0">
            <q-item clickable>
              <q-item-section avatar>
                <q-icon name="share"/>
              </q-item-section>
              <q-item-section>分享链接</q-item-section>
            </q-item>

          </q-list>
        </q-menu>
      </q-btn>
    </div>
    <MiTree :nodes="nodes" @doubleClick="doubleClick"/>
  </div>





</template>

<script>
import {defineComponent, ref} from 'vue'
import MiTree from 'components/base/MiTree.vue';

export default defineComponent({
  name: 'DocSide',
  components: {MiTree},
  emits: ['doubleClick'],

  setup(props, {emit}) {
    let nodes = ref([])
    const rightDrawerOpen = ref(false)
    nodes.value = [
      {
        key: 'SWRS-1',
        label: 'Overview',
        icon: 'folder',
        lazy: true
      },
      {
        key: 'SWRS-2',
        label: 'Work Mode',
        icon: 'folder',
        lazy: true
      },
      {
        key: 'SWRS-3',
        label: 'Network Management',
        icon: 'folder',
        lazy: true
      },
      {
        key: 'SWRS-4',
        label: 'Point Cloud Service',
        icon: 'folder',
        lazy: true
      }
    ]

    function doubleClick(nodeKey) {
      emit('doubleClick', nodeKey)
    }

    return {
      rightDrawerOpen,
      doubleClick,
      nodes
    }
  }
})
</script>


<style scoped>

</style>
