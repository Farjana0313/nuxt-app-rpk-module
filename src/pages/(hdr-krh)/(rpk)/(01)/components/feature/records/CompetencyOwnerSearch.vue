<template>
    <div class="bg-white border border-gray-200 p-6 w-full max-w-4xl mx-auto mt-6 shadow-lg rounded-lg">
        <div class="flex items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Competency Owner Search</h2>
        </div>
        <DxForm :form-data="formData" :label-location="'top'" :col-count="1" class="mb-6">
            <DxItem data-field="number" colSpan={1}>
                <DxLabel template="Number" />
            </DxItem>
            <DxItem data-field="identityCardNo" colSpan={1}>
                <DxLabel template="Identity Card No." />
            </DxItem>
        </DxForm>

        <div class="flex justify-end mt-6 space-x-3">
            <DxButton text="Reset" type="normal" stylingMode="outlined" @click="handleReset" :width="120" />
            <DxButton text="Search" type="default" stylingMode="contained" @click="handleSearch" :width="120" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useOwnerStore } from '@/stores/Owner/ownerStore';
import DxButton from 'devextreme-vue/button';
import { DxForm, DxItem, DxLabel } from 'devextreme-vue/form';
import { reactive } from 'vue';

// Instantiate the store
const ownerStore = useOwnerStore();

// Create reactive form data
const formData = reactive({
    number: '',
    identityCardNo: ''
});

// Method to handle the search button click
const handleSearch = () => {
    ownerStore.filterOwners(formData.number, formData.identityCardNo);
};

// Method to handle the reset button click
const handleReset = () => {
    formData.number = '';
    formData.identityCardNo = '';
    ownerStore.resetFilters();
};
</script>