<template>
  <div>
    <div class="flex h-screen">
      <!-- Sidebar -->
      <Sidebar />
      <!-- Sidebar End -->

      <!-- Main Content -->
      <div class="flex-1 flex flex-col">
        <!-- Top Navigation -->
        <AppHeader />
        <!-- Top Navigation End -->

        <!-- Main Content Area -->
        <main class="flex-1 overflow-y-auto p-4 bg-blue-50">
          <slot />
        </main>
        <!-- Main Content Area End -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from "@/components/layout/AppHeader.vue";
import Sidebar from "@/components/layout/Sidebar.vue";
</script>

<style scoped></style>
