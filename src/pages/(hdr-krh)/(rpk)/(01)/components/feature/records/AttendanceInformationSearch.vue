<template>
    <div class="bg-white border border-gray-200 p-6 w-full max-w-4xl mx-auto mt-6 shadow-lg rounded-lg">
        <div class="flex items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Competency Owner Search</h2>

        </div>
        <DxForm :form-data="formData" :label-location="'top'" :col-count="1" class="mb-6">
            <!-- <DxGroupItem colCount={2} colSpan={2} caption="Search Criteria" /> -->
            <DxItem data-field="id" colSpan={1}>
                <DxLabel template="Agency/ Division" />
            </DxItem>
            <DxItem data-field="name" colSpan={2}>
                <DxLabel template="Number" />
            </DxItem>
            <DxItem data-field="name">
                <DxLabel template="Identity Card No." />
            </DxItem>
            <DxItem data-field="name" colSpan={1}>
                <DxLabel template="Position" />
            </DxItem>
            <DxItem data-field="name" colSpan={1}>
                <DxLabel template="Grade" />
            </DxItem>
        </DxForm>
    </div>
</template>

<script setup lang="ts">
import {
    DxForm, DxItem, DxLabel
} from 'devextreme-vue/form';
import DxButton, { type DxButtonTypes } from 'devextreme-vue/button';

</script>