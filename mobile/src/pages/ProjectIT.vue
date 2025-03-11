<template>
    <div>
        <div class="absolute top-20 text-[#4A6BB6] font-[400] text-[20px] left-[180px]">
            ProjectIT
        </div>
        <div class=" pt-8 pl-[21px]">
            <Tab :tabs="tabs" @selected-tab="selectedTab = $event"></Tab>
        </div>
        <div class=" pt-5 pl-5 pr-5 pb-5">
            <div v-if="selectedTab === 'Allocation'">
                <Allocation></Allocation>
            </div>
            <div v-else>
                <WorkInstructions></WorkInstructions>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import Tab from '../components/Tab.vue';
import Allocation from './Allocation.vue';
import WorkInstructions from './WorkInstructions.vue';

const tabs = ["Allocation","Instruction"]
const selectedTab = ref('Allocation')
</script>