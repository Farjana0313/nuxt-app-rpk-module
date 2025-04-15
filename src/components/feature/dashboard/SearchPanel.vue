<template>
  <div class="bg-off-white rounded-lg shadow p-6 mb-6">
    <div class="grid grid-cols-1 gap-4">
      <!-- Search Fields -->
      <div class="relative">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="No. Rujukan"
          class="pl-10 pr-10 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">/</div>
      </div>

      <div class="relative">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Tajuk Permohonan"
          class="pl-10 pr-10 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">/</div>
      </div>

      <div>
        <label class="block text-sm text-gray-500 mb-1">Status Permohonan</label>
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              />
            </svg>
          </div>

          <select
            class="pl-10 pr-10 py-2 border border-gray-300 rounded-md w-full appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-400 transition-all duration-300 ease-in-out"
          >
            <option class="text-gray-500">SEMAKAN BPO</option>
            <option class="text-gray-500">DALAM PROSES</option>
            <option class="text-gray-500">SELESAI</option>
          </select>

          <div
            class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-2 mt-2">
        <button class="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-md">
          CARI
        </button>
        <button class="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-md">
          SET SEMULA
        </button>
        <button class="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-md">
          PERMOHONAN BAHARU
        </button>
      </div>
    </div>
  </div>
</template>
