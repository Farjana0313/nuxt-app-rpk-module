<template>
    <div class="calendar-container">
        <div class="calendar-header">
            <h1>{{ displayingTitle }}</h1>
            <div class="user-info">
                <span>{{ superintendentOfDepartment }}</span>
                <DxButton icon="user" />
            </div>
        </div>

        <div class="calendar-content">
            <div class="scheduler-container">
                <div class="navigation-controls">
                    <DxButton icon="chevronleft" @click="navigatePrev" class="nav-button" />
                    <div class="date-title">
                        {{ displayDateRange }}
                    </div>
                    <DxButton icon="chevronright" @click="navigateNext" class="nav-button" />
                    <div class="view-selector">
                        <DxButton text="SUNDAY" :class="{ active: currentView === 'day' }" @click="changeView('day')" />
                        <DxButton text="MONTH" :class="{ active: currentView === 'month' }"
                            @click="changeView('month')" />
                        <DxButton icon="filter" @click="toggleFilterPanel" />
                    </div>
                </div>

                <DxScheduler :data-source="mpkStore.filteredActivities" :current-date="mpkStore.currentDate"
                    :views="schedulerViews" :current-view="currentView" :height="600" :cell-duration="60"
                    :start-day-hour="9" :end-day-hour="24" :show-all-day-panel="false" :first-day-of-week="0"
                    :date-cell-template="dateCellTemplate" :date-cell-component="DateCell"
                    :appointment-component="AppointmentTemplate" :on-appointment-click="onAppointmentClick">
                    <DxResource :field-expr="'module'" :color-expr="'colorClass'" :data-source="modules" />
                </DxScheduler>
            </div>

            <div class="sidebar">
                <div class="filter-legend">
                    <div class="legend-title">
                        <h3>Activities created by</h3>
                    </div>
                    <div class="legend-items">
                        <div class="legend-item">
                            <div class="color-box color-blue"></div>
                            <span>Activities created by Own Competence Owner</span>
                        </div>
                        <div class="legend-item">
                            <div class="color-box color-green"></div>
                            <span>Activities created by Convenience Module</span>
                        </div>
                        <div class="legend-item">
                            <div class="color-box color-lightgreen"></div>
                            <span>Activities created by Convenience Module</span>
                        </div>
                        <div class="legend-item">
                            <div class="color-box color-orange"></div>
                            <span>Activities created by Parent Module</span>
                        </div>
                        <div class="legend-item">
                            <div class="color-box color-brown"></div>
                            <span>Activities created by Related Module</span>
                        </div>
                        <div class="legend-item">
                            <div class="color-box color-yellow"></div>
                            <span>Activities created by Core Module</span>
                        </div>
                    </div>
                </div>

                <div class="filter-panel" v-if="showFilters">
                    <div class="filter-section">
                        <DxCheckBox text="Module" v-model:value="filterSettings.moduleEnabled" />
                        <DxCheckBox text="Activity Type" v-model:value="filterSettings.activityTypeEnabled" />
                        <DxCheckBox text="Activity Category" v-model:value="filterSettings.activityCategoryEnabled" />
                        <DxCheckBox text="All" v-model:value="filterSettings.allEnabled" />
                    </div>
                </div>

                <div class="action-buttons">
                    <DxButton text="Search for Competence Owner" @click="openCompetenceSearch" class="comp-button" />
                    <DxButton text="Reset List" @click="resetFilters" class="reset-button" />
                </div>
            </div>
        </div>

        <!-- Activity Details Popup -->
        <DxPopup :visible="!!mpkStore.currentActivity" :show-title="true" title="CALENDAR ACTIVITY INFORMATION"
            :on-hiding="closeActivityDetails" width="500" height="auto">
            <div class="activity-details">
                <div class="form-group">
                    <label>Activity Name</label>
                    <div class="input-field">{{ mpkStore.currentActivity?.name }}</div>
                </div>
                <div class="form-group">
                    <label>Location</label>
                    <div class="input-field">{{ mpkStore.currentActivity?.location }}</div>
                </div>
                <div class="form-row">
                    <div class="form-group half">
                        <label>Start Date</label>
                        <div class="input-field">{{ formatDate(mpkStore.currentActivity?.startDate) }}</div>
                    </div>
                    <div class="form-group half">
                        <label>Start Time</label>
                        <div class="input-field">{{ formatTime(mpkStore.currentActivity?.startDate) }}</div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group half">
                        <label>End Date</label>
                        <div class="input-field">{{ formatDate(mpkStore.currentActivity?.endDate) }}</div>
                    </div>
                    <div class="form-group half">
                        <label>End Time</label>
                        <div class="input-field">{{ formatTime(mpkStore.currentActivity?.endDate) }}</div>
                    </div>
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <div class="input-field">{{ mpkStore.currentActivity?.notes }}</div>
                </div>
                <div class="action-buttons">
                    <DxButton icon="edit" class="icon-button" @click="editActivity" />
                    <DxButton icon="trash" class="icon-button" @click="deleteActivity" />
                    <DxButton icon="close" class="icon-button" @click="closeActivityDetails" />
                </div>
            </div>
        </DxPopup>

        <!-- Competence Owner Search Popup -->
        <DxPopup :visible="mpkStore.showOwnerSearch" :show-title="true" title="SEARCH FOR COMPETENCE OWNER"
            :on-hiding="closeCompetenceSearch" width="600" height="500">
            <div class="search-popup-content">
                <div class="search-form">
                    <div class="form-group">
                        <label>DEPARTMENT NAME:</label>
                        <DxSelectBox :data-source="departments" />
                    </div>
                    <div class="search-buttons">
                        <DxButton icon="search" text="Search" @click="searchCompetenceOwners" />
                        <DxButton text="Reset" @click="resetSearch" />
                    </div>
                </div>

                <div class="view-calendar-link">
                    <DxButton icon="chevronleft" text="View Competency Owner Activity Calendar"
                        @click="viewOwnerCalendar" />
                </div>

                <DxDataGrid :data-source="mpkStore.filteredOwners" :selection="{ mode: 'multiple' }"
                    :show-borders="true" @selection-changed="onOwnerSelectionChanged">
                    <DxColumn data-field="id" caption="BIL" width="50" />
                    <DxColumn data-field="name" caption="OWNER'S NAME\nCOMPETENCE" width="200" />
                    <DxColumn data-field="identificationNumber" caption="IDENTIFICATION CARD NO." width="150" />
                    <DxColumn data-field="position" caption="POSITION" width="200" />
                    <DxSelection select-all-mode="allPages" />
                    <DxPaging :page-size="10" />
                    <DxPager :visible="true" :show-page-size-selector="true" :allowed-page-sizes="[5, 10, 20]" />
                </DxDataGrid>
            </div>
        </DxPopup>

        <!-- Activity Form Popup -->
        <DxPopup :visible="mpkStore.showActivityForm" :show-title="true" title="CALENDAR ACTIVITY INFORMATION"
            :on-hiding="closeActivityForm" width="500" height="auto">
            <ActivityForm @save="saveActivity" @cancel="closeActivityForm" />
        </DxPopup>
    </div>
