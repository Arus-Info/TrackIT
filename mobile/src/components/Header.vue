<template>
    <div class=" bg-gradient-to-r from-[#4A6BB6] to-[#7F9DE0] h-16 flex items-center justify-between" v-if="companyInfo.data">
        <div class=" pl-4">
            <img :src="companyInfo.data[0]" />
        </div>
        <div class="text-[#e5e8ed] font-[700] text-[25px] font-[Inter]"> {{ companyInfo.data[1] }} </div>
        <div class="pr-4">
            <div class="w-11"></div>
            <div v-if="session.isLoggedIn" class="bg-[#EAF0F4] w-11 h-11 rounded-[44px] flex items-center justify-center">
                <PersonIcon class=" h-7 w-7"></PersonIcon>
            </div>
        </div>
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
import PersonIcon from "../pages/icons/PersonIcon.vue";

const router = useRouter()

const companyInfo = createResource({
    url : "trackit.api.get_header_info",
    auto : true,
})
</script>