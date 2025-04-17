<template>
  <div class="my-12 bg-white border border-gray-200 p-6 w-full mt-6 shadow-lg rounded-lg">
    <h2 class="text-2xl font-bold text-gray-800">List of Competency Owners</h2>
    <DxDataGrid ref="dataGridRef" id="ownerDataGrid" :data-source="owners" :show-borders="true" :key-expr="'was'">

      <DxExport :enabled="true" :allow-export-selected-data="true" />

      <DxToolbar>
        <DxItem name="searchPanel" />
        <DxItem location="after" widget="dxButton" :options="{
          icon: 'export',
          onClick: handleExport,
        }" />
        <DxItem location="after" widget="dxButton" :options="{
          icon: 'print',
          onClick: handlePrint,
        }" />
      </DxToolbar>

      <DxColumn :width="90" data-field="was" caption="Was" />
      <DxColumn data-field="agencyDivision" caption="Agency/ Division" />
      <DxColumn :width="180" data-field="number" caption="Number" />
      <DxColumn data-field="noWhenIntroduction" caption="No. When Introduction" />
      <DxColumn data-field="position" caption="Position" :width="90" />
      <DxColumn :width="90" data-field="grade" caption="Grade" />
      <DxColumn :width="90" data-field="action" caption="Action" cellTemplate="actionTemplate" />
      <DxHeaderFilter :visible="true" />
      <DxSearchPanel :visible="true" :width="240" />
      <DxPaging :page-size="10" />
      <DxPager :show-page-size-selector="true" :allowed-page-sizes="[10, 20, 50]" :show-info="true" />
      <DxSelection mode="multiple" show-check-boxes-mode="always" />

      <template #actionTemplate="cellData">
        <div class="flex gap-2">
          <button class="text-blue-500 hover:text-blue-700" @click="() => handleViewClick(cellData)">View</button>
        </div>
      </template>
    </DxDataGrid>
  </div>
</template>

<script setup lang="ts">
import { useOwnerStore } from '@/stores/Owner/ownerStore';
import {
  DxColumn,
  DxDataGrid,
  DxExport,
  DxHeaderFilter,
  DxItem,
  DxPager,
  DxPaging,
  DxSearchPanel,
  DxSelection,
  DxToolbar,
  type DxDataGridTypes
} from 'devextreme-vue/data-grid';
import themes from 'devextreme/ui/themes';
import { computed, onMounted, ref } from 'vue';

// Use the store to get competency owners data
const ownerStore = useOwnerStore();
const owners = computed(() => ownerStore.owners);

// Define emits for the component
const emit = defineEmits(['view-attendance']);

// Function to handle view button click
const handleViewClick = (cellData) => {
  console.log("Raw data from DataGrid:", cellData);

  // In DevExtreme DataGrid, the data structure can vary
  let owner = null;

  // From the error message, we can see cellData has data.data structure
  if (cellData && cellData.data && cellData.data.was) {
    // Direct access to the data property
    owner = cellData.data;
  } else if (cellData && cellData.row && cellData.row.data) {
    // Access through the row property
    owner = cellData.row.data;
  } else if (cellData && cellData.data && cellData.data.data) {
    // Nested data structure
    owner = cellData.data.data;
  } else {
    console.error("Could not extract owner data from grid event", cellData);
    return;
  }

  console.log("Extracted owner data:", owner);

  // Make sure we have the required data - specifically was
  if (!owner || typeof owner.was === 'undefined') {
    console.error("Invalid owner data - missing was property", owner);
    return;
  }

  // Create a clean object with just the properties we need
  const cleanOwner = {
    was: owner.was,
    agencyDivision: owner.agencyDivision || 'Unknown Division',
    number: owner.number || 'Unknown Number',
    noWhenIntroduction: owner.noWhenIntroduction || 'Unknown ID',
    position: owner.position || 0,
    grade: owner.grade || 'Unknown Grade'
  };

  console.log("Clean owner data to emit:", cleanOwner);

  // Emit event to parent component with the clean owner data
  emit('view-attendance', cleanOwner);
};

