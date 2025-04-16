<template>
    <div class="my-12">
        <DxDataGrid ref="dataGridRef" :data-source="dataSource" :show-borders="true" :key-expr="'was'">

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

            <!-- <DxDataGrid :data-source="sales" :show-borders="true" key-expr="orderId"> -->
            <DxColumn :width="90" data-field="was" caption="Was" />
            <DxColumn data-field="getToWork" caption="Date & Time Get to Work" />
            <DxColumn data-field="outOfOffice" caption="Date & Time Out of Office" />
            <DxColumn data-field="reEnterOffice" caption="Date & Time Re-enter the Office" />
            <DxColumn data-field="backToWork" caption="Date & Time Back to Work" />
            <DxColumn data-field="officerName1" caption="Officer Name Divisional Administration" />
            <DxColumn data-field="officerName2" caption="Officer Name Divisional Administration" />
            <DxColumn :width="180" data-field="number" caption="Document" />
            <DxColumn data-field="noWhenIntroduction" caption="Support" />
            <DxColumn data-field="status" caption="Action" cellTemplate="actionTemplate" />
            <DxHeaderFilter :visible="true" />
            <DxSearchPanel :visible="true" :width="240" />
            <DxPaging :page-size="10" />
            <DxPager :show-page-size-selector="true" :allowed-page-sizes="[10, 20, 50]" :show-info="true" />
            <DxSelection mode="multiple" show-check-boxes-mode="always" />

            <template #actionTemplate="{ data }">
                <div class="flex gap-2">
                    <button class="text-blue-500 hover:text-blue-700">View</button>
                    <button class="text-blue-500 hover:text-blue-700">Edit</button>
                    <button class="text-blue-500 hover:text-blue-700">Delete</button>
                </div>
            </template>
            <!-- <DxFilterRow :visible="true" /> -->
        </DxDataGrid>
    </div>
</template>
<script setup lang="ts">
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
// import { DxSelectBox } from 'devextreme-vue/select-box';
import { useOwnerStore } from '@/stores/Owner/ownerStore';
import themes from 'devextreme/ui/themes';
import { computed, onMounted, ref } from 'vue';
import { sales } from '../../../../data/tables.ts';

// Define props for the component
const props = defineProps({
    filteredOwnerData: {
        type: Array,
        default: () => []
    }
});

// Use the filtered data if provided, otherwise use the full sales data
const dataSource = computed(() => {
    return props.filteredOwnerData.length > 0 ? props.filteredOwnerData : sales;
});

const selectAllModes: DxDataGridTypes.SelectAllMode[] = ['allPages', 'page'];
const showCheckBoxesModes: DxDataGridTypes.SelectionColumnDisplayMode[] = ['none', 'onClick', 'onLongTap', 'always'];
const allMode = ref(selectAllModes[0]);
const checkBoxesMode = ref<DxDataGridTypes.SelectionColumnDisplayMode>(themes.current().startsWith('material') ? 'always' : 'onClick');

const dataGridRef = ref(null);
const ownerStore = useOwnerStore();

const handleExport = () => {
    console.log('Export button clicked');
    console.log('dataGridRef:', dataGridRef.value);

    try {
        if (dataGridRef.value && dataGridRef.value.instance) {
            console.log('dataGridRef.value.instance exists');
            ownerStore.exportToExcel(dataGridRef.value.instance, dataSource.value, {
                title: 'Competency Owner Attendance Records',
                filename: 'CompetencyOwnerAttendanceRecords.xlsx',
                excludeColumns: ['action']
            });
        } else {
            console.error('DataGrid instance is not available, using direct data export');
            // Create a minimal mock grid instance with the required methods
            const mockGridInstance = {
                getVisibleColumns: () => [
                    { dataField: 'was', caption: 'Was' },
                    { dataField: 'getToWork', caption: 'Date & Time Get to Work' },
                    { dataField: 'outOfOffice', caption: 'Date & Time Out of Office' },
                    { dataField: 'reEnterOffice', caption: 'Date & Time Re-enter the Office' },
                    { dataField: 'backToWork', caption: 'Date & Time Back to Work' },
                    { dataField: 'officerName1', caption: 'Officer Name Divisional Administration' },
                    { dataField: 'officerName2', caption: 'Officer Name Divisional Administration' },
                    { dataField: 'number', caption: 'Document' },
                    { dataField: 'noWhenIntroduction', caption: 'Support' },
                    { dataField: 'status', caption: 'Action' }
                ],
                getSelectedRowsData: () => [], // No selection
                getDataSource: () => ({ items: () => dataSource.value })
            };

            ownerStore.exportToExcel(mockGridInstance, dataSource.value, {
                title: 'Competency Owner Attendance Records',
                filename: 'CompetencyOwnerAttendanceRecords.xlsx',
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
            ownerStore.printGrid(dataGridRef.value.instance, dataSource.value, {
                title: 'Competency Owner Attendance Records',
                excludeColumns: ['action']
            });
        } else {
            console.error('DataGrid instance is not available, using direct data print');
            // Create a minimal mock grid instance with the required methods
            const mockGridInstance = {
                getVisibleColumns: () => [
                    { dataField: 'was', caption: 'Was' },
                    { dataField: 'getToWork', caption: 'Date & Time Get to Work' },
                    { dataField: 'outOfOffice', caption: 'Date & Time Out of Office' },
                    { dataField: 'reEnterOffice', caption: 'Date & Time Re-enter the Office' },
                    { dataField: 'backToWork', caption: 'Date & Time Back to Work' },
                    { dataField: 'officerName1', caption: 'Officer Name Divisional Administration' },
                    { dataField: 'officerName2', caption: 'Officer Name Divisional Administration' },
                    { dataField: 'number', caption: 'Document' },
                    { dataField: 'noWhenIntroduction', caption: 'Support' },
                    { dataField: 'status', caption: 'Action' }
                ],
                getSelectedRowsData: () => [], // No selection
                getDataSource: () => ({ items: () => dataSource.value })
            };

            ownerStore.printGrid(mockGridInstance, dataSource.value, {
                title: 'Competency Owner Attendance Records',
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
    if (dataGridRef.value) {
        console.log('DataGrid instance available:', !!dataGridRef.value.instance);
    }
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