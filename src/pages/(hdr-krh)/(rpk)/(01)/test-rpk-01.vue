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
import AttendanceInformationSearch from "./components/feature/records/AttendanceInformationSearch.vue";
import CompetencyOwnerSearch from "./components/feature/records/CompetencyOwnerSearch.vue";
import ListOfCompetencyOwnerAttendanceRecords from "./components/feature/tables/ListOfCompetencyOwnerAttendanceRecords.vue";
import ListOfCompetencyOwners from "./components/feature/tables/ListOfCompetencyOwners.vue";

// State to control which view is shown
const showAttendanceView = ref(false);
const selectedOwner = ref(null);
const filteredAttendanceData = ref([]);

// Function to handle viewing attendance details for an owner
const showAttendanceInfo = (owner, filteredData) => {
  selectedOwner.value = owner;
  filteredAttendanceData.value = filteredData;
  showAttendanceView.value = true;
};
</script>
