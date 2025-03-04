<template>
    <div class=" pt-7 text-right pr-7" v-if="!showCamera">
        <PrimaryButton @click="showCamera = true" :disabled="projectName == ''" :name="actionName"></PrimaryButton>
    </div>
    <div v-if="!showCamera">
        <div v-if="actionName == 'Check-In'">
            <div class=" pt-7 pl-6 pr-6 font-[Inter] font-[600]">
                <SelectionList :dataList="projectAllocationResource" @select-event="handleProjectSelection($event)">
                </SelectionList>
            </div>
        </div>
        <div v-else class=" pl-6 pr-6 pt-7 pb-4">
            <div class="bg-[#B9C8EA] pt-3 pb-3 pl-4 pr-3 rounded-t-md flex gap-2">
                <ProjectOutline class=" h-6 w-6"></ProjectOutline>
                <p class="text-[#4A6BB6] font-[600] font-[Inter]"> {{ projectName }}</p>
            </div>
            <div
                class="bg-[#F5F8FF] pl-4 pr-3 pt-5 pb-3 rounded-b-md border-[#B9C8EA] border-x-2 border-b-2 flex flex-col gap-3">
                <p> Check-In Time : {{ dayjs(timesheetDetails.from_time).format("hh:mm:ss a") }}</p>
                <div @click="showCamera = true; cameraMode = 'Upload'"
                    class="bg-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] rounded-sm pt-3 pb-3 pl-2 pr-2 flex gap-2">
                    <FeatherIcon name="download" class="h-6 w-6" />
                    <p>Additional Photo without Checkout</p>
                </div>
            </div>
            <div class=" pt-6">
                <!-- <Instructions ></Instructions> -->
            </div>
        </div>
    </div>
    <div v-if="showCamera" class=" pt-7">
        <Camera :mode="cameraMode" @capture-event="handleImageCapture($event)" @close-event="showCamera = false">
        </Camera>
    </div>

    <div v-if="showError">
        <ErrorMessage @dialog-event="showError = $event" :error-message="errorMessage"></ErrorMessage>
    </div>
</template>
<script setup>
import { inject, ref, onMounted } from 'vue';
import { createResource, createListResource, toast, FeatherIcon } from 'frappe-ui';
import { FileAttachment } from '../composables';
import ErrorMessage from '../components/ErrorMessage.vue';
import SelectionList from '../components/SelectionList.vue';
import Camera from '../components/Camera.vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import dayjs from 'dayjs';
import ProjectOutline from './icons/ProjectOutline.vue'
import customParseFormat from "dayjs/plugin/customParseFormat";
import Instructions from './Instructions.vue';

dayjs.extend(customParseFormat);

onMounted(async function () {
    timesheet.update({
        fields: ["name", "time_logs.from_time", "time_logs.project", "note", "parent_project.project_name"],
        filters: {
            employee: employee.name,
            docstatus: 0,
            start_date: dayjs().format('YYYY-MM-DD')
        },
    })
    timesheet.fetch()
    await projectAllocationResource.fetch()
    if (projectAllocationResource.data.length === 0) {
        // isProjectAllocated.value = false
    }
})

const employee = inject("employee_id")
const projectName = ref('')
const timesheetDetails = ref({})
const customer = ref('')
const projectId = ref('')
const actionName = ref('Check-In')
const cameraMode = ref('Check-In')
const showCamera = ref(false)

const checkInImage = ref([])

const errorMessage = ref('')
const showError = ref(false)

const timesheet = createListResource({
    doctype: "Timesheet",
    insert: {
        onSuccess(data) {
            toast({
                title: "Success",
                text: "Checked In",
                icon: "check-circle",
                position: "bottom-center",
                iconClasses: "text-green-500",
            });
            uploadAllAttachments("Timesheet", data.name, checkInImage.value)
        },
        onError(e) {
            errorMessage.value = e
            showError.value = true
        }
    },
    setValue: {
        onSuccess() {
            let title;
            if (cameraMode.value === 'Upload') {
                title = "Additional Photo Uploaded"
                cameraMode.value = 'Check-Out'
                timesheet.fetch()
            }
            else {
                cameraMode.value = "Check-In"
                actionName.value = "Check-In"
                projectName.value = ''
                title = "Checked Out"
            }
            toast({
                title: "Success",
                text: title,
                icon: "check-circle",
                position: "bottom-center",
                iconClasses: "text-green-500",
            });
        },
        onError(e) {
            console.log(e)
            errorMessage.value = e
            showError.value = true
        }
    },
    onSuccess(data) {
        if (data.length) {
            actionName.value = "Check-Out"
            cameraMode.value = "Check-Out"
            timesheetDetails.value = data[0]
            projectName.value = data[0].project_name
            projectId.value = data[0].project
            // displayInstructions()
            // teamMembers.fetch()
        }
    },
    onError(e) {
        errorMessage.value = e
        showError.value = true
    }

})

