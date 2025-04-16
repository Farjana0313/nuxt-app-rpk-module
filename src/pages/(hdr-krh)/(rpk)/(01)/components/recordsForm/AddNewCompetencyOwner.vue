<template>
    <div class="bg-white border border-gray-200 p-6 w-full max-w-4xl mx-auto shadow-lg rounded-lg">
        <div class="flex items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">{{ formTitle }}</h2>
        </div>
        <div class="option mb-4">
            <span>Agency/ Division</span>
            <DxSelectBox :items="agencyDivisions" :input-attr="{ 'aria-label': 'Agency/ Division' }"
                v-model:value="formData.agencyDivision" :disabled="props.viewOnly" />
        </div>
        <DxForm :form-data="formData" :label-location="'top'" :col-count="2" :disabled="props.viewOnly" class="mb-6">
            <DxItem data-field="number">
                <DxLabel template="Number" />
            </DxItem>
            <DxItem data-field="identityCardNo">
                <DxLabel template="Identity Card No." />
            </DxItem>
            <DxItem data-field="position" editor-type="dxSelectBox" :editor-options="{ items: positions }">
                <DxLabel template="Position" />
            </DxItem>
            <DxItem data-field="grade" editor-type="dxSelectBox" :editor-options="{ items: grades }">
                <DxLabel template="Grade" />
            </DxItem>
            <DxItem data-field="officerName1">
                <DxLabel template="Name of Division Administrative Officer 1" />
            </DxItem>
            <DxItem data-field="officerName2">
                <DxLabel template="Name of Division Administrative Officer 2" />
            </DxItem>
            <DxSimpleItem data-field="getToWork" editor-type="dxDateBox"
                :label="{ text: 'Date & Time of Entry to Work' }" :editor-options="{
                    type: 'datetime',
                    displayFormat: 'dd/MM/yyyy HH:mm',
                    stylingMode: 'outlined',
                }" :validation-rules="[{ type: 'required', message: 'Date & Time of Entry to Work is required' }]" />
            <DxSimpleItem data-field="outOfOffice" editor-type="dxDateBox" :label="{ text: 'Office Out Date & Time' }"
                :editor-options="{
                    type: 'datetime',
                    displayFormat: 'dd/MM/yyyy HH:mm',
                    stylingMode: 'outlined',
                }" :validation-rules="[{ type: 'required', message: 'Office Out Date & Time is required' }]" />
            <DxSimpleItem data-field="reEnterOffice" editor-type="dxDateBox"
                :label="{ text: 'Office Re-Entry Date & Time' }" :editor-options="{
                    type: 'datetime',
                    displayFormat: 'dd/MM/yyyy HH:mm',
                    stylingMode: 'outlined',
                }" :validation-rules="[{ type: 'required', message: 'Office Re-Entry Date & Time is required' }]" />
            <DxSimpleItem data-field="backToWork" editor-type="dxDateBox"
                :label="{ text: 'Return to Work Date & Time' }" :editor-options="{
                    type: 'datetime',
                    displayFormat: 'dd/MM/yyyy HH:mm',
                    stylingMode: 'outlined',
                }" :validation-rules="[{ type: 'required', message: 'Return to Work Date & Time is required' }]" />

            <DxItem data-field="noWhenIntroduction">
                <DxLabel template="Support" />
            </DxItem>

            <!-- File Upload -->
            <DxSimpleItem data-field="file" :col-span="2" editor-type="dxFileUploader" :editor-options="{
                selectButtonText: 'Select file',
                uploadButtonText: 'Upload file',
                showFileList: true,
                multiple: false,
                accept: 'image/*,.pdf',
                uploadMode: 'useButtons',
                uploadUrl: '/api/upload',
                onUploaded: handleUploadSuccess,
            }" />
        </DxForm>

        <div class="flex justify-end mt-6 space-x-3">
            <DxButton :text="props.viewOnly ? 'Edit' : (props.editMode ? 'Update' : 'Save')" type="default"
                stylingMode="contained" @click="handleSave" :width="120" />
            <DxButton v-if="!props.viewOnly" text="Cancel" type="normal" stylingMode="outlined" @click="handleCancel"
                :width="120" />
            <DxButton v-if="!props.viewOnly" text="Return" type="normal" stylingMode="outlined"
                @click="handleReturnToList" :width="120" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useOwnerStore } from '@/stores/Owner/ownerStore';
import type { CompetencyOwner } from '@/stores/Owner/types/types';
import DxButton from 'devextreme-vue/button';
import {
    DxForm, DxItem, DxLabel, DxSimpleItem
} from 'devextreme-vue/form';
import DxSelectBox from 'devextreme-vue/select-box';
import { computed, onMounted, ref, watch } from 'vue';

// Define props
const props = defineProps({
    editMode: {
        type: Boolean,
        default: false
    },
    viewOnly: {
        type: Boolean,
        default: false
    },
    editData: {
        type: Object,
        default: null
    }
});

// Use owner store
const ownerStore = useOwnerStore();

// Computed property for the form title
const formTitle = computed(() => {
    if (props.viewOnly) return 'View Competency Owner Attendance Record';
    return props.editMode ? 'Edit Competency Owner Attendance Record' : 'Add New Competency Owner Attendance Record';
});

// Define emits
const emit = defineEmits(['save', 'cancel', 'edit', 'toast']);

