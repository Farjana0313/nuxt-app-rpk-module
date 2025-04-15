<template>
  <!-- Page Header -->
  <PageHeader />
  <!-- Page Header End -->

  <!-- Search Panel -->
  <SearchPanel />
  <!-- Search Panel End -->

  <!-- Results Table -->
  <Results />
  <!--- Results Table End -->
</template>

<script setup lang="ts">
import PageHeader from "@/components/common/PageHeader.vue";
import SearchPanel from "@/components/feature/dashboard/SearchPanel.vue";
import Results from "@/components/feature/dashboard/Results.vue";
</script>
