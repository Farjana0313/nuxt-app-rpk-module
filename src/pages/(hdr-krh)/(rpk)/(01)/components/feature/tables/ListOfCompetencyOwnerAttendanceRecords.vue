<template>
    <div class="my-12 bg-white border border-gray-200 p-6 w-full mt-6 shadow-lg rounded-lg">
        <div v-if="dataSource.length === 0" class="text-center p-6 bg-gray-100 rounded-lg">
            <p class="text-gray-600 font-medium">No attendance records found for this owner.</p>
        </div>
        <DxDataGrid v-else ref="dataGridRef" :data-source="dataSource" :show-borders="true" :key-expr="'was'">
            <DxExport :enabled="true" :allow-export-selected-data="true" />

            <DxToolbar>
                <DxItem name="searchPanel" />
                <DxItem location="after" widget="dxButton" :options="{
                    icon: 'plus',
                    text: 'Add New Record',
                    onClick: showAddForm,
                }" />
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
                    <button @click="() => {
                        console.log('View button clicked');
                        handleViewRecord(data);
                    }" class="text-blue-500 hover:text-blue-700">View</button>
                    <button @click="() => {
                        console.log('Edit button clicked');
                        handleEditRecord(data);
                    }" class="text-blue-500 hover:text-blue-700">Edit</button>

                    <button @click="() => handleDeleteRecord(data)"
                        class="text-red-500 hover:text-red-700">Delete</button>

                </div>
            </template>
            <template v-if="confirmDialogVisible">
                <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div class="bg-white p-6 rounded-lg shadow-md text-center">
                        <p class="mb-4 text-lg font-medium">Are you sure you want to delete this record?</p>
                        <div class="flex justify-center gap-4">
                            <button class="bg-red-500 text-white px-4 py-2 rounded" @click="confirmDelete">Yes,
                                Delete</button>
                            <button class="bg-gray-300 px-4 py-2 rounded"
                                @click="() => { confirmDialogVisible = false; }">Cancel</button>
                        </div>
                    </div>
                </div>
            </template>

            <!-- <DxFilterRow :visible="true" /> -->
        </DxDataGrid>

        <!-- Add Popup for New/Edit Record Form -->
        <DxPopup v-model:visible="popupVisible" :width="1000" :height="750" :show-title="true" :title="formTitle"
            :drag-enabled="true" :close-on-outside-click="true">
            <AddNewCompetencyOwner :edit-mode="editMode" :view-only="viewOnly" :edit-data="currentEditData"
                @save="handleSaveRecord" @cancel="handleCancelEdit" @edit="handleEditFromView" @toast="showToast" />
        </DxPopup>

        <!-- Toast Notification -->
        <div v-if="toast.visible" :class="[
            'fixed top-5 right-5 p-4 rounded shadow-lg z-50 transition-opacity duration-300',
            toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        ]">
            {{ toast.message }}
        </div>
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
import { DxPopup } from 'devextreme-vue/popup';
// import { DxSelectBox } from 'devextreme-vue/select-box';
import { useOwnerStore } from '@/stores/Owner/ownerStore';
import 'devextreme/dist/css/dx.light.css'; // Make sure DevExtreme CSS is included
import themes from 'devextreme/ui/themes';
import { computed, onMounted, ref, watch } from 'vue';
import { sales } from '../../../../data/tables.ts';
import AddNewCompetencyOwner from '../../recordsForm/AddNewCompetencyOwner.vue';
const ownerToDelete = ref<number | null>(null);
const confirmDialogVisible = ref(false);

// Check if AddNewCompetencyOwner is properly imported
console.log('AddNewCompetencyOwner imported:', !!AddNewCompetencyOwner);

// Define props for the component
const props = defineProps({
    filteredOwnerData: {
        type: Array,
        default: () => []
    }
});

// Toast notification handling
const toast = ref({
    visible: false,
    message: '',
    type: 'success'
});

const showToast = (data) => {
    toast.value = {
        visible: true,
        message: data.message,
        type: data.type
    };

    // Auto-hide toast after 3 seconds
    setTimeout(() => {
        toast.value.visible = false;
    }, 3000);
};