// Form data with default values
const formData = ref({
    number: '',
    identityCardNo: '',
    position: 1,
    grade: 'Junior',
    officerName1: '',
    officerName2: '',
    getToWork: null,
    outOfOffice: null,
    reEnterOffice: null,
    backToWork: null,
    noWhenIntroduction: '',
    agencyDivision: 'IT Department',
    file: null
});

// Reset form to defaults
const resetForm = () => {
    formData.value = {
        number: '',
        identityCardNo: '',
        position: 1,
        grade: 'Junior',
        officerName1: '',
        officerName2: '',
        getToWork: new Date(),
        outOfOffice: new Date(new Date().setHours(new Date().getHours() + 4)),
        reEnterOffice: new Date(new Date().setHours(new Date().getHours() + 5)),
        backToWork: new Date(new Date().setHours(new Date().getHours() + 8)),
        noWhenIntroduction: '',
        agencyDivision: 'IT Department',
        file: null
    };
};

// Options for select boxes
const agencyDivisions = [
    'IT Department',
    'HR Department',
    'Finance Department',
    'Marketing Department',
    'Operations',
    'Sales Department',
    'Customer Service',
    'Research & Development',
    'Legal Department',
    'Quality Assurance'
];

const positions = [1, 2, 3];
const grades = ['Junior', 'Mid-level', 'Senior'];

// Watch for changes to editData prop
watch(() => props.editData, (newValue) => {
    if (newValue && (props.editMode || props.viewOnly)) {
        // Fill the form with the edit data
        formData.value = {
            ...formData.value,
            number: newValue.number || '',
            identityCardNo: newValue.identityCardNo || '',
            position: newValue.position || 1,
            grade: newValue.grade || 'Junior',
            officerName1: newValue.officerName1 || '',
            officerName2: newValue.officerName2 || '',
            getToWork: newValue.getToWork ? new Date(newValue.getToWork) : null,
            outOfOffice: newValue.outOfOffice ? new Date(newValue.outOfOffice) : null,
            reEnterOffice: newValue.reEnterOffice ? new Date(newValue.reEnterOffice) : null,
            backToWork: newValue.backToWork ? new Date(newValue.backToWork) : null,
            noWhenIntroduction: newValue.noWhenIntroduction || '',
            agencyDivision: newValue.agencyDivision || 'IT Department'
        };
    } else if (!props.editMode && !props.viewOnly) {
        // Reset the form for new entries
        resetForm();
    }
}, { immediate: true });

// Method to handle file upload success
const handleUploadSuccess = (e) => {
    console.log('File uploaded successfully:', e);
};

// Method to handle the save button click
const handleSave = () => {
    console.log('handleSave called, viewOnly:', props.viewOnly);

    // If in view only mode, emit event to switch to edit mode
    if (props.viewOnly) {
        emit('edit', formData.value);
        return;
    }

    // Log form data for debugging
    console.log('Form data to save:', formData.value);

    // Basic validation
    if (!formData.value.number || !formData.value.getToWork) {
        emit('toast', {
            type: 'error',
            message: 'Please fill in all required fields'
        });
        return;
    }

    // Format dates to strings if they are Date objects
    const formatDate = (date) => {
        if (date instanceof Date) {
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        }
        return date;
    };

    // Prepare data for saving
    const saveData: Partial<CompetencyOwner> = {
        number: formData.value.number,
        identityCardNo: formData.value.identityCardNo,
        position: Number(formData.value.position),
        grade: formData.value.grade,
        officerName1: formData.value.officerName1,
        officerName2: formData.value.officerName2,
        getToWork: formatDate(formData.value.getToWork),
        outOfOffice: formatDate(formData.value.outOfOffice),
        reEnterOffice: formatDate(formData.value.reEnterOffice),
        backToWork: formatDate(formData.value.backToWork),
        noWhenIntroduction: formData.value.noWhenIntroduction,
        agencyDivision: formData.value.agencyDivision,
        status: 'Active'
    };

    try {
        // Save data depending on mode (edit or add)
        if (props.editMode && props.editData?.was) {
            // Update existing record
            const success = ownerStore.updateOwnerRecord(props.editData.was, saveData);

            if (success) {
                emit('toast', {
                    type: 'success',
                    message: 'Record updated successfully'
                });
                emit('save', { ...saveData, was: props.editData.was });
            } else {
                emit('toast', {
                    type: 'error',
                    message: 'Failed to update record'
                });
            }
        } else {
            // Add new record
            const newRecord = ownerStore.addOwnerRecord(saveData);

            emit('toast', {
                type: 'success',
                message: 'Record added successfully'
            });
            emit('save', newRecord);
        }
    } catch (error) {
        console.error('Error saving record:', error);
        emit('toast', {
            type: 'error',
            message: 'An error occurred while saving'
        });
    }
};

// Method to handle the cancel button click
const handleCancel = () => {
    console.log('Cancel button clicked');
    emit('cancel');
};

// On component mount
onMounted(() => {
    console.log('AddNewCompetencyOwner component mounted');
    console.log('Props:', { editMode: props.editMode, viewOnly: props.viewOnly });

    // If not editing or viewing, initialize with default dates
    if (!props.editMode && !props.viewOnly) {
        resetForm();
    }

    console.log('Initial form data:', formData.value);
});
</script>