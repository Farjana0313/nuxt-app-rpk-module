<template>
  <header class="bg-white border-gray-200 p-9 flex justify-end">
    <div class="flex items-center space-x-3">
      <div
        class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 overflow-hidden"
      >
        <img src="/icons/profile.png" alt="Icon" class="w-10 h-10 object-contain" />
      </div>

      <div
        class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          aria-hidden="true"
          role="img"
          tag="i"
          class="v-icon notranslate v-theme--light v-icon--size-default iconify iconify--bx"
          width="2em"
          height="2em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 6.223l-8-6.222V6h16zM4 18V9.044l7.386 5.745a.994.994 0 0 0 1.228 0L20 9.044L20.002 18H4z"
          ></path>
        </svg>
      </div>

      <div
        class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          aria-hidden="true"
          role="img"
          tag="i"
          class="v-icon notranslate v-theme--light v-icon--size-default iconify iconify--bx"
          width="2em"
          height="2em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M21.928 11.607c-.202-.488-.635-.605-.928-.633V8c0-1.103-.897-2-2-2h-6V4.61c.305-.274.5-.668.5-1.11a1.5 1.5 0 0 0-3 0c0 .442.195.836.5 1.11V6H5c-1.103 0-2 .897-2 2v2.997l-.082.006A1 1 0 0 0 1.99 12v2a1 1 0 0 0 1 1H3v5c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-5a1 1 0 0 0 1-1v-1.938a1.006 1.006 0 0 0-.072-.455zM5 20V8h14l.001 3.996L19 12v2l.001.005l.001 5.995H5z"
          ></path>
          <ellipse cx="8.5" cy="12" fill="currentColor" rx="1.5" ry="2"></ellipse>
          <ellipse cx="15.5" cy="12" fill="currentColor" rx="1.5" ry="2"></ellipse>
          <path fill="currentColor" d="M8 16h8v2H8z"></path>
        </svg>
      </div>

      <div
        class="flex items-center justify-center text-blue-600 font-bold relative cursor-pointer"
        @click="togglePopover"
      >
        <div class="flex items-center justify-center relative">
          <div
            class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              aria-hidden="true"
              role="img"
              tag="i"
              class="v-icon notranslate v-theme--light v-icon--size-default iconify iconify--bx"
              width="2em"
              height="2em"
              viewBox="0 0 24 24"
            >
              <path
                d="M4 11h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zm0 10h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zm10 0h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zm7.293-14.707l-3.586-3.586a.999.999 0 0 0-1.414 0l-3.586 3.586a.999.999 0 0 0 0 1.414l3.586 3.586a.999.999 0 0 0 1.414 0l3.586-3.586a.999.999 0 0 0 0-1.414z"
                fill="currentColor"
              />
            </svg>
          </div>
          <img src="/icons/hrm-icon.png" alt="HRMIS" class="w-full h-full object-cover" />
        </div>
        <transition name="zoom">
          <div
            v-if="isPopoverOpen"
            class="absolute top-12 right-0 bg-[#ffffff] shadow-lg p-4 w-[400px] h-[500px] overflow-y-auto z-40 rounded-md"
          >
            <div class="grid grid-cols-4 gap-4">
              <div
                v-for="(item, index) in popoverItems"
                :key="index"
                class="flex flex-col items-center cursor-pointer"
                :class="{ 'bg-blue-100': focusedItem === index }"
                @click="focusedItem = index"
              >
                <div
                  class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden"
                >
                  <img :src="item.icon" alt="icon" class="w-full h-full object-cover" />
                </div>
                <p class="text-xs text-center mt-2 font-normal text-gray-500">
                  {{ item.text }}
                </p>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isPopoverOpen = ref(false);
const focusedItem = ref<number | null>(null);
const popoverItems = ref([
  { icon: "/icons/topbar/1.png", text: "Penetapan Data Organisasi1" },
  { icon: "/icons/topbar/2.png", text: "Penetapan Data Pegawai" },
  { icon: "/icons/topbar/3.png", text: "Pentadbiran Tatatertib" },
  { icon: "/icons/topbar/4.png", text: "Pengurusan Kehadiran" },
  { icon: "/icons/topbar/5.png", text: "Pengurusan Gaji" },
  { icon: "/icons/topbar/6.png", text: "Pentadbiran Sistem" },
  { icon: "/icons/topbar/7.png", text: "Onboarding" },
  { icon: "/icons/topbar/8.png", text: "Profil Pegawai" },
  { icon: "/icons/topbar/9.png", text: "Pemangkuan Dan Kenaikan Pangkat" },
  { icon: "/icons/topbar/10.png", text: "Mobiliti" },
  { icon: "/icons/topbar/11.png", text: "Pengurusan Prestasi" },
  { icon: "/icons/topbar/12.png", text: "Pementoran dan Bimbingan" },
  { icon: "/icons/topbar/13.png", text: "Ganjaran" },
  { icon: "/icons/topbar/14.png", text: "Pengurusan Penggantian" },
  { icon: "/icons/topbar/15.png", text: "Pembangunan Kerjaya" },
  { icon: "/icons/topbar/16.png", text: "Pengurusan Rekod Pembelajaran" },
  { icon: "/icons/topbar/17.png", text: "Analisis Keperluan Latihan" },
  { icon: "/icons/topbar/18.png", text: "Psikologi" },
  { icon: "/icons/topbar/19.png", text: "Kaunseling" },
  { icon: "/icons/topbar/20.png", text: "Kemudahan" },
  { icon: "/icons/topbar/21.png", text: "Tuntutan" },
  { icon: "/icons/topbar/22.png", text: "Cuti" },
  { icon: "/icons/topbar/23.png", text: "Persaraan" },
  { icon: "/icons/topbar/24.png", text: "Perletakan Jawatan" },
  { icon: "/icons/topbar/25.png", text: "Tajaan" },
  { icon: "/icons/topbar/26.png", text: "Portal Pengambilan" },
  { icon: "/icons/topbar/27.png", text: "Pengambilan dan Pemilihan" },
  { icon: "/icons/topbar/28.png", text: "Majlis Bersama Jabatan" },
  { icon: "/icons/topbar/29.png", text: "Portal HRM" },
  { icon: "/icons/topbar/30.png", text: "Maklmat Umum Sumber Manusia" },
  { icon: "/icons/topbar/31.png", text: "Kendiri" },
  { icon: "/icons/topbar/32.png", text: "Dashboard dan Analitik" },
  { icon: "/icons/topbar/33.png", text: "Sistem Share Online" },
  { icon: "/icons/topbar/34.png", text: "Aplikasi Mudah Alih" },
]);

function togglePopover() {
  if (isPopoverOpen.value) {
    isPopoverOpen.value = false;
  } else {
    setTimeout(() => {
      isPopoverOpen.value = true;
    }, 10); // Delay to ensure transition is applied
  }
}
</script>

<style scoped>
@import "vue3-perfect-scrollbar/style.css";

.ps {
  max-height: 80vh; /* or height: 100px; */
}

.zoom-enter-active,
.zoom-leave-active {
  transition: transform 0.3s ease;
}
.zoom-enter {
  transform: scale(0.9); /* Ensure this is applied for zoom-in */
}
.zoom-enter-to {
  transform: scale(1); /* Transition to the default scale */
}
.zoom-leave-to {
  transform: scale(0.9); /* Zoom out effect */
}
</style>
