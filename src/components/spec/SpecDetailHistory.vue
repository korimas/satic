<template>
    <div>
        <q-timeline color="secondary">
            <!-- <q-timeline-entry heading body="Timeline heading" /> -->

            <q-timeline-entry title="Event Title" subtitle="February 22, 1986" avatar="/avatar/128.png" :body="body" />

            <q-timeline-entry title="Event Title" subtitle="February 21, 1986" icon="delete" :body="body" />

            <!-- <q-timeline-entry heading body="November, 2017" /> -->

            <q-timeline-entry title="Event Title" subtitle="February 22, 1986" :body="body" />

            <q-timeline-entry title="Event Title" subtitle="February 22, 1986" :body="body" />

            <q-timeline-entry title="Event Title" subtitle="February 22, 1986" color="orange" icon="done_all"
                :body="body" />

            <q-timeline-entry title="Event Title" subtitle="February 22, 1986" :body="body" />

            <q-timeline-entry title="Event Title" subtitle="February 22, 1986" :body="body" />
        </q-timeline>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const body = ref('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.')
</script>