import { mockActivities, mockCompetenceOwners } from '@/pages/(hdr-kal)/(mkp)/(01)/data/data';
import { defineStore } from 'pinia';
import type { CalendarActivity, CalendarFilter, CompetenceOwner } from './types/types';
import { ModuleColorMap, ModuleType } from './types/types';

export const useMPKStore = defineStore('mpk', {
  state: () => ({
    activities: [...mockActivities],
    competenceOwners: [...mockCompetenceOwners],
    selectedOwners: [] as number[],
    filters: {
      modules: [] as string[],
      activityTypes: [] as string[],
      activityCategories: [] as string[],
      all: true
    } as CalendarFilter,
    searchTerm: '',
    currentActivity: null as CalendarActivity | null,
    showActivityForm: false,
    showOwnerSearch: false,
    currentDate: new Date('2025-03-23')
  }),

  getters: {
    filteredActivities(): CalendarActivity[] {
      return this.activities
        .filter(activity => {
          // Filter by selected owners
          if (this.selectedOwners.length > 0 && !this.selectedOwners.includes(activity.ownerId)) {
            return false;
          }
          
          // Filter by modules
          if (this.filters.modules.length > 0 && !this.filters.modules.includes(activity.module)) {
            return false;
          }
          
          // Filter by activity types
          if (this.filters.activityTypes.length > 0 && 
              activity.activityType && 
              !this.filters.activityTypes.includes(activity.activityType)) {
            return false;
          }
          
          // Filter by activity categories
          if (this.filters.activityCategories.length > 0 && 
              activity.activityCategory && 
              !this.filters.activityCategories.includes(activity.activityCategory)) {
            return false;
          }
          
          return true;
        })
        .map(activity => ({
          ...activity,
          colorClass: ModuleColorMap[activity.module as ModuleType] || 'activity-default'
        }));
    },
    
    filteredOwners(): CompetenceOwner[] {
      if (!this.searchTerm) {
        return this.competenceOwners;
      }
      
      const term = this.searchTerm.toLowerCase();
      return this.competenceOwners.filter(owner => 
        owner.name.toLowerCase().includes(term) || 
        owner.competence.toLowerCase().includes(term) ||
        owner.position.toLowerCase().includes(term)
      );
    },
    
    uniqueModules(): string[] {
      return [...new Set(this.activities.map(a => a.module))];
    },
    
    uniqueActivityTypes(): string[] {
      return [...new Set(this.activities
        .filter(a => a.activityType)
        .map(a => a.activityType as string))];
    },
    
    uniqueActivityCategories(): string[] {
      return [...new Set(this.activities
        .filter(a => a.activityCategory)
        .map(a => a.activityCategory as string))];
    }
  },

  actions: {
    setSelectedOwners(ids: number[]) {
      this.selectedOwners = ids;
    },
    
    addSelectedOwner(id: number) {
      if (!this.selectedOwners.includes(id)) {
        this.selectedOwners.push(id);
      }
    },
    
    removeSelectedOwner(id: number) {
      this.selectedOwners = this.selectedOwners.filter(ownerId => ownerId !== id);
    },
    
    toggleModuleFilter(module: string) {
      const index = this.filters.modules.indexOf(module);
      if (index === -1) {
        this.filters.modules.push(module);
      } else {
        this.filters.modules.splice(index, 1);
      }
    },
    
    toggleActivityTypeFilter(type: string) {
      const index = this.filters.activityTypes.indexOf(type);
      if (index === -1) {
        this.filters.activityTypes.push(type);
      } else {
        this.filters.activityTypes.splice(index, 1);
      }
    },
    
    toggleActivityCategoryFilter(category: string) {
      const index = this.filters.activityCategories.indexOf(category);
      if (index === -1) {
        this.filters.activityCategories.push(category);
      } else {
        this.filters.activityCategories.splice(index, 1);
      }
    },
    
    setSearchTerm(term: string) {
      this.searchTerm = term;
    },
    
    resetFilters() {
      this.filters = {
        modules: [],
        activityTypes: [],
        activityCategories: [],
        all: true
      };
    },
    
    addActivity(activity: Omit<CalendarActivity, 'id'>) {
      const newId = Math.max(0, ...this.activities.map(a => a.id)) + 1;
      this.activities.push({
        id: newId,
        ...activity
      });
    },
    
    updateActivity(activity: CalendarActivity) {
      const index = this.activities.findIndex(a => a.id === activity.id);
      if (index !== -1) {
        this.activities[index] = activity;
      }
    },
    
    deleteActivity(id: number) {
      this.activities = this.activities.filter(a => a.id !== id);
    },
    
    setCurrentActivity(activity: CalendarActivity | null) {
      this.currentActivity = activity;
    },
    
    toggleActivityForm(show?: boolean) {
      this.showActivityForm = show !== undefined ? show : !this.showActivityForm;
    },
    
    toggleOwnerSearch(show?: boolean) {
      this.showOwnerSearch = show !== undefined ? show : !this.showOwnerSearch;
    },
    
    setCurrentDate(date: Date) {
      this.currentDate = date;
    }
  }
});