const dataGridRef = ref(null);
const selectAllModes: DxDataGridTypes.SelectAllMode[] = ['allPages', 'page'];
const showCheckBoxesModes: DxDataGridTypes.SelectionColumnDisplayMode[] = ['none', 'onClick', 'onLongTap', 'always'];
const allMode = ref(selectAllModes[0]);
const checkBoxesMode = ref<DxDataGridTypes.SelectionColumnDisplayMode>(themes.current().startsWith('material') ? 'always' : 'onClick');

const handleExport = () => {
  console.log('Export button clicked');
  console.log('dataGridRef:', dataGridRef.value);

  try {
    if (dataGridRef.value && dataGridRef.value.instance) {
      console.log('dataGridRef.value.instance exists');
      ownerStore.exportToExcel(dataGridRef.value.instance, owners.value, {
        title: 'Competency Owners',
        filename: 'CompetencyOwners.xlsx',
        excludeColumns: ['action']
      });
    } else {
      console.error('DataGrid instance is not available, using direct data export');
      // Create a minimal mock grid instance with the required methods
      const mockGridInstance = {
        getVisibleColumns: () => [
          { dataField: 'was', caption: 'Was' },
          { dataField: 'agencyDivision', caption: 'Agency/ Division' },
          { dataField: 'number', caption: 'Number' },
          { dataField: 'noWhenIntroduction', caption: 'No. When Introduction' },
          { dataField: 'position', caption: 'Position' },
          { dataField: 'grade', caption: 'Grade' }
        ],
        getSelectedRowsData: () => [], // No selection
        getDataSource: () => ({ items: () => owners.value })
      };

      ownerStore.exportToExcel(mockGridInstance, owners.value, {
        title: 'Competency Owners',
        filename: 'CompetencyOwners.xlsx',
        excludeColumns: ['action']
      });
    }
  } catch (error) {
    console.error('Error during export:', error);
    alert(`Export error: ${error.message}`);
  }
};

const handlePrint = () => {
  console.log('Print button clicked');
  console.log('dataGridRef:', dataGridRef.value);

  try {
    if (dataGridRef.value && dataGridRef.value.instance) {
      console.log('dataGridRef.value.instance exists');
      ownerStore.printGrid(dataGridRef.value.instance, owners.value, {
        title: 'Competency Owners List',
        excludeColumns: ['action']
      });
    } else {
      console.error('DataGrid instance is not available, using direct data print');
      // Create a minimal mock grid instance with the required methods
      const mockGridInstance = {
        getVisibleColumns: () => [
          { dataField: 'was', caption: 'Was' },
          { dataField: 'agencyDivision', caption: 'Agency/ Division' },
          { dataField: 'number', caption: 'Number' },
          { dataField: 'noWhenIntroduction', caption: 'No. When Introduction' },
          { dataField: 'position', caption: 'Position' },
          { dataField: 'grade', caption: 'Grade' }
        ],
        getSelectedRowsData: () => [], // No selection
        getDataSource: () => ({ items: () => owners.value })
      };

      ownerStore.printGrid(mockGridInstance, owners.value, {
        title: 'Competency Owners List',
        excludeColumns: ['action']
      });
    }
  } catch (error) {
    console.error('Error during print:', error);
    alert(`Print error: ${error.message}`);
  }
};

onMounted(() => {
  // Verify the grid is properly mounted and accessible
  console.log('Component mounted');
  console.log('DataGrid available:', !!dataGridRef.value);
  setTimeout(() => {
    // Check after a short delay to ensure the instance is ready
    if (dataGridRef.value) {
      console.log('DataGrid instance available:', !!dataGridRef.value.instance);
    }
  }, 100);
});
</script>

<style scoped>
.options {
  margin-top: 20px;
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
  position: relative;
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option {
  margin-top: 10px;
}

.checkboxes-mode {
  position: absolute;
  right: 20px;
  bottom: 20px;
}

.option>.dx-selectbox {
  width: 150px;
  display: inline-block;
  vertical-align: middle;
}

.option>span {
  margin-right: 10px;
}
</style>