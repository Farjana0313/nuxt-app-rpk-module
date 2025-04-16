<template>
  <div class="container">
    <!-- Main view with owner search and list -->
    <div v-if="!showAttendanceView">
      <!-- Owner Search -->
      <CompetencyOwnerSearch />
      <!-- List of Competency Owners -->
      <ListOfCompetencyOwners @view-attendance="showAttendanceInfo" />
    </div>

    <!-- Attendance details view -->
    <div v-else>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Competency Owner Attendance Details</h2>
        <DxButton icon="arrow-left" text="Back to List" type="normal" stylingMode="outlined"
          @click="showAttendanceView = false" />
      </div>
      <AttendanceInformationSearch :selected-owner="selectedOwner" />
      <ListOfCompetencyOwnerAttendanceRecords :filtered-owner-data="filteredAttendanceData" />
    </div>
  </div>
</template>
<script setup lang="ts">
import DxButton from 'devextreme-vue/button';
import { ref } from 'vue';
import { sales } from '../data/tables.ts';
import AttendanceInformationSearch from "./components/feature/records/AttendanceInformationSearch.vue";
import CompetencyOwnerSearch from "./components/feature/records/CompetencyOwnerSearch.vue";
import ListOfCompetencyOwnerAttendanceRecords from "./components/feature/tables/ListOfCompetencyOwnerAttendanceRecords.vue";
import ListOfCompetencyOwners from "./components/feature/tables/ListOfCompetencyOwners.vue";

// State to control which view is shown
const showAttendanceView = ref(false);
const selectedOwner = ref({});  // Initialize as empty object instead of null
const filteredAttendanceData = ref([]);

// Function to handle viewing attendance details for an owner
const showAttendanceInfo = (owner) => {
  console.log("Selected owner for attendance view:", owner);

  // Create a new object to avoid any reactivity issues
  const ownerData = {
    was: owner.was,
    agencyDivision: owner.agencyDivision || '',
    number: owner.number || '',
    noWhenIntroduction: owner.noWhenIntroduction || '',
    position: owner.position || 0,
    grade: owner.grade || ''
  };

  // Set the owner data first before showing the attendance view
  selectedOwner.value = ownerData;
  console.log("Set selectedOwner.value to:", selectedOwner.value);

  // Filter attendance data by matching the 'was' field
  if (owner && owner.was) {
    filteredAttendanceData.value = sales.filter(item => item.was === owner.was);
    console.log(`Found ${filteredAttendanceData.value.length} attendance records with was=${owner.was}`);
  } else {
    console.warn("No 'was' property found in owner data:", owner);
    filteredAttendanceData.value = [];
  }

  // Show the attendance view after data is set
  setTimeout(() => {
    showAttendanceView.value = true;
  }, 0);
};
</script>
