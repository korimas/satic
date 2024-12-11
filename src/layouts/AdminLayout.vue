<template>
    <q-layout view="hHh lpR fFf">

        <!--header-->
        <q-header bordered class="bg-white">
            <div class="column">
                <HeaderBar></HeaderBar>
            </div>
        </q-header>

        <q-page-container>
            <router-view />
            <!-- <ide-base></ide-base> -->
        </q-page-container>

    </q-layout>
</template>

<script setup lang="ts">
import HeaderBar from 'components/HeaderBar.vue';
</script>