const projectAllocationResource = createResource({
    url: "trackit.api.get_project_allocation",
    makeParams() {
        return {
            employee_id: employee.name
        }
    }
})

function handleProjectSelection(project_name) {
    projectName.value = project_name
    // displayInstructions()
    // teamMembers.fetch()
    projectResource.update({
        filters: { "project_name": project_name },
    })
    projectResource.fetch()
}

async function uploadAllAttachments(documentType, documentName, attachments) {
    const uploadPromises = attachments.map(async (attachment) => {
        const fileAttachment = new FileAttachment(attachment)
        return fileAttachment
            .upload(documentType, documentName, "")
            .then((fileDoc) => {
                fileDoc.uploaded = true
            })

    })

    await Promise.allSettled(uploadPromises)
}

async function handleImageCapture(file) {
    if (cameraMode.value === 'Check-In') {
        checkInImage.value = [file]
        checkIn()
    }
    else {
        await uploadAllAttachments("Timesheet", timesheetDetails.value.name, [file])
        if(cameraMode.value === "Upload"){
            additionalImage()
        }
        else{
            checkOut()
        }
    }
}

const workTimings = createResource({
    url: "trackit.api.get_work_time_settings",
})

const projectResource = createListResource({
    doctype: "Project",
    fields: ["customer", "name"],
    onSuccess(d) {
        customer.value = d[0].customer
        projectId.value = d[0].name
    },
    onError(e) {
        errorMessage.value = e
        showError.value = true
    }
})

function checkIn() {
    timesheet.insert.submit({
        customer: customer.value,
        parent_project: projectId.value,
        employee: employee.name,
        note: "<p>Check in at " + dayjs().format("hh:mm:ss A") + "</p>",
        time_logs: [{
            from_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            project: projectId.value,
        }],
    })
}

function additionalImage(){
    timesheet.setValue.submit({
        name: timesheetDetails.value.name,
        note: timesheetDetails.value.note + "<p>Additional Photo added at " + dayjs().format("hh:mm:ss A") + "</p>"
    })
}

async function checkOut(){
    await workTimings.fetch()
    let time_logs = []
    let start_time = dayjs(workTimings.data.start_time,'HH:mm:ss')
    let end_time = dayjs(workTimings.data.end_time,'HH:mm:ss')
    let from_time = dayjs(timesheetDetails.value.from_time)
    let time = dayjs()

    if (from_time < start_time && time >= start_time) {
        time_logs.push({
            activity_type: workTimings.data.over_time_activity_type,
            from_time: from_time.format('YYYY-MM-DD HH:mm:ss'),
            to_time: start_time.format('YYYY-MM-DD HH:mm:ss'),
            project: projectId.value,
        })
        from_time = start_time.add(1, 's')
    }
    if (time >= end_time && from_time < end_time) {
        time_logs.push({
            activity_type: workTimings.data.regular_time_activity_type,
            from_time: from_time.format('YYYY-MM-DD HH:mm:ss'),
            to_time: end_time.format('YYYY-MM-DD HH:mm:ss'),
            project: projectId.value,
        })
        from_time = end_time.add(1, 's')
    }
    if ((time > end_time && from_time >= end_time) || time <= start_time) {
        time_logs.push({
            activity_type: workTimings.data.over_time_activity_type,
            from_time: from_time.format('YYYY-MM-DD HH:mm:ss'),
            to_time: time.format('YYYY-MM-DD HH:mm:ss'),
            project: projectId.value,
        })
    }
    if (time <= end_time && from_time >= start_time) {
        time_logs.push({
            activity_type: workTimings.data.regular_time_activity_type,
            from_time: from_time.format('YYYY-MM-DD HH:mm:ss'),
            to_time: time.format('YYYY-MM-DD HH:mm:ss'),
            project: projectId.value,
        })
    }
    // instructions.value = []
    // members.value = []
    timesheet.setValue.submit({
        name: timesheetDetails.value.name,
        note: timesheetDetails.value.note + "<p> Check Out at " + dayjs().format("hh:mm:ss A") + "</p>",
        time_logs: time_logs,
        docstatus: 1
    })
}
</script>