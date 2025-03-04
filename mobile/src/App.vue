<template>
  <div class="sm:w-96">
    <Header></Header>
    <Toasts/>
    <router-view />
  </div>
</template>
<script setup>
import { watch, inject } from "vue"
import Header from './components/Header.vue';
import { Toasts } from 'frappe-ui'

const employeeId = inject("employee_id");

watch(employeeId,() => {
  localStorage.setItem('employee_id',JSON.stringify(employeeId))
})
</script>
