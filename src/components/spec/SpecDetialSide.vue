<template>
    <div class="q-ma-md">
        <q-expansion-item label="DETAILS" default-opened class="rounded-borders" style=" border: 1px solid #ddd;">
            <q-separator />

            <q-list dense class="property-list">
                <q-item v-for="([key, value], index) in Object.entries(attributes)" :key="index" class="row">
                    <q-item-section class="col label-section text-grey-7 text-subtitle2 overflow-hidden">
                        {{ key }}
                    </q-item-section>
                    <q-item-section>{{ value }}</q-item-section>
                </q-item>
            </q-list>
        </q-expansion-item>

        <div class="q-mt-md text-grey-7 text-subtitle2 q-gutter-sm">
            <div>
                Created {{ drawerStore.DetailSpecDrawer.data.created_at }}
            </div>

            <div>
                Updated {{ drawerStore.DetailSpecDrawer.data.updated_at }}
            </div>

        </div>
    </div>


</template>

<script setup lang="ts">

import { ref } from 'vue';
import { useDrawerStore } from 'src/stores/drawer';

const drawerStore = useDrawerStore();

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