</template>

<script setup lang="ts">
import { useMPKStore } from '@/stores/mpk/mpkStore';
import type { CalendarActivity } from '@/stores/mpk/types/types';
import { computed, defineComponent, ref } from 'vue';

// DevExtreme components
import DxButton from 'devextreme-vue/button';
import DxCheckBox from 'devextreme-vue/check-box';
import DxDataGrid, {
    DxColumn,
    DxPager,
    DxPaging,
    DxSelection
} from 'devextreme-vue/data-grid';
import DxPopup from 'devextreme-vue/popup';
import DxScheduler, { DxResource } from 'devextreme-vue/scheduler';
import DxSelectBox from 'devextreme-vue/select-box';

// Placeholder components for templates (to be created)
const ActivityForm = defineComponent({
    template: `
    <div class="activity-form">
      <div class="form-group">
        <label>Activity Name</label>
        <input v-model="activity.name" class="dx-texteditor" />
      </div>
      <div class="form-group">
        <label>Location</label>
        <input v-model="activity.location" class="dx-texteditor" />
      </div>
      <div class="form-row">
        <div class="form-group half">
          <label>Start Date</label>
          <input type="date" v-model="startDate" class="dx-texteditor" />
        </div>
        <div class="form-group half">
          <label>Start Time</label>
          <input type="time" v-model="startTime" class="dx-texteditor" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group half">
          <label>End Date</label>
          <input type="date" v-model="endDate" class="dx-texteditor" />
        </div>
        <div class="form-group half">
          <label>End Time</label>
          <input type="time" v-model="endTime" class="dx-texteditor" />
        </div>
      </div>
      <div class="form-group">
        <label>Notes</label>
        <textarea v-model="activity.notes" class="dx-texteditor"></textarea>
      </div>
      <div class="action-buttons">
        <dx-button text="Save" type="success" @click="save" />
        <dx-button text="Cancel" @click="cancel" />
      </div>
    </div>
  `,
    props: ['initialActivity'],
    components: {
        DxButton
    },
    setup(props, { emit }) {
        const mpkStore = useMPKStore();

        const activity = ref<Partial<CalendarActivity>>({
            name: '',
            location: '',
            notes: '',
            module: 'Training',
            ownerId: 1,
            ...props.initialActivity
        });

        const startDate = ref(props.initialActivity?.startDate ? formatDateForInput(props.initialActivity.startDate) : formatDateForInput(new Date()));
        const startTime = ref(props.initialActivity?.startDate ? formatTimeForInput(props.initialActivity.startDate) : '09:00');
        const endDate = ref(props.initialActivity?.endDate ? formatDateForInput(props.initialActivity.endDate) : formatDateForInput(new Date()));
        const endTime = ref(props.initialActivity?.endDate ? formatTimeForInput(props.initialActivity.endDate) : '10:00');

        function formatDateForInput(date: Date) {
            return date.toISOString().split('T')[0];
        }

        function formatTimeForInput(date: Date) {
            return date.toTimeString().substring(0, 5);
        }

        function save() {
            const startDateTime = new Date(`${startDate.value}T${startTime.value}`);
            const endDateTime = new Date(`${endDate.value}T${endTime.value}`);

            emit('save', {
                ...activity.value,
                startDate: startDateTime,
                endDate: endDateTime
            });
        }

        function cancel() {
            emit('cancel');
        }

        return {
            activity,
            startDate,
            startTime,
            endDate,
            endTime,
            save,
            cancel
        };
    }
});

