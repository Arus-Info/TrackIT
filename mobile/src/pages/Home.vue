<template>
  <div class=" sm:w-96 font-[Inter]">
    <div class=" pt-[16px] flex flex-col items-center justify-center">
      <div
        class=" w-[322px] h-11 bg-[#F2F2F2] flex items-center justify-center drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
        <p class="text-[#4A6BB6] font-[800] text-2xl">TrackIT</p>
      </div>
      <div class="pt-[30px]">
        <div class=" text-center">
          <img src="../images/home_page.png" />
        </div>
      </div>
    </div>
    <div class=" pt-15 flex justify-evenly ">
      <ThemeButton name="WorkIT" @click="router.push({name : 'WorkIT'})"></ThemeButton>
      <ThemeButton name="ProjectIT"></ThemeButton>
    </div>
  </div>

</template>

<script setup>
import { ref,inject } from 'vue'
import { createResource } from 'frappe-ui'
import { useRouter } from 'vue-router'
import { userResource } from '../data/user'
import ThemeButton from '../components/ThemeButton.vue'

const router = useRouter()

const employee = inject('employee_id')

const employeeResource = createResource({
  type: "POST",
  url: "trackit.api.get_employee_id",
  makeParams() {
    return {
      user_id: userResource.data
    }
  },
  onSuccess(d) {
    employee.name = d
  },
  auto: true,
})
</script>
