<template>
  <!-- Page Header -->
  <PageHeader />
  <!-- Page Header End -->

  <!-- Search Panel -->
  <!-- <SearchPanel /> -->
  <!-- Search Panel End -->

  <!-- Results Table -->
  <!-- <Results /> -->
  <!--- Results Table End -->
  <!-- Owner Search -->
  <CompetencyOwnerSearch />
  <!-- Owner Search End-->
  <!-- List of Competency Owners -->
  <ListOfCompetencyOwners />
  <!-- List of Competency Owners End -->
  <!-- Attendance Records Table -->
  <AttendanceInformationSearch/>
  <!-- Attendance Records Table End -->
  <SearchThroughAdHocIntegration />
</template>

<script setup lang="ts">
import PageHeader from "@/components/common/PageHeader.vue";
import SearchPanel from "@/components/feature/dashboard/SearchPanel.vue";
import Results from "@/components/feature/dashboard/Results.vue";
import CompetencyOwnerSearch from "./(hdr-krh)/(rpk)/(01)/components/feature/records/CompetencyOwnerSearch.vue";
import ListOfCompetencyOwners from "./(hdr-krh)/(rpk)/(01)/components/feature/tables/ListOfCompetencyOwners.vue";
import AttendanceInformationSearch from "./(hdr-krh)/(rpk)/(01)/components/feature/records/AttendanceInformationSearch.vue";
import SearchThroughAdHocIntegration from "./(hdr-krh)/(rpk)/(01)/components/feature/records/SearchThroughAdHocIntegration.vue";
</script>
