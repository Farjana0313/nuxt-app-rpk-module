<template>
    <div class="bg-white border border-gray-200 p-6 w-full max-w-4xl mx-auto shadow-lg rounded-lg">
        <div class="flex items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">{{ formTitle }}</h2>
        </div>

        <!-- Debug info - remove in production -->
        <div v-if="false" class="bg-gray-100 p-4 mb-4 rounded text-xs">
            <p>View Only: {{ props.viewOnly }}</p>
            <p>Edit Mode: {{ props.editMode }}</p>
            <p>Edit Data Present: {{ !!props.editData }}</p>
            <p>Form Data Sample: {{ formData.number }}, {{ formData.getToWork }}</p>
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
    console.log('Resetting form to defaults');

    // Get current date for setting default values
    const now = new Date();

    // Set default values for all form fields
    formData.value = {
        number: '',
        identityCardNo: '',
        position: 1,
        grade: 'Junior',
        officerName1: '',
        officerName2: '',
        getToWork: now,
        outOfOffice: new Date(now.getTime() + 4 * 60 * 60 * 1000), // +4 hours
        reEnterOffice: new Date(now.getTime() + 5 * 60 * 60 * 1000), // +5 hours
        backToWork: new Date(now.getTime() + 8 * 60 * 60 * 1000), // +8 hours
        noWhenIntroduction: '',
        agencyDivision: 'IT Department',
        file: null
    };

    console.log('Form reset complete. New values:', formData.value);
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
    console.log('editData changed:', newValue);
    console.log('In edit mode:', props.editMode);
    console.log('In view only mode:', props.viewOnly);

    if (newValue === null) {
        console.log('editData is null, this is a new record. Resetting form...');
        resetForm();
        return;
    }

    if (newValue && (props.editMode || props.viewOnly)) {
        console.log('Filling form with edit data...');

        // Helper function to convert date strings to Date objects
        const toDateObject = (dateStr) => {
            if (!dateStr) return null;

            try {
                // Handle both ISO format and custom format
                const date = new Date(dateStr);
                if (!isNaN(date.getTime())) {
                    console.log(`Converted ${dateStr} to date: ${date}`);
                    return date;
                }
                console.warn(`Failed to parse date: ${dateStr}`);
                return null;
            } catch (err) {
                console.error(`Error parsing date ${dateStr}:`, err);
                return null;
            }
        };

        // Fill the form with the edit data
        formData.value = {
            ...formData.value,
            number: newValue.number || '',
            identityCardNo: newValue.identityCardNo || '',
            position: newValue.position || 1,
            grade: newValue.grade || 'Junior',
            officerName1: newValue.officerName1 || '',
            officerName2: newValue.officerName2 || '',
            getToWork: toDateObject(newValue.getToWork),
            outOfOffice: toDateObject(newValue.outOfOffice),
            reEnterOffice: toDateObject(newValue.reEnterOffice),
            backToWork: toDateObject(newValue.backToWork),
            noWhenIntroduction: newValue.noWhenIntroduction || '',
            agencyDivision: newValue.agencyDivision || 'IT Department'
        };

        console.log('Form data after filling:', formData.value);
    } else if (!props.editMode && !props.viewOnly) {
        console.log('Resetting form for new entry');
        // Reset the form for new entries
        resetForm();
    }
}, { immediate: true });

// Watch for changes to viewOnly and editMode props
watch(() => props.viewOnly, (newValue) => {
    console.log('viewOnly changed to:', newValue);
    console.log('editMode is:', props.editMode);
    console.log('editData is:', props.editData);
}, { immediate: true });

watch(() => props.editMode, (newValue) => {
    console.log('editMode changed to:', newValue);
    console.log('viewOnly is:', props.viewOnly);
    console.log('editData is:', props.editData);
}, { immediate: true });

// Method to handle file upload success
const handleUploadSuccess = (e) => {
    console.log('File uploaded successfully:', e);
};

// Method to handle the save button click
const handleSave = () => {
    console.log('handleSave called, viewOnly:', props.viewOnly);
    console.log('EditData in handleSave:', props.editData);

    // If in view only mode, emit event to switch to edit mode
    if (props.viewOnly) {
        console.log('In view-only mode, switching to edit mode');
        console.log('Emitting form data for edit:', formData.value);

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

    try {
        // Format dates to strings if they are Date objects
        const formatDate = (date) => {
            if (date instanceof Date) {
                return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
            }
            return date;
        };

        // Prepare data for saving
        const saveData = {
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

        // If editing, include the original was ID
        if (props.editMode && props.editData?.was) {
            saveData.was = props.editData.was;
            console.log('Including was ID in saveData:', saveData.was);
        }

        // Emit the save event with the prepared data
        console.log('Emitting save event with data:', saveData);
        emit('save', saveData);

        // Show success toast message
        emit('toast', {
            type: 'success',
            message: props.editMode ? 'Record updated successfully' : 'Record added successfully'
        });
    } catch (error) {
        console.error('Error preparing data:', error);
        emit('toast', {
            type: 'error',
            message: `Error: ${error.message}`
        });
    }
};

// Method to handle the cancel button click
const handleCancel = () => {
    console.log('Cancel button clicked');
    emit('cancel');
};

// Method to handle return to list button click
const handleReturnToList = () => {
    console.log('Return to list button clicked');
    emit('cancel');
};

// On component mount
onMounted(() => {
    console.log('AddNewCompetencyOwner component mounted');
    console.log('Props:', {
        editMode: props.editMode,
        viewOnly: props.viewOnly,
        editData: props.editData
    });

    // For new records (editData is null) or when not in edit/view mode
    if (props.editData === null || (!props.editMode && !props.viewOnly)) {
        console.log('Initializing with default values for new record');
        resetForm();
        return;
    }

    // Only process editData if it exists and we're in edit or view mode
    if (props.editData && (props.editMode || props.viewOnly)) {
        console.log('EditData is available, filling form for edit/view');

        // Handle date conversions for editData
        const toDateObject = (dateStr) => {
            if (!dateStr) return null;
            try {
                const date = new Date(dateStr);
                if (!isNaN(date.getTime())) {
                    return date;
                }
                return null;
            } catch (err) {
                console.error(`Error parsing date ${dateStr}:`, err);
                return null;
            }
        };

        // Fill the form with the edit data
        formData.value = {
            ...formData.value,
            number: props.editData.number || '',
            identityCardNo: props.editData.identityCardNo || '',
            position: props.editData.position || 1,
            grade: props.editData.grade || 'Junior',
            officerName1: props.editData.officerName1 || '',
            officerName2: props.editData.officerName2 || '',
            getToWork: toDateObject(props.editData.getToWork),
            outOfOffice: toDateObject(props.editData.outOfOffice),
            reEnterOffice: toDateObject(props.editData.reEnterOffice),
            backToWork: toDateObject(props.editData.backToWork),
            noWhenIntroduction: props.editData.noWhenIntroduction || '',
            agencyDivision: props.editData.agencyDivision || 'IT Department'
        };
    } else {
        console.log('No valid editData, using default values');
        resetForm();
    }

    console.log('Initial form data:', formData.value);
});
</script>