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

  return {
    owners,
    filters,
    filterOwners,
    resetFilters,
    formatDateToString
  };
});
