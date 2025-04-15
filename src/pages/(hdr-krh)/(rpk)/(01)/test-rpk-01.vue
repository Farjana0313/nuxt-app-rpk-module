<template>
  <div class="container">
    <!-- <h1>Test 02</h1> -->
     <!--- Results Table End -->
  <!-- Owner Search -->
  <CompetencyOwnerSearch/>
  <!-- Owner Search End-->
  <!-- List of Competency Owners -->
  <ListOfCompetencyOwners />
  <!-- List of Competency Owners End -->
  <!-- Attendance Records Table -->
  <AttendanceInformationSearch/>
  <!-- Attendance Records Table End -->
  <SearchThroughAdHocIntegration />
  </div>
</template>
<script setup lang="ts">
import ListOfCompetencyOwners from "./components/feature/tables/ListOfCompetencyOwners.vue";
import AttendanceInformationSearch from "./components/feature/records/AttendanceInformationSearch.vue";
import SearchThroughAdHocIntegration from "./components/feature/records/SearchThroughAdHocIntegration.vue";
import CompetencyOwnerSearch from "./components/feature/records/CompetencyOwnerSearch.vue";
</script>
