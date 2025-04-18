export interface CalendarActivity {
  id: number;
  name: string;
  location: string;
  startDate: Date;
  endDate: Date;
  notes: string;
  ownerId: number;
  module: string;
  activityType?: string;
  activityCategory?: string;
  colorClass?: string;
}

export interface CompetenceOwner {
  id: number;
  name: string;
  competence: string;
  identificationNumber: string;
  position: string;
}

export interface CalendarFilter {
  modules: string[];
  activityTypes: string[];
  activityCategories: string[];
  all: boolean;
}

export enum ModuleType {
  Training = 'Training',
  Convenience = 'Convenience',
  Parent = 'Parent',
  Related = 'Related',
  Core = 'Core'
}

export const ModuleColorMap = {
  [ModuleType.Training]: 'activity-training',
  [ModuleType.Convenience]: 'activity-convenience',
  [ModuleType.Parent]: 'activity-parent',
  [ModuleType.Related]: 'activity-related',
  [ModuleType.Core]: 'activity-core'
};
