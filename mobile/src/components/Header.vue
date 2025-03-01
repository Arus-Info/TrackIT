<template>
    <div class=" bg-gradient-to-r from-[#4A6BB6] to-[#7F9DE0] h-[56px]">
    </div>
    <div v-if="session.isLoggedIn" class=" pt-[14px] flex justify-between pl-[17px] pr-[19px]">
        <button @click="router.back()">
            <img src="../images/fluent-mdl2_back.png" />
        </button>
        <div></div>
        <button @click="session.logout.submit()">
            <img src="../images/signout.png" />
        </button>
    </div>
</template>
<script setup>
import { createResource } from "frappe-ui";
import { session } from '../data/session'
import { useRouter } from "vue-router";

const router = useRouter()

// const companyLogo = createResource({
//     url : "trackit.api.get_company_logo",
//     makeParams(){
//         return {

//         }
//     }
// })
</script>