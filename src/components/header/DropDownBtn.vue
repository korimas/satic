<template>
  <q-btn-dropdown
    dense
    flat
    dropdown-icon="expand_more"
    class="text-capitalize text-grey-7"
    :label="label"
    menu-anchor="bottom left"
    menu-self="top left"
    :menu-offset="[0, 5]"
  >
    <slot name="drop-content"></slot>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    default: 'Button label',
  },
});
</script>
