import './index.css'

import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import { reactive } from 'vue'

import {
  Button,
  Card,
  Input,
  setConfig,
  frappeRequest,
  resourcesPlugin,
} from 'frappe-ui'

let employeeId = localStorage.getItem("employee_id")
if(!employeeId){
  const employeeIdJSON = JSON.stringify({
    name : ''
  })
  localStorage.setItem("employee_id",employeeIdJSON)
  employeeId = {
    name : ''
  }
} else {
  employeeId = JSON.parse(employeeId)
}
const employee = reactive(employeeId)

let app = createApp(App)

setConfig('resourceFetcher', frappeRequest)

app.use(router)
app.use(resourcesPlugin)

app.component('Button', Button)
app.component('Card', Card)
app.component('Input', Input)

app.provide("employee_id",employee)

app.mount('#app')
