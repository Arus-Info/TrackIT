<template>
    <div>
       <div v-for="p in projectListResource.data" class="pt-3">
            <div class="pl-5 pr-5 pb-2 pt-2 border-2 border-[#B9C8EA] flex flex-row justify-between">
               {{ p.project_name }} 
               <FeatherIcon name="edit" class="w-6 h-6" @click="edit(p.project_name)"/>
            </div>
       </div>
   </div>
</template>
<script setup>
import { createResource,FeatherIcon } from "frappe-ui";
import { useRouter } from 'vue-router';

const router = useRouter()

const projectListResource = createResource({
   url : "trackit.api.get_project_list",
   auto: true,
})

function edit(project){
  router.push({name : 'EditInstructions',params : {'project_name' : project}})
}

</script>