// Create a local copy of the data for mutations
const localData = ref([...props.filteredOwnerData]);

// Watch for changes in filteredOwnerData props and update localData
watch(() => props.filteredOwnerData, (newVal) => {
    localData.value = [...newVal];
}, { deep: true });

// Use the filtered data if provided, otherwise use the full sales data
const dataSource = computed(() => {
    return localData.value.length > 0 ? localData.value : sales;
});

const selectAllModes: DxDataGridTypes.SelectAllMode[] = ['allPages', 'page'];
const showCheckBoxesModes: DxDataGridTypes.SelectionColumnDisplayMode[] = ['none', 'onClick', 'onLongTap', 'always'];
const allMode = ref(selectAllModes[0]);
const checkBoxesMode = ref<DxDataGridTypes.SelectionColumnDisplayMode>(themes.current().startsWith('material') ? 'always' : 'onClick');

const dataGridRef = ref(null);
const ownerStore = useOwnerStore();

// Form controls
const popupVisible = ref(false);
const editMode = ref(false);
const viewOnly = ref(false);
const currentEditData = ref(null);

// Computed property for the form title
const formTitle = computed(() => {
    if (viewOnly.value) return 'View Competency Owner Attendance Record';
    return editMode.value ? 'Edit Competency Owner Attendance Record' : 'Add New Competency Owner Attendance Record';
});

// Method to show the Add Form
const showAddForm = () => {
    console.log('showAddForm called');
    editMode.value = false;
    viewOnly.value = false;
    currentEditData.value = null;
    popupVisible.value = true;
};

// Method to handle view record
const handleViewRecord = (data) => {
    console.log('View record:', data);
    viewOnly.value = true;
    editMode.value = false;
    currentEditData.value = { ...data };
    popupVisible.value = true;
};

// Method to handle edit record
const handleEditRecord = (data) => {
    console.log('Edit record:', data);
    viewOnly.value = false;
    editMode.value = true;
    currentEditData.value = { ...data };
    popupVisible.value = true;
};

// Method to handle delete record
const handleDeleteRecord = (data) => {
    console.log('Delete requested:', data);
    ownerToDelete.value = data.was;
    confirmDialogVisible.value = true;
};
const confirmDelete = () => {
    if (ownerToDelete.value !== null) {
        const success = ownerStore.deleteOwnerRecord(ownerToDelete.value);
        if (success) {
            showToast({
                type: 'success',
                message: 'Record deleted successfully!'
            });
            // Update the local dataSource to reflect the change
            localData.value = localData.value.filter(owner => owner.was !== ownerToDelete.value);
        } else {
            showToast({
                type: 'error',
                message: 'Error deleting record. Please try again.'
            });
        }
        confirmDialogVisible.value = false;
        ownerToDelete.value = null;
    }
};

// Method to handle form save
const handleSaveRecord = (data) => {
    console.log('Save record:', data);
    popupVisible.value = false;

    // Use the store data directly to refresh the local data
    if (ownerStore.owners.value) {
        localData.value = [...ownerStore.owners.value];
    }
};

// Method to handle form cancel
const handleCancelEdit = () => {
    console.log('Cancel edit');
    popupVisible.value = false;
};

// Method to handle edit request from view mode
const handleEditFromView = (data) => {
    console.log('Edit requested from view mode:', data);
    // Switch from view mode to edit mode while keeping the same data
    viewOnly.value = false;
    editMode.value = true;
    // Current data is already set in currentEditData, no need to change it
};

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
        showToast({
            type: 'error',
            message: `Export error: ${error.message}`
        });
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
        showToast({
            type: 'error',
            message: `Print error: ${error.message}`
        });
    }
};

onMounted(() => {
    // Verify the grid is properly mounted and accessible
    console.log('Component mounted');
    console.log('DataGrid available:', !!dataGridRef.value);
    console.log('Popup visible state:', popupVisible.value);

    // Debug modal CSS properties
    console.log('Modal CSS classes applied:',
        document.querySelectorAll('.fixed.inset-0.z-\\[9999\\]').length,
        'modal elements found');

    if (dataGridRef.value) {
        console.log('DataGrid instance available:', !!dataGridRef.value.instance);
    }
});
</script>