const DateCell = defineComponent({
    template: `
    <div class="date-cell">
      <div class="date-number">{{ data.text }}</div>
    </div>
  `,
    props: ['data']
});

const AppointmentTemplate = defineComponent({
    template: `
    <div class="appointment" :class="data.appointmentData.colorClass">
      <div class="appointment-title">{{ data.appointmentData.name }}</div>
      <div class="appointment-time">{{ formatTime(data.appointmentData.startDate) }} - {{ formatTime(data.appointmentData.endDate) }}</div>
    </div>
  `,
    props: ['data'],
    setup() {
        function formatTime(date: Date) {
            if (!date) return '';
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        return {
            formatTime
        };
    }
});

// Main component setup
const mpkStore = useMPKStore();
const currentView = ref('week');
const showFilters = ref(false);
const selectedOwners = ref<number[]>([]);

const schedulerViews = ['day', 'week', 'month'];

const filterSettings = ref({
    moduleEnabled: false,
    activityTypeEnabled: false,
    activityCategoryEnabled: false,
    allEnabled: true
});

const departments = [
    'Human Resources',
    'Engineering',
    'Finance',
    'Operations',
    'Information Technology'
];

const modules = computed(() =>
    mpkStore.uniqueModules.map(module => ({
        id: module,
        text: module
    }))
);

const displayingTitle = computed(() => {
    return 'Displaying Calendar (Superintendent of Department)';
});

const superintendentOfDepartment = computed(() => {
    return 'Superintendent of Department';
});

const displayDateRange = computed(() => {
    const currentDate = mpkStore.currentDate;
    if (currentView.value === 'month') {
        return `${currentDate.toLocaleString('default', { month: 'short' })} ${currentDate.getFullYear()}`;
    } else if (currentView.value === 'week') {
        // Get the first day of the week (Sunday)
        const firstDay = new Date(currentDate);
        const day = currentDate.getDay();
        firstDay.setDate(currentDate.getDate() - day);

        // Get the last day of the week (Saturday)
        const lastDay = new Date(firstDay);
        lastDay.setDate(firstDay.getDate() + 6);

        // Format the display string
        return `${firstDay.getDate()} - ${lastDay.getDate()} ${firstDay.toLocaleString('default', { month: 'short' })}, ${firstDay.getFullYear()}`;
    } else {
        return currentDate.toLocaleString('default', { day: 'numeric', month: 'short', year: 'numeric' });
    }
});

function navigatePrev() {
    const currentDate = new Date(mpkStore.currentDate);

    if (currentView.value === 'month') {
        currentDate.setMonth(currentDate.getMonth() - 1);
    } else if (currentView.value === 'week') {
        currentDate.setDate(currentDate.getDate() - 7);
    } else {
        currentDate.setDate(currentDate.getDate() - 1);
    }

    mpkStore.setCurrentDate(currentDate);
}

function navigateNext() {
    const currentDate = new Date(mpkStore.currentDate);

    if (currentView.value === 'month') {
        currentDate.setMonth(currentDate.getMonth() + 1);
    } else if (currentView.value === 'week') {
        currentDate.setDate(currentDate.getDate() + 7);
    } else {
        currentDate.setDate(currentDate.getDate() + 1);
    }

    mpkStore.setCurrentDate(currentDate);
}

function changeView(view: string) {
    currentView.value = view;
}

function toggleFilterPanel() {
    showFilters.value = !showFilters.value;
}

function onAppointmentClick(e: any) {
    mpkStore.setCurrentActivity(e.appointmentData);
}

function closeActivityDetails() {
    mpkStore.setCurrentActivity(null);
}

function editActivity() {
    mpkStore.toggleActivityForm(true);
}

function deleteActivity() {
    if (mpkStore.currentActivity) {
        mpkStore.deleteActivity(mpkStore.currentActivity.id);
    }
    closeActivityDetails();
}

function openCompetenceSearch() {
    mpkStore.toggleOwnerSearch(true);
}

function closeCompetenceSearch() {
    mpkStore.toggleOwnerSearch(false);
}

function searchCompetenceOwners() {
    // Implementation would go here
}

function resetSearch() {
    mpkStore.setSearchTerm('');
}

function viewOwnerCalendar() {
    closeCompetenceSearch();
}

function onOwnerSelectionChanged(e: any) {
    const selectedRowsData = e.selectedRowsData;
    selectedOwners.value = selectedRowsData.map((owner: any) => owner.id);
    mpkStore.setSelectedOwners(selectedOwners.value);
}

function resetFilters() {
    mpkStore.resetFilters();
    mpkStore.setSelectedOwners([]);
    selectedOwners.value = [];
}

function closeActivityForm() {
    mpkStore.toggleActivityForm(false);
}

function saveActivity(activity: Partial<CalendarActivity>) {
    if (mpkStore.currentActivity) {
        // Update existing activity
        mpkStore.updateActivity({
            ...mpkStore.currentActivity,
            ...activity
        });
    } else {
        // Add new activity
        mpkStore.addActivity(activity as Omit<CalendarActivity, 'id'>);
    }

    closeActivityForm();
}

function formatDate(date?: Date) {
    if (!date) return '';
    return date.toLocaleDateString();
}

function formatTime(date?: Date) {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function dateCellTemplate() {
    return DateCell;
}
</script>

<style scoped>
.calendar-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}

.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 10px;
}

