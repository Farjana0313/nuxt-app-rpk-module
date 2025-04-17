<template>
    <div class="bg-white border border-gray-200 p-6 w-full max-w-4xl mx-auto mt-6 shadow-lg rounded-lg">
        <div class="flex items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Managing Competency Owner Attendance Record Entry</h2>
        </div>

        <!-- DevExtreme Form -->
        <DxForm :form-data="formData" :label-location="'top'" :col-count="2" class="mb-6">
            <DxItem data-field="agencyDivision" :col-span="1">
                <template #default>
                    <DxTextBox v-model:value="formData.agencyDivision" :read-only="true" :label="'Agency/ Division'" />
                </template>
            </DxItem>
            <DxItem data-field="number" :col-span="1">
                <template #default>
                    <DxTextBox v-model:value="formData.number" :read-only="true" :label="'Number'" />
                </template>
            </DxItem>
            <DxItem data-field="noWhenIntroduction" :col-span="1">
                <template #default>
                    <DxTextBox v-model:value="formData.noWhenIntroduction" :read-only="true"
                        :label="'Identity Card No.'" />
                </template>
            </DxItem>
            <DxItem data-field="position" :col-span="1">
                <template #default>
                    <DxTextBox v-model:value="formData.position" :read-only="true" :label="'Position'" />
                </template>
            </DxItem>
            <DxItem data-field="grade" :col-span="1">
                <template #default>
                    <DxTextBox v-model:value="formData.grade" :read-only="true" :label="'Grade'" />
                </template>
            </DxItem>
        </DxForm>
    </div>
</template>

<script setup lang="ts">
import { DxForm, DxItem } from 'devextreme-vue/form';
import DxTextBox from 'devextreme-vue/text-box';
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
    console.log('Initializing form data with:', JSON.stringify(props.selectedOwner));
    if (props.selectedOwner) {
        formData.agencyDivision = props.selectedOwner.agencyDivision || '';
        formData.number = props.selectedOwner.number || '';
        formData.noWhenIntroduction = props.selectedOwner.noWhenIntroduction || '';
        formData.position = props.selectedOwner.position?.toString() || '';
        formData.grade = props.selectedOwner.grade || '';
        console.log('Form data after initialization:', JSON.stringify(formData));
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