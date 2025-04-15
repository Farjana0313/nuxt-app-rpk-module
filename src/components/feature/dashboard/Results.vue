<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
      <thead>
        <tr class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          <th class="px-6 py-3 bg-gray-50">BIL</th>
          <th class="px-6 py-3 bg-gray-50">NO. RUJUKAN</th>
          <th class="px-6 py-3 bg-gray-50">TAJUK PERMOHONAN</th>
          <th class="px-6 py-3 bg-gray-50">TARIKH PERMOHONAN</th>
          <th class="px-6 py-3 bg-gray-50">STATUS</th>
          <th class="px-6 py-3 bg-gray-50">TINDAKAN</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr>
          <td class="px-6 py-4 whitespace-nowrap">1</td>
          <td class="px-6 py-4 whitespace-nowrap">RUJ-001</td>
          <td class="px-6 py-4 whitespace-nowrap">Permohonan Lesen Perniagaan</td>
          <td class="px-6 py-4 whitespace-nowrap">2025-04-01</td>
          <td class="px-6 py-4 whitespace-nowrap text-green-600">Diluluskan</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <button class="text-indigo-600 hover:text-indigo-900">Lihat</button>
          </td>
        </tr>
        <tr>
          <td class="px-6 py-4 whitespace-nowrap">2</td>
          <td class="px-6 py-4 whitespace-nowrap">RUJ-002</td>
          <td class="px-6 py-4 whitespace-nowrap">Permohonan Bantuan Kewangan</td>
          <td class="px-6 py-4 whitespace-nowrap">2025-04-03</td>
          <td class="px-6 py-4 whitespace-nowrap text-yellow-600">Dalam Proses</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <button class="text-indigo-600 hover:text-indigo-900">Lihat</button>
          </td>
        </tr>
        <tr>
          <td class="px-6 py-4 whitespace-nowrap">3</td>
          <td class="px-6 py-4 whitespace-nowrap">RUJ-003</td>
          <td class="px-6 py-4 whitespace-nowrap">Permohonan Pindaan Lesen</td>
          <td class="px-6 py-4 whitespace-nowrap">2025-04-05</td>
          <td class="px-6 py-4 whitespace-nowrap text-red-600">Ditolak</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <button class="text-indigo-600 hover:text-indigo-900">Lihat</button>
          </td>
        </tr>
        <tr>
          <td class="px-6 py-4 whitespace-nowrap">4</td>
          <td class="px-6 py-4 whitespace-nowrap">RUJ-004</td>
          <td class="px-6 py-4 whitespace-nowrap">Permohonan Program Latihan</td>
          <td class="px-6 py-4 whitespace-nowrap">2025-04-07</td>
          <td class="px-6 py-4 whitespace-nowrap text-green-600">Diluluskan</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <button class="text-indigo-600 hover:text-indigo-900">Lihat</button>
          </td>
        </tr>
        <tr>
          <td class="px-6 py-4 whitespace-nowrap">5</td>
          <td class="px-6 py-4 whitespace-nowrap">RUJ-005</td>
          <td class="px-6 py-4 whitespace-nowrap">Permohonan Insentif Digital</td>
          <td class="px-6 py-4 whitespace-nowrap">2025-04-10</td>
          <td class="px-6 py-4 whitespace-nowrap text-yellow-600">Dalam Proses</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <button class="text-indigo-600 hover:text-indigo-900">Lihat</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
