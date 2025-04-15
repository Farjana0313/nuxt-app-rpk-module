<template>
    <div class="bg-white border border-gray-200 p-6 w-full max-w-4xl mx-auto mt-6 shadow-lg rounded-lg">
        <div class="flex items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Competency Owner Search</h2>

        </div>
        <div class="option">
            <span>Agency/ Division
            </span>
            <DxSelectBox :items="labelModes" :input-attr="{ 'aria-label': 'Agency/ Division' }"
                v-model:value="labelMode" />
        </div>
        <DxForm :form-data="formData" :label-location="'top'" :col-count="1" class="mb-6">
            <!-- <DxGroupItem colCount={2} colSpan={2} caption="Search Criteria" /> -->

            <DxItem data-field="name">
                <DxLabel template="Identity Card No." />
            </DxItem>

            <DxSimpleItem
              data-field="newStartDateTime"
              editor-type="dxDateBox"
              :label="{ text: 'Attendance System Data Date' }"
              :editor-options="{
                type: 'datetime',
                displayFormat: 'dd/MM/yyyy HH:mm',
                stylingMode: 'outlined',
              }"
              :validation-rules="[{ type: 'required', message: 'Attendance System Data Date' }]"
            />
        </DxForm>


        <div class="flex justify-end mt-6 space-x-3">
            <DxButton text="Reset" type="normal" stylingMode="outlined" @click="handleReset" :width="120" />
            <DxButton text="Search" type="default" stylingMode="contained" @click="handleSearch" :width="120" />
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    DxForm, DxItem, DxLabel, DxSimpleItem
} from 'devextreme-vue/form';
import DxButton, { type DxButtonTypes } from 'devextreme-vue/button';

import DxSelectBox from 'devextreme-vue/select-box';
// // import { DxButton, DxSelectBox, DxTextBox } from 'devextreme-vue'
// import { useEmployeeStore } from "@/stores/dataStore";
// import DxButton from "devextreme-vue/button";
// import DxSelectBox from "devextreme-vue/select-box";
// import DxTextBox from "devextreme-vue/text-box";
// import { ref } from "vue";
// // Instantiate the store
// const employeeStore = useEmployeeStore();
// const { filterData, resetEmployees } = employeeStore; // Destructure the methods from the store

// // Reactive state for inputs
// const id = ref("");
// const name = ref("");
// const selectedDisplay = ref("Daily");
// const displayOptions = ["Daily", "Weekly", "Monthly"];

// Method to handle the search button click
const handleSearch = () => {
    filterData(name.value, id.value);
};

const handleReset = () => {
    id.value = "";
    name.value = "";
    selectedDisplay.value = "Daily";
    resetEmployees();
};
</script>