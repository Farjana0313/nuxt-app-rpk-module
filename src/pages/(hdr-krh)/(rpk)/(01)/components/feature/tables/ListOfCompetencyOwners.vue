<template>
  <div class="my-12">
    <DxDataGrid ref="dataGridRef" id="ownerDataGrid" :data-source="owners" :show-borders="true" :key-expr="'was'">

      <DxExport :enabled="true" :allow-export-selected-data="true" />

      <DxToolbar>
        <DxItem name="searchPanel" />
        <DxItem location="after" widget="dxButton" :options="{
          icon: 'export',
          onClick: onExportToExcel,
        }" />
        <DxItem location="after" widget="dxButton" :options="{
          icon: 'print',
          onClick: onPrintGrid,
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

      <template #actionTemplate="{ data }">
        <div class="flex gap-2">
          <button class="text-blue-500 hover:text-blue-700">View</button>
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
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { computed, ref } from 'vue';

// Use the store to get competency owners data
const ownerStore = useOwnerStore();
const owners = computed(() => ownerStore.owners);

const dataGridRef = ref(null);
const selectAllModes: DxDataGridTypes.SelectAllMode[] = ['allPages', 'page'];
const showCheckBoxesModes: DxDataGridTypes.SelectionColumnDisplayMode[] = ['none', 'onClick', 'onLongTap', 'always'];
const allMode = ref(selectAllModes[0]);
const checkBoxesMode = ref<DxDataGridTypes.SelectionColumnDisplayMode>(themes.current().startsWith('material') ? 'always' : 'onClick');

// Print Grid
const onPrintGrid = () => {
  const gridInstance = dataGridRef.value?.instance;
  if (!gridInstance) return;

  // Get the data from the grid
  const visibleColumns = gridInstance.getVisibleColumns()
    .filter(col => col.dataField && col.dataField !== 'action'); // Filter out action column
  const headerRow = visibleColumns.map(col => col.caption || col.dataField);

  // Get selected rows or all rows
  let dataToExport = [];
  const selectedRowsData = gridInstance.getSelectedRowsData();
  if (selectedRowsData.length > 0) {
    dataToExport = selectedRowsData;
  } else {
    dataToExport = [...owners.value];
  }

  // Create a table for printing
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(`
            <html>
                <head>
                    <title>Competency Owners List</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        h2 { color: #333; }
                    </style>
                </head>
                <body>
                    <h2>Competency Owners List</h2>
                    <table>
                        <thead>
                            <tr>
                                ${headerRow.map(header => `<th>${header}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${dataToExport.map(row => `
                                <tr>
                                    ${visibleColumns.map(col => {
      const dataField = col.dataField;
      return dataField ? `<td>${row[dataField]}</td>` : '';
    }).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
};

// Export To Excel
const onExportToExcel = async () => {
  const gridInstance = dataGridRef.value?.instance;
  if (!gridInstance) return;

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Competency Owners");

    // Step 1: Extract visible columns
    const visibleColumns = gridInstance.getVisibleColumns()
      .filter(col => col.dataField && col.dataField !== 'action'); // Filter out action column

    const headerRow = visibleColumns.map(col => col.caption || col.dataField);
    worksheet.addRow(headerRow);

    // Step 2: Get data (either selected rows or all rows)
    let dataToExport = [];
    const selectedRowsData = gridInstance.getSelectedRowsData();

    if (selectedRowsData.length > 0) {
      dataToExport = selectedRowsData;
    } else {
      // If no rows are selected, export all data
      dataToExport = [...owners.value];
    }

    // Step 3: Add rows to worksheet
    dataToExport.forEach(row => {
      const dataRow = visibleColumns.map(col => {
        const dataField = col.dataField;
        return dataField ? row[dataField] : '';
      });
      worksheet.addRow(dataRow);
    });

    // Step 4: Style headers and adjust column widths
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6E6E6' }
    };

    visibleColumns.forEach((col, index) => {
      // Add 1 because Excel columns are 1-indexed
      const column = worksheet.getColumn(index + 1);
      column.width = col.width ? col.width / 7 : 15; // Approximate conversion from px to Excel column width
    });

    // Step 5: Create table
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: dataToExport.length + 1, column: visibleColumns.length }
    };

    // Step 6: Download Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "CompetencyOwners.xlsx");
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    alert("Failed to export to Excel. Please try again.");
  }
};
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