.calendar-content {
    display: flex;
    height: calc(100% - 60px);
}

.scheduler-container {
    flex: 1;
    padding: 10px;
    overflow: hidden;
}

.navigation-controls {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.date-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin: 0 15px;
}

.view-selector {
    margin-left: auto;
    display: flex;
    gap: 5px;
}

.nav-button {
    min-width: 30px;
}

.sidebar {
    width: 300px;
    padding: 10px;
    background-color: #f9f9f9;
    border-left: 1px solid #e0e0e0;
}

.filter-legend {
    margin-bottom: 20px;
}

.legend-title {
    margin-bottom: 10px;
}

.legend-items {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 10px;
}

.color-box {
    width: 20px;
    height: 20px;
    border-radius: 3px;
}

.color-blue {
    background-color: #5c94fe;
}

.color-green {
    background-color: #58ca93;
}

.color-lightgreen {
    background-color: #8ed9b9;
}

.color-orange {
    background-color: #f5ad65;
}

.color-brown {
    background-color: #d0936a;
}

.color-yellow {
    background-color: #ffde85;
}

.filter-panel {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
}

.filter-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.action-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.comp-button {
    background-color: #5c94fe;
    color: white;
}

.reset-button {
    background-color: #58ca93;
    color: white;
}

.activity-details {
    padding: 20px;
}

.form-group {
    margin-bottom: 15px;
}

.form-row {
    display: flex;
    gap: 15px;
}

.half {
    flex: 1;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.input-field {
    padding: 8px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    background-color: #f5f5f5;
    min-height: 20px;
}

.action-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
}

.icon-button {
    width: 40px;
    height: 40px;
}

.search-popup-content {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.search-form {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.search-buttons {
    display: flex;
    gap: 10px;
    margin-left: 20px;
}

.view-calendar-link {
    margin-bottom: 15px;
}

.appointment {
    height: 100%;
    padding: 5px;
    border-radius: 3px;
    overflow: hidden;
}

.activity-training {
    background-color: #5c94fe;
    color: white;
}

.activity-convenience {
    background-color: #58ca93;
    color: white;
}

.activity-parent {
    background-color: #f5ad65;
    color: white;
}

.activity-related {
    background-color: #d0936a;
    color: white;
}

.activity-core {
    background-color: #ffde85;
    color: black;
}

.activity-default {
    background-color: #cccccc;
    color: black;
}

.date-cell {
    text-align: center;
    padding: 5px;
}

.date-number {
    font-weight: bold;
}

.active {
    background-color: #6b7de5;
    color: white;
}
</style>
