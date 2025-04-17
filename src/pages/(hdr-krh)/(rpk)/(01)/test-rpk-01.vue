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
import { useOwnerStore } from '@/stores/Owner/ownerStore';
import DxButton from 'devextreme-vue/button';
import { ref, watch } from 'vue';
import AttendanceInformationSearch from "./components/feature/records/AttendanceInformationSearch.vue";
import CompetencyOwnerSearch from "./components/feature/records/CompetencyOwnerSearch.vue";
import ListOfCompetencyOwnerAttendanceRecords from "./components/feature/tables/ListOfCompetencyOwnerAttendanceRecords.vue";
import ListOfCompetencyOwners from "./components/feature/tables/ListOfCompetencyOwners.vue";

// State to control which view is shown
const showAttendanceView = ref(false);
const selectedOwner = ref({});  // Initialize as empty object instead of null
const filteredAttendanceData = ref([]);

// Add a watcher to debug state changes
watch(() => showAttendanceView.value, (newValue) => {
  console.log(`View changed to: ${newValue ? 'Attendance View' : 'Main View'}`);
  if (newValue) {
    console.log('Selected owner is:', JSON.stringify(selectedOwner.value));
    console.log('Filtered attendance data:', filteredAttendanceData.value.length, 'records');
  }
}, { immediate: true });

// Function to handle viewing attendance details for an owner
const showAttendanceInfo = (owner) => {
  console.log("Selected owner for attendance view:", owner);
  console.log("Owner data type:", typeof owner);
  console.log("Owner properties:", Object.keys(owner));

  if (!owner) {
    console.error("No owner data provided");
    return;
  }

  try {
    // Create a new object to avoid any reactivity issues
    const ownerData = {
      was: owner.was,
      agencyDivision: owner.agencyDivision || '',
      number: owner.number || '',
      noWhenIntroduction: owner.noWhenIntroduction || '',
      position: owner.position || 0,
      grade: owner.grade || ''
    };

    console.log("Created owner data object:", ownerData);
    console.log("WAS value:", ownerData.was, typeof ownerData.was);

    // Set the owner data first before showing the attendance view
    selectedOwner.value = ownerData;
    console.log("Set selectedOwner.value to:", selectedOwner.value);

    // Filter attendance data by matching the 'was' field
    if (owner && owner.was) {
      // Get the latest data from the store
      const ownerStore = useOwnerStore();
      // Access the store's data correctly - it's returning a ref/computed
      const allOwners = ownerStore.owners;
      console.log("All owners from store:", typeof allOwners, Array.isArray(allOwners));
      console.log("Store has", Array.isArray(allOwners) ? allOwners.length : (allOwners.value ? allOwners.value.length : 0), "records");

      // Ensure we're working with the array, not the ref
      filteredAttendanceData.value = Array.isArray(allOwners)
        ? allOwners.filter(item => item.was === owner.was)
        : (allOwners.value ? allOwners.value.filter(item => item.was === owner.was) : []);

      console.log(`Found ${filteredAttendanceData.value.length} attendance records with was=${owner.was}`);
      console.log("Filter condition:", `was === ${owner.was}`);

      if (filteredAttendanceData.value.length === 0) {
        console.log("No attendance records found, showing empty array");
        filteredAttendanceData.value = [];
      }
    } else {
      console.warn("No 'was' property found in owner data:", owner);
      filteredAttendanceData.value = [];
    }

    // Show the attendance view after data is set
    console.log("Setting showAttendanceView to true");
    showAttendanceView.value = true;
  } catch (error) {
    console.error("Error processing owner data:", error);
  }
};
</script>
