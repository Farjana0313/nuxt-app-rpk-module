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
                        console.log('View button clicked for:', data);
                        handleViewRecord(data);
                    }" class="text-blue-500 hover:text-blue-700">View</button>
                    <button @click="() => {
                        console.log('Edit button clicked for:', data);
                        handleEditRecord(data);
                    }" class="text-blue-500 hover:text-blue-700">Edit</button>

                    <button @click="() => {
                        console.log('Delete button clicked for:', data);
                        handleDeleteRecord(data);
                    }" class="text-red-500 hover:text-red-700">Delete</button>
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
const localData = ref([]);

// Initialize the local data once props are available
onMounted(() => {
    console.log('ListOfCompetencyOwnerAttendanceRecords mounted');
    console.log('Initial filteredOwnerData:', props.filteredOwnerData);

    // Initialize local data with props
    if (Array.isArray(props.filteredOwnerData)) {
        localData.value = [...props.filteredOwnerData];
        console.log('Initialized localData with', localData.value.length, 'records');
    } else {
        console.warn('filteredOwnerData is not an array:', props.filteredOwnerData);
        localData.value = [];
    }
});

// Watch for changes in filteredOwnerData props and update localData
watch(() => props.filteredOwnerData, (newVal) => {
    console.log('filteredOwnerData changed:', newVal);
    if (Array.isArray(newVal)) {
        localData.value = [...newVal];
        console.log('Updated localData to', localData.value.length, 'records');
    } else {
        console.warn('New filteredOwnerData is not an array:', newVal);
    }
}, { deep: true });

