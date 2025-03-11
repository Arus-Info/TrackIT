<template>
    <button :disabled="props.disabled">
        <div :class='["rounded-lg pl-4 pr-4 h-10 flex items-center justify-center text-[#FFFFFF]",
            disabled ? "bg-[#A1A3AB]" : "bg-[#4A6BB6] shadow-[0_4px_4px_rgba(0,0,0,0.25)]"]' >

            <div class="text-white">{{ props.name }}</div>
        </div>
    </button>
</template>
<script setup>

const props = defineProps({
    name: String,
    disabled: Boolean
})
</script>