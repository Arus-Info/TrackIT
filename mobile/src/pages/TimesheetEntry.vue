<template>
    <div class=" pt-7 text-right pr-7" v-if="! showCamera">
        <button :disabled="projectName == ''" @click="showCamera = true">
            <div :class='["rounded-lg pt-2 pb-2 pl-3 pr-4 text-[#FFFFFF]",
                projectName ? "bg-[#4A6BB6] drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]" : "bg-[#A1A3AB]"
            ]'>
                {{ actionName }}
            </div>
        </button>
    </div>
    <div v-if="! showCamera">
        <div class=" pt-7 pl-6 pr-6 font-[Inter] font-[600]">
            <SelectionList :dataList="projectResource" @select-event="projectName = $event"></SelectionList>
        </div>
    </div>
    <div v-if="showCamera">
        <Camera mode="Check-In"></Camera>
    </div>
</template>
<script setup>
import { inject,ref } from 'vue';
import { createResource } from 'frappe-ui';
import SelectionList from '../components/SelectionList.vue';
import Camera from '../components/Camera.vue';

const employee = inject("employee_id")

const projectName = ref('')

const actionName = ref('Check-In')

const showCamera = ref(false)

const projectResource = createResource({
    url : "trackit.api.get_project_allocation",
    makeParams(){
        return {
            employee_id : employee.name
        }
    },
    onSuccess(data){
        console.log(data)
    },
    auto : true
})
</script>