<template>
    <div class="my-12">
        <DxDataGrid ref="dataGridRef" :data-source="sales" :show-borders="true" :key-expr="'orderId'">

            <DxExport :enabled="true" :allow-export-selected-data="true" />

            <DxToolbar>
                <DxItem location="before" widget="dxButton" :options="{
                    text: 'Add New Record',
                }" />
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

            <!-- <DxDataGrid :data-source="sales" :show-borders="true" key-expr="orderId"> -->
            <DxColumn :width="90" data-field="orderId" caption="Order ID" />
            <DxColumn data-field="city" />
            <DxColumn :width="180" data-field="country" />
            <DxColumn data-field="region" />
            <DxColumn data-field="date" data-type="date" />
            <DxColumn :width="90" data-field="amount" format="currency" />
            <DxHeaderFilter :visible="true" />
            <DxSearchPanel :visible="true" :width="240" />
            <DxPaging :page-size="10" />
            <DxPager :show-page-size-selector="true" :allowed-page-sizes="[10, 20, 50]" :show-info="true" />
            <DxSelection mode="multiple" show-check-boxes-mode="always" />
            <!-- <DxFilterRow :visible="true" /> -->
        </DxDataGrid>
    </div>
</template>
<script setup lang="ts">
import {
    DxHeaderFilter,
    DxColumn,
    DxDataGrid,
    DxToolbar,
    DxItem,
    DxFilterRow,
    DxPager,
    DxPaging,
    DxSelection,
    DxSearchPanel,
    DxExport,
    type DxDataGridTypes,
} from 'devextreme-vue/data-grid';
// import { DxSelectBox } from 'devextreme-vue/select-box';
import themes from 'devextreme/ui/themes';
import { ref } from 'vue';
import { sales } from '../../../../data/tables.ts';

const selectAllModes: DxDataGridTypes.SelectAllMode[] = ['allPages', 'page'];
const showCheckBoxesModes: DxDataGridTypes.SelectionColumnDisplayMode[] = ['none', 'onClick', 'onLongTap', 'always'];
const allMode = ref(selectAllModes[0]);
const checkBoxesMode = ref<DxDataGridTypes.SelectionColumnDisplayMode>(themes.current().startsWith('material') ? 'always' : 'onClick');
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