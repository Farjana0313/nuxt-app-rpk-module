import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { sales } from '../../pages/(hdr-krh)/(rpk)/data/tables';
import type { CompetencyOwner, CompetencyOwnerFilter } from './types/types';

export const useOwnerStore = defineStore('owner', () => {
  const allOwners = ref<CompetencyOwner[]>(sales);
  const filteredOwners = ref<CompetencyOwner[]>(sales);
  const filters = ref<CompetencyOwnerFilter>({
    number: '',
    identityCardNo: ''
  });

  const owners = computed(() => filteredOwners.value);

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
      const matchesIdentity = !filters.value.identityCardNo || 
                           owner.noWhenIntroduction.toLowerCase().includes(filters.value.identityCardNo.toLowerCase());
      return matchesNumber && matchesIdentity;
    });
  };

  const resetFilters = () => {
    filters.value = {
      number: '',
      identityCardNo: ''
    };
    filteredOwners.value = allOwners.value;
  };

  const addOwnerRecord = (newOwner: Partial<CompetencyOwner>) => {
    const maxWas = Math.max(...allOwners.value.map(owner => owner.was), 0);
    const newWas = maxWas + 1;

    const newRecord: CompetencyOwner = {
      was: newWas,
      getToWork: newOwner.getToWork || '',
      outOfOffice: newOwner.outOfOffice || '',
      reEnterOffice: newOwner.reEnterOffice || '',
      backToWork: newOwner.backToWork || '',
      officerName1: newOwner.officerName1 || '',
      officerName2: newOwner.officerName2 || '',
      number: newOwner.number || `CP-${new Date().getFullYear()}-${String(newWas).padStart(3, '0')}`,
      noWhenIntroduction: newOwner.noWhenIntroduction || '',
      status: 'Active',
      agencyDivision: newOwner.agencyDivision || '',
      position: newOwner.position || 1,
      grade: newOwner.grade || '',
      identityCardNo: newOwner.identityCardNo || '',
    };

    allOwners.value.push(newRecord);
    filteredOwners.value = [...allOwners.value];

    return newRecord;
  };

  const updateOwnerRecord = (wasId: number, updatedData: Partial<CompetencyOwner>) => {
    const index = allOwners.value.findIndex(owner => owner.was === wasId);
    
    if (index !== -1) {
      allOwners.value[index] = {
        ...allOwners.value[index],
        ...updatedData,
        was: wasId
      };
      
      const filteredIndex = filteredOwners.value.findIndex(owner => owner.was === wasId);
      if (filteredIndex !== -1) {
        filteredOwners.value[filteredIndex] = { ...allOwners.value[index] };
      }
      
      return true;
    }
    
    return false;
  };

  const deleteOwnerRecord = (wasId: number) => {
    try {
      const index = allOwners.value.findIndex(owner => owner.was === wasId);
      if (index !== -1) {
        allOwners.value.splice(index, 1);
        filteredOwners.value = allOwners.value.filter(owner => owner.was !== wasId);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting owner record:", error);
      return false;
    }
  };

  const getOwnerByWas = (wasId: number) => {
    return allOwners.value.find(owner => owner.was === wasId) || null;
  };

  // Export data to Excel
  const exportToExcel = (gridInstance: any, data: any[], options: any = {}) => {
    try {
      console.log('Exporting to Excel:', { data, options });
      
      // Check if DevExtreme export functionality is available
      if (gridInstance && gridInstance.exportToExcel) {
        // Use DevExtreme's built-in export function
        gridInstance.exportToExcel(options.excludeColumns ? { customizeExcelCell: (options: any) => {
          // Customize Excel cells if needed
        }} : {});
      } else {
        // Fallback method: Create a CSV string and trigger download
        const columns = options.columns || (gridInstance && gridInstance.getVisibleColumns 
          ? gridInstance.getVisibleColumns() 
          : Object.keys(data[0] || {}).map(key => ({
            dataField: key,
            caption: key
          })));
          
        // Create CSV content
        let csvContent = columns.map((col: any) => col.caption || col.dataField).join(',') + '\n';
        
        // Add data rows
        data.forEach((item: any) => {
          const row = columns
            .map((col: any) => {
              // Skip excluded columns
              if (options.excludeColumns && options.excludeColumns.includes(col.dataField)) {
                return '';
              }
              const value = item[col.dataField];
              // Format value for CSV
              return value !== undefined && value !== null ? `"${String(value).replace(/"/g, '""')}"` : '';
            })
            .join(',');
          csvContent += row + '\n';
        });
        
        // Trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', options.filename || 'export.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      return true;
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      return false;
    }
  };

  // Print grid data
  const printGrid = (gridInstance: any, data: any[], options: any = {}) => {
    try {
      console.log('Printing grid:', { data, options });
      
      // Check if DevExtreme print functionality is available
      if (gridInstance && gridInstance.print) {
        // Use DevExtreme's built-in print function
        gridInstance.print();
        return true;
      } 
      
      // Fallback print method
      const columns = options.columns || (gridInstance && gridInstance.getVisibleColumns 
        ? gridInstance.getVisibleColumns() 
        : Object.keys(data[0] || {}).map(key => ({
          dataField: key,
          caption: key
        })));
        
      // Create table HTML
      let tableHtml = `
        <html>
          <head>
            <title>${options.title || 'Grid Data'}</title>
            <style>
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>${options.title || 'Grid Data'}</h1>
            <table>
              <thead>
                <tr>
                  ${columns
                    .filter((col: any) => !(options.excludeColumns && options.excludeColumns.includes(col.dataField)))
                    .map((col: any) => `<th>${col.caption || col.dataField}</th>`)
                    .join('')}
                </tr>
              </thead>
              <tbody>
      `;
      
      // Add data rows
      data.forEach((item: any) => {
        tableHtml += '<tr>';
        columns
          .filter((col: any) => !(options.excludeColumns && options.excludeColumns.includes(col.dataField)))
          .forEach((col: any) => {
            const value = item[col.dataField];
            tableHtml += `<td>${value !== undefined && value !== null ? value : ''}</td>`;
          });
        tableHtml += '</tr>';
      });
      
      tableHtml += `
              </tbody>
            </table>
          </body>
        </html>
      `;
      
      // Open print window
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(tableHtml);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      }
      
      return true;
    } catch (error) {
      console.error('Error printing grid:', error);
      return false;
    }
  };

  return {
    owners,
    filters,
    filterOwners,
    resetFilters,
    addOwnerRecord,
    updateOwnerRecord,
    deleteOwnerRecord,
    getOwnerByWas,
    exportToExcel,
    printGrid
  };
});
