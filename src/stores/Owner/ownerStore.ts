import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { sales } from '../../pages/(hdr-krh)/(rpk)/data/tables';
import type { CompetencyOwner, CompetencyOwnerFilter, GridUtilsConfig } from './types/types';

export const useOwnerStore = defineStore('owner', () => {
  const allOwners = ref<CompetencyOwner[]>(sales);
  const filteredOwners = ref<CompetencyOwner[]>(sales);
  const filters = ref<CompetencyOwnerFilter>({
    number: '',
    identityCardNo: ''
  });

  // Computed property to get all owners
  const owners = computed(() => filteredOwners.value);

  // Filter owners based on search criteria
  const filterOwners = (number: string, identityCardNo: string) => {
    filters.value = {
      number: number.trim(),
      identityCardNo: identityCardNo.trim()
    };

    if (!number && !identityCardNo) {
      filteredOwners.value = allOwners.value;
      return;
    }

    filteredOwners.value = allOwners.value.filter(owner => {
      const matchesNumber = !filters.value.number || 
                          owner.number.toLowerCase().includes(filters.value.number.toLowerCase());
      
      // Since we don't have identityCardNo in our model, we're matching against the noWhenIntroduction field for demo
      const matchesIdentity = !filters.value.identityCardNo || 
                           owner.noWhenIntroduction.toLowerCase().includes(filters.value.identityCardNo.toLowerCase());
      
      return matchesNumber && matchesIdentity;
    });
  };

  // Reset filters
  const resetFilters = () => {
    filters.value = {
      number: '',
      identityCardNo: ''
    };
    filteredOwners.value = allOwners.value;
  };

  // Format date function for printing
  const formatDateToString = (date: string) => {
    return date;
  };

  /**
   * Debug a DataGrid instance to help diagnose issues
   */
  const debugDataGrid = (gridInstance: any) => {
    console.log("--- DataGrid Debug Info ---");
    if (!gridInstance) {
      console.error("Grid instance is null or undefined");
      return "Grid instance is null or undefined";
    }

    try {
      // Check key instance properties and methods
      const hasGetVisibleColumns = typeof gridInstance.getVisibleColumns === 'function';
      const hasGetSelectedRowsData = typeof gridInstance.getSelectedRowsData === 'function';
      const hasExportToExcel = typeof gridInstance.exportToExcel === 'function';
      const hasPrint = typeof gridInstance.print === 'function';

      console.log("DataGrid instance methods available:", {
        getVisibleColumns: hasGetVisibleColumns,
        getSelectedRowsData: hasGetSelectedRowsData, 
        exportToExcel: hasExportToExcel,
        print: hasPrint
      });

      // Try to get columns
      if (hasGetVisibleColumns) {
        const columns = gridInstance.getVisibleColumns();
        console.log(`Visible columns: ${columns.length}`, 
          columns.map((col: any) => ({ 
            dataField: col.dataField, 
            caption: col.caption,
            visible: col.visible
          }))
        );
      }

      // Try to get data source info
      if (gridInstance.option) {
        const dataSource = gridInstance.option('dataSource');
        console.log('DataSource type:', typeof dataSource);
        console.log('DataSource is array:', Array.isArray(dataSource));
        if (Array.isArray(dataSource)) {
          console.log('DataSource length:', dataSource.length);
          if (dataSource.length > 0) {
            console.log('First item keys:', Object.keys(dataSource[0]));
          }
        }
      }

      return "Debug info logged to console";
    } catch (error) {
      console.error("Error debugging DataGrid:", error);
      return `Error debugging DataGrid: ${error.message}`;
    }
  };

  /**
   * Extract data and columns from a DataGrid instance
   */
  const extractGridData = (gridInstance: any, data: any[] = [], excludeColumns: string[] = ['action']) => {
    // Get visible columns
    const visibleColumns = gridInstance.getVisibleColumns()
      .filter((col: any) => col.dataField && !excludeColumns.includes(col.dataField));
    
    // Get data, prioritizing selected rows, then provided data, then all owners
    let dataToExport = [];
    const selectedRowsData = gridInstance.getSelectedRowsData();
    
    if (selectedRowsData.length > 0) {
      dataToExport = selectedRowsData;
    } else if (data.length > 0) {
      dataToExport = [...data];
    } else {
      // Fallback to getting data from the dataSource option
      try {
        const gridData = gridInstance.getDataSource().items();
        if (Array.isArray(gridData) && gridData.length > 0) {
          dataToExport = gridData;
        } else {
          dataToExport = [...allOwners.value];
        }
      } catch (e) {
        dataToExport = [...allOwners.value];
      }
    }

    return {
      columns: visibleColumns,
      headerRow: visibleColumns.map((col: any) => col.caption || col.dataField),
      data: dataToExport
    };
  };

  /**
   * Global function to print grid data
   * @param gridInstance The DataGrid instance
   * @param data The data to print (if not using selected rows)
   * @param config Configuration options for printing
   */
  const printGrid = (gridInstance: any, data: any[] = [], config: GridUtilsConfig = {}) => {
    console.log("printGrid called", { gridInstance: !!gridInstance, dataLength: data?.length });
    
    if (!gridInstance) {
      console.error("Grid instance is null or undefined");
      alert("Print failed: DataGrid instance is not available");
      return;
    }

    // Debug the grid instance
    debugDataGrid(gridInstance);

    try {
      const title = config.title || 'Data List';
      const excludeColumns = config.excludeColumns || ['action'];
      const styles = config.tableStyles || {
        headerBackground: '#f2f2f2',
        headerColor: '#000',
        bodyColor: '#333',
        fontFamily: 'Arial, sans-serif'
      };

      // Extract data and columns from the grid
      const { columns: visibleColumns, headerRow, data: dataToExport } = 
        extractGridData(gridInstance, data, excludeColumns);
      
      console.log("Data extracted for print:", {
        columns: visibleColumns.length,
        data: dataToExport.length
      });

      // Create a table for printing
      console.log("Opening print window");
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${title}</title>
              <style>
                body { font-family: ${styles.fontFamily}; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: ${styles.headerBackground}; color: ${styles.headerColor}; }
                td { color: ${styles.bodyColor}; }
                h2 { color: #333; }
              </style>
            </head>
            <body>
              <h2>${title}</h2>
              <table>
                <thead>
                  <tr>
                    ${headerRow.map(header => `<th>${header}</th>`).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${dataToExport.map(row => `
                    <tr>
                      ${visibleColumns.map((col: any) => {
                        const dataField = col.dataField;
                        return dataField ? `<td>${row[dataField] !== undefined ? row[dataField] : ''}</td>` : '';
                      }).join('')}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </body>
          </html>
        `);
        printWindow.document.close();
        console.log("Print window ready, triggering print");
        setTimeout(() => {
          printWindow.print();
        }, 500);
      } else {
        console.error("Failed to open print window. Make sure pop-ups are allowed.");
        alert("Failed to open print window. Make sure pop-ups are allowed.");
      }
    } catch (error) {
      console.error("Error in printGrid:", error);
      alert(`Failed to print: ${error.message}`);
    }
  };

  /**
   * Global function to export grid data to Excel
   * @param gridInstance The DataGrid instance 
   * @param data The data to export (if not using selected rows)
   * @param config Configuration options for exporting
   */
  const exportToExcel = async (gridInstance: any, data: any[] = [], config: GridUtilsConfig = {}) => {
    console.log("exportToExcel called", { gridInstance: !!gridInstance, dataLength: data?.length });
    
    if (!gridInstance) {
      console.error("Grid instance is null or undefined");
      alert("Export failed: DataGrid instance is not available");
      return;
    }

    // Debug the grid instance
    debugDataGrid(gridInstance);

    try {
      console.log("Setting up export parameters");
      const title = config.title || 'Data List';
      const filename = config.filename || 'Export.xlsx';
      const excludeColumns = config.excludeColumns || ['action'];

      console.log("Creating Excel workbook");
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(title);

      // Extract data and columns from the grid
      const { columns: visibleColumns, headerRow, data: dataToExport } = 
        extractGridData(gridInstance, data, excludeColumns);
      
      console.log("Data extracted for Excel:", {
        columns: visibleColumns.length,
        data: dataToExport.length
      });

      // Add header row
      worksheet.addRow(headerRow);

      // If no data, show alert and return
      if (dataToExport.length === 0) {
        alert("No data to export");
        return;
      }

      // Step 3: Add rows to worksheet
      console.log("Adding rows to worksheet");
      dataToExport.forEach((row, index) => {
        try {
          const dataRow = visibleColumns.map((col: any) => {
            const dataField = col.dataField;
            return dataField && row[dataField] !== undefined ? row[dataField] : '';
          });
          worksheet.addRow(dataRow);
        } catch (rowError) {
          console.error(`Error processing row ${index}:`, rowError, row);
        }
      });

      // Step 4: Style headers and adjust column widths
      console.log("Styling worksheet");
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6E6E6' }
      };

      visibleColumns.forEach((col: any, index: number) => {
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
      console.log("Writing Excel buffer");
      const buffer = await workbook.xlsx.writeBuffer();
      console.log("Creating Blob");
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      console.log("Saving file");
      saveAs(blob, filename);
      console.log("Excel export complete");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert(`Failed to export to Excel: ${error.message}. Please check the console for more details.`);
    }
  };

  return {
    owners,
    filters,
    filterOwners,
    resetFilters,
    formatDateToString,
    printGrid,
    exportToExcel,
    debugDataGrid
  };
});