// Use the filtered data if provided, otherwise use the full sales data
const dataSource = computed(() => {
    console.log('Computing dataSource with localData length:', localData.value.length);

    if (localData.value.length === 0 && props.filteredOwnerData.length === 0) {
        // Check if we're looking at an owner without any records
        if (props.filteredOwnerData.length === 0) {
            console.log('No owner-specific records found, showing empty data');
            return [];
        } else {
            // Fall back to sample data for display
            console.log('Using sample sales data');
            return sales;
        }
    }

    // Use our local data
    console.log('Using local data with', localData.value.length, 'records');
    return localData.value;
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

    // Reset all form-related state
    editMode.value = false;
    viewOnly.value = false;

    // Important: Set currentEditData to null to ensure we don't use previous data
    currentEditData.value = null;

    console.log('Form state reset for adding new record');
    console.log('editMode:', editMode.value);
    console.log('viewOnly:', viewOnly.value);
    console.log('currentEditData:', currentEditData.value);

    // Show the popup form
    popupVisible.value = true;
};

// Method to handle view record
const handleViewRecord = (data) => {
    console.log('View record:', data);
    console.log('View record data type:', typeof data);
    console.log('View record properties:', Object.keys(data));

    // Ensure we have the correct data structure
    const recordToView = data && data.data ? data.data : data;

    console.log('View record extracted:', recordToView);
    console.log('WAS property:', recordToView.was);

    // Set view mode
    viewOnly.value = true;
    editMode.value = false;
    currentEditData.value = { ...recordToView };

    // Log what we're passing to the form
    console.log('Setting currentEditData for view to:', currentEditData.value);

    // Show the popup
    popupVisible.value = true;
};

// Method to handle edit record
const handleEditRecord = (data) => {
    console.log('Edit record:', data);
    console.log('Edit record data type:', typeof data);
    console.log('Edit record properties:', Object.keys(data));

    // Ensure we have the correct data structure
    const recordToEdit = data && data.data ? data.data : data;

    console.log('Edit record extracted:', recordToEdit);
    console.log('WAS property:', recordToEdit.was);

    // Set edit mode
    viewOnly.value = false;
    editMode.value = true;
    currentEditData.value = { ...recordToEdit };
    popupVisible.value = true;
};

// Method to handle delete record
const handleDeleteRecord = (data) => {
    console.log('Delete requested:', data);
    console.log('Delete data type:', typeof data);
    console.log('Delete data properties:', Object.keys(data));

    // Ensure we have the correct data structure
    const recordToDelete = data && data.data ? data.data : data;

    console.log('Delete record extracted:', recordToDelete);
    console.log('WAS property to delete:', recordToDelete.was);

    if (!recordToDelete || !recordToDelete.was) {
        console.error('Invalid record for deletion - missing was property');
        showToast({
            type: 'error',
            message: 'Error: Cannot identify record to delete'
        });
        return;
    }

    // Set the was ID to delete and show confirmation dialog
    ownerToDelete.value = recordToDelete.was;
    confirmDialogVisible.value = true;
};
const confirmDelete = () => {
    if (ownerToDelete.value !== null) {
        console.log('Confirming deletion of record with was:', ownerToDelete.value);

        try {
            // Call the store to delete the record
            const success = ownerStore.deleteOwnerRecord(ownerToDelete.value);

            if (success) {
                console.log('Deletion successful');
                showToast({
                    type: 'success',
                    message: 'Record deleted successfully!'
                });

                // Update the local dataSource to reflect the change
                console.log('Filtering local data to remove deleted record');
                localData.value = localData.value.filter(owner => owner.was !== ownerToDelete.value);

                // Get fresh data from the store to ensure everything is in sync
                const storeOwners = ownerStore.owners;
                console.log('Owner store data after deletion:', storeOwners);

                // Only update if the filtered data is empty but store has records
                if (localData.value.length === 0 &&
                    ((Array.isArray(storeOwners) && storeOwners.length > 0) ||
                        (storeOwners.value && storeOwners.value.length > 0))) {
                    console.log('Refreshing local data with store data');
                    localData.value = Array.isArray(storeOwners) ? [...storeOwners] : [...(storeOwners.value || [])];
                }
            } else {
                console.error('Deletion failed');
                showToast({
                    type: 'error',
                    message: 'Error deleting record. Please try again.'
                });
            }
        } catch (error) {
            console.error('Error during delete operation:', error);
            showToast({
                type: 'error',
                message: `Error: ${error.message}`
            });
        } finally {
            // Clean up regardless of outcome
            confirmDialogVisible.value = false;
            ownerToDelete.value = null;
        }
    } else {
        console.warn('No record selected for deletion');
        confirmDialogVisible.value = false;
    }
};

// Method to handle form save
const handleSaveRecord = (data) => {
    console.log('Save record:', data);
    console.log('Edit mode:', editMode.value);
    console.log('Current edit data:', currentEditData.value);

    // Basic validation
    if (!data.number || !data.getToWork) {
        showToast({
            type: 'error',
            message: 'Please fill in all required fields'
        });
        return;
    }

    try {
        // Check if in edit mode or add mode and take appropriate action
        if (editMode.value && currentEditData.value && currentEditData.value.was) {
            console.log('Updating existing record with was:', currentEditData.value.was);

            // Make sure the was property is included in the data
            const updateData = {
                ...data,
                was: currentEditData.value.was
            };

            console.log('Update data being sent to store:', updateData);

            // Update existing record
            const success = ownerStore.updateOwnerRecord(currentEditData.value.was, updateData);

            if (success) {
                showToast({
                    type: 'success',
                    message: 'Record updated successfully!'
                });
            } else {
                showToast({
                    type: 'error',
                    message: 'Failed to update record'
                });
            }
        } else {
            console.log('Adding new record');

            // Add new record
            const newRecord = ownerStore.addOwnerRecord(data);
            console.log('New record added:', newRecord);

            showToast({
                type: 'success',
                message: 'Record added successfully!'
            });
        }

        // Close the popup
        popupVisible.value = false;

        // Refresh the data source to include the new or updated record
        // Access the owners correctly - it's a computed property, not a ref
        const storeOwners = ownerStore.owners;
        console.log('Store owners after operation:', storeOwners);

        // Update the local data array
        localData.value = Array.isArray(storeOwners) ? [...storeOwners] : [...(storeOwners.value || [])];
        console.log('Updated localData with store data:', localData.value);
    } catch (error) {
        console.error('Error saving record:', error);
        showToast({
            type: 'error',
            message: `Error saving record: ${error.message}`
        });
    }
};

// Method to handle form cancel
const handleCancelEdit = () => {
    console.log('Cancel edit');

    // Reset all form-related state
    editMode.value = false;
    viewOnly.value = false;
    currentEditData.value = null;

    // Close the popup
    popupVisible.value = false;
};

// Method to handle edit request from view mode
const handleEditFromView = (data) => {
    console.log('Edit requested from view mode:', data);
    console.log('Current editData before switch:', currentEditData.value);

    // Switch from view mode to edit mode
    viewOnly.value = false;
    editMode.value = true;

    // If data is provided from the form component, use it to update currentEditData
    if (data && typeof data === 'object') {
        console.log('Updating currentEditData with form data');

        // Ensure we preserve the was property
        const was = currentEditData.value?.was;
        currentEditData.value = {
            ...data,
            was: was
        };
    }

    console.log('Updated currentEditData for edit:', currentEditData.value);
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
