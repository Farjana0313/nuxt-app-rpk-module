<template>
  <div class="w-64 bg-white">
    <div class="p-4 text-center font-bold">
      <h2 class="text-sm text-gray-500">AHMAD BIN ABU BAKAR</h2>
      <p class="text-sm text-gray-500">PENOLONG TEKNOLOGI</p>
      <p class="text-sm text-gray-500">MAKLUMAT</p>
      <p class="text-sm text-gray-500">(GRED F29)</p>
      <p class="text-sm text-blue-500 mt-2">{{ currentTime }}</p>
    </div>

    <!-- Menu -->
    <div class="py-2">
      <div class="px-4 py-2 text-sm text-gray-500">MENU</div>
      <PerfectScrollbar class="ps">
        <ul class="menu-list">
          <li v-for="(menu, index) in menuItems" :key="index" class="relative mx-2 rounded-md">
            <a
              href="#"
              class="flex items-center px-4 py-3 text-sm rounded-md"
              :class="{
                'bg-indigo-100 text-indigo-700': selectedMenu === menu.name,
                'text-gray-700 hover:bg-indigo-100': selectedMenu !== menu.name,
              }"
              @click.prevent="selectMenu(menu.name)"
            >
              <span class="mr-2" :class="{ 'text-indigo-600': selectedMenu === menu.name }">
                <span v-html="menu.icon"></span>
              </span>
              {{ menu.label }}
              <span v-if="menu.subMenu" class="ml-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </a>
            <div
              v-if="selectedMenu === menu.name"
              class="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 bg-indigo-500 rounded-l-md h-[50px]"
            />
            <ul v-if="menu.subMenu && selectedMenu === menu.name" class="ml-6">
              <li v-for="(subItem, subIndex) in menu.subMenu" :key="subIndex">
                <a href="#" class="block px-6 py-3 text-gray-700 hover:bg-indigo-100">
                  {{ subItem }}
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </PerfectScrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
const selectedMenu = ref<string | null>(null);

const menuItems = ref([
  {
    name: "utama",
    label: "Utama",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
             <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
           </svg>`,
    subMenu: null,
  },
  {
    name: "dashboard",
    label: "Dashboard",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
             <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 0 01-2-2v-2z"/>
           </svg>`,
    subMenu: null,
  },
  {
    name: "profil",
    label: "Profil Pembelajaran Dan Peperiksaan",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
             <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9zM3 8a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
           </svg>`,
    subMenu: ["Test 1", "Test 2"],
  },
  {
    name: "rekod",
    label: "Rekod dan Peperiksaan",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
             <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
           </svg>`,
    subMenu: ["Rekod 1", "Rekod 2"],
  },
]);

const currentTime = ref("");

function updateTime() {
  const now = new Date();
  currentTime.value = now.toLocaleString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

onMounted(() => {
  updateTime();
  setInterval(updateTime, 1000); // Update every second
});

function selectMenu(menu: string) {
  selectedMenu.value = selectedMenu.value === menu ? null : menu;
}
</script>

<style scoped></style>
