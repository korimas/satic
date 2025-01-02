<template>
    <q-expansion-item expand-separator icon="view_list" label="DETAILS" default-opened header-class="bg-grey-2">
        <q-list bordered dense class="property-list">
            <q-item v-for="([key, value], index) in Object.entries(attributes)" :key="index" class="row">
                <q-item-section class="col label-section text-grey-7 text-subtitle2 overflow-hidden">
                    {{ key }}
                </q-item-section>
                <q-item-section>{{ value }}</q-item-section>
            </q-item>
        </q-list>
    </q-expansion-item>

    <q-expansion-item expand-separator icon="support" label="REFERENCES" default-opened header-class="bg-grey-2">
        <q-list bordered dense class="property-list">
            <q-item v-for="([key, value], index) in Object.entries(attributes)" :key="index" class="row">
                <q-item-section class="col label-section text-grey-7 text-subtitle2 overflow-hidden">
                    {{ key }}
                </q-item-section>
                <q-item-section>{{ value }}</q-item-section>
            </q-item>
        </q-list>
    </q-expansion-item>
    <q-expansion-item expand-separator icon="question_answer" label="COMMENTS" default-opened header-class="bg-grey-2">
        <q-list bordered dense class="property-list">
            <q-item v-for="([key, value], index) in Object.entries(attributes)" :key="index" class="row">
                <q-item-section class="col label-section text-grey-7 text-subtitle2 overflow-hidden">
                    {{ key }}
                </q-item-section>
                <q-item-section>{{ value }}</q-item-section>
            </q-item>
        </q-list>
    </q-expansion-item>
</template>

<script setup lang="ts">

import { ref } from 'vue';

const attributes = ref({
    FoundVia: 'Software Tester',
    Severity: 'Critical',
    Reproduction: '100%',
    HWVersion: 'None',
    Components: 'Lidar-app',
    FusaRelated: 'No',
    RTCCertificateeq: 'NA',
    TestCaseId: 'SWQT-325716'
})

</script>