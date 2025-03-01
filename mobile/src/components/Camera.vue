<template>
    <div class="flex items-center flex-col">
        <img id="preview-image" />
    </div>
    <div class="flex items-center flex-col" v-if="!showPreview">
        <video ref="video" autoplay muted hidden playsinline webkit-playsinline></video>
        <canvas ref="canvas" width="350" height="500"></canvas>
        <div class="pt-7 flex flex-row">
                <div>
                    <button @click="swapCamera">
                        <FeatherIcon class="h-7 w-7" name="refresh-ccw" />
                    </button>
                </div>
                <div>
                    <button @click="captureImage">
                        <FeatherIcon name="camera" class="h-10 w-10" />
                    </button>
                </div>
        </div>
    </div>
    <div v-else class="flex items-center flex-col pt-7">
        <Button variant="solid" size="lg" @click="endCamera"> {{props.mode}} </Button>
    </div>
    <div class=" pt-3 pl-10">
        <Button variant="solid" @click="emit('close-event', true)">Back</Button>
    </div>
</template>
<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { FeatherIcon } from "frappe-ui";

const props = defineProps({
    mode : String
})

const emit = defineEmits(['close-event','capture-event'])
const video = ref(null)
const canvas = ref(null)
const ctx = ref(null)

const constraints = ref({
    video : {
        facingMode : "environment"
    },
    audio : false
})

const showPreview = ref(false)
const imageFile = ref(null)

onMounted(async () => {
    if (video.value && canvas.value) {
        ctx.value = canvas.value.getContext("2d")
        getCamera()
    }
})

onBeforeUnmount(() => {
    if(video.value)
    {
        stopCamera()
    }
})

function Draw() {
    ctx.value.drawImage(video.value, 0, 0)
    requestAnimationFrame(Draw)
}

function stopCamera(){
    const mediaStream = video.value.srcObject
    const tracks = mediaStream.getTracks();
    tracks.forEach(track => track.stop())
}

function captureImage(){
    var dataurl = canvas.value.toDataURL("image/png")
    var image = document.getElementById('preview-image')
    image.src = dataurl
    stopCamera()
    showPreview.value = true
    imageFile.value = dataURLtoFile(dataurl,`${new Date().toISOString()}_${props.mode}.png`)
}

function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

function endCamera(){
    emit('capture-event',imageFile.value)
    emit('close-event', true)
}

function swapCamera() {
    stopCamera()
    if (constraints.value.video.facingMode == "user") {
        constraints.value.video.facingMode = "environment"
    }
    else {
        constraints.value.video.facingMode = "user"
    }
    getCamera()
}

function getCamera() {
    navigator.mediaDevices.getUserMedia(constraints.value)
        .then((stream) => {
            video.value.srcObject = stream
            video.value.play()
            requestAnimationFrame(Draw)
        })
}

</script>