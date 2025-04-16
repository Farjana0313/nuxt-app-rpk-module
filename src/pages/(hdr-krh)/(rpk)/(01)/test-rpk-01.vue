<template>
  <div class="container">
    <!-- <h1>Test 02</h1> -->
    <!--- Results Table End -->
    <!-- Owner Search -->
    <CompetencyOwnerSearch />
    <!-- Owner Search End-->
    <!-- List of Competency Owners -->
    <ListOfCompetencyOwners />
    <!-- List of Competency Owners End -->
  </div>
</template>
<script setup lang="ts">
import CompetencyOwnerSearch from "./components/feature/records/CompetencyOwnerSearch.vue";
import ListOfCompetencyOwners from "./components/feature/tables/ListOfCompetencyOwners.vue";

</script>
