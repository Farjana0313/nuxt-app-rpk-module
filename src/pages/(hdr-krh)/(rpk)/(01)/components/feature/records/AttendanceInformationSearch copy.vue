<template>
    <div class="bg-white border border-gray-200 p-6 w-full max-w-4xl mx-auto mt-6 shadow-lg rounded-lg">
        <div class="flex items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Managing Competency Owner Attendance Record Entry</h2>
        </div>

        <!-- Use standard HTML form elements instead of DevExtreme -->
        <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="form-group">
                <label class="block text-gray-700 text-sm font-bold mb-2">Agency/ Division</label>
                <input type="text" v-model="formData.agencyDivision" readonly
                    class="bg-gray-100 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
            </div>

            <div class="form-group">
                <label class="block text-gray-700 text-sm font-bold mb-2">Number</label>
                <input type="text" v-model="formData.number" readonly
                    class="bg-gray-100 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
            </div>

            <div class="form-group">
                <label class="block text-gray-700 text-sm font-bold mb-2">Identity Card No.</label>
                <input type="text" v-model="formData.noWhenIntroduction" readonly
                    class="bg-gray-100 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
            </div>

            <div class="form-group">
                <label class="block text-gray-700 text-sm font-bold mb-2">Position</label>
                <input type="text" v-model="formData.position" readonly
                    class="bg-gray-100 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
            </div>

            <div class="form-group">
                <label class="block text-gray-700 text-sm font-bold mb-2">Grade</label>
                <input type="text" v-model="formData.grade" readonly
                    class="bg-gray-100 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
            </div>
        </div>

        <!-- Debug info - remove after testing -->
        <div class="mt-4 p-2 bg-gray-100 text-xs rounded">
            <p>Debug information:</p>
            <p>selectedOwner (props): {{ JSON.stringify(props.selectedOwner) }}</p>
            <p>formData: {{ JSON.stringify(formData) }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue';

// Define props for the component
const props = defineProps({
    selectedOwner: {
        type: Object,
        default: () => ({})
    }
});

// Create reactive form data
const formData = reactive({
    agencyDivision: '',
    number: '',
    noWhenIntroduction: '',
    position: '',
    grade: ''
});

// Initialize form data with props.selectedOwner immediately
const initFormData = () => {
    console.log('Initializing form data with:', props.selectedOwner);
    if (props.selectedOwner) {
        formData.agencyDivision = props.selectedOwner.agencyDivision || '';
        formData.number = props.selectedOwner.number || '';
        formData.noWhenIntroduction = props.selectedOwner.noWhenIntroduction || '';
        formData.position = props.selectedOwner.position?.toString() || '';
        formData.grade = props.selectedOwner.grade || '';
    }
};

// Call init on mounted
onMounted(() => {
    console.log('Component mounted, initializing form data');
    initFormData();
});

// Watch for changes in the selectedOwner prop and update the form data
watch(() => props.selectedOwner, (newOwner) => {
    console.log('newOwner in watch:', newOwner);
    console.log('Type of newOwner:', typeof newOwner);
    console.log('Is newOwner an object?', newOwner !== null && typeof newOwner === 'object');
    console.log('Properties in newOwner:', Object.keys(newOwner));

    // Manually update each field, with additional logging
    try {
        formData.agencyDivision = newOwner?.agencyDivision || '';
        console.log('Set agencyDivision to:', formData.agencyDivision);

        formData.number = newOwner?.number || '';
        console.log('Set number to:', formData.number);

        formData.noWhenIntroduction = newOwner?.noWhenIntroduction || '';
        console.log('Set noWhenIntroduction to:', formData.noWhenIntroduction);

        formData.position = newOwner?.position?.toString() || '';
        console.log('Set position to:', formData.position);

        formData.grade = newOwner?.grade || '';
        console.log('Set grade to:', formData.grade);

        console.log('Updated form data:', formData);
    } catch (error) {
        console.error('Error updating form data:', error);
    }
}, { immediate: true, deep: true });

// Method to reset the form data
const resetForm = () => {
    formData.agencyDivision = '';
    formData.number = '';
    formData.noWhenIntroduction = '';
    formData.position = '';
    formData.grade = '';
};

// Expose the resetForm method to parent components
defineExpose({
    resetForm
});
</script>