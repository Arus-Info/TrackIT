<template>
    <div>
        <div class=" pt-8 pl-[21px]">
            <Tab :tabs="tabs" @selected-tab="selectedTab=$event"></Tab>
        </div>
        <div v-if="selectedTab === 'Check-In'">
            <TimesheetEntry></TimesheetEntry>
        </div>
        <div v-else-if="selectedTab === 'Entries'">
            <WorkITEntries></WorkITEntries>
        </div>
        <div v-else>
            <ProjectSchedule></ProjectSchedule>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import Tab from '../components/Tab.vue';
import TimesheetEntry from './TimesheetEntry.vue';
import WorkITEntries from './WorkITEntries.vue';
import ProjectSchedule from './ProjectSchedule.vue';

const tabs = ["Check-In","Schedule","Entries"]
const selectedTab = ref('Check-In')

</script>
