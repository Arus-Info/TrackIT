<template>
  <div class="sm:w-96">
    <Header></Header>
    <router-view />
  </div>
</template>
<script setup>
import { watch, inject } from "vue"
import Header from './components/Header.vue';

const employeeId = inject("employee_id");

watch(employeeId,() => {
  localStorage.setItem('employee_id',JSON.stringify(employeeId))
})
</script>
