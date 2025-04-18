import type { CalendarActivity, CompetenceOwner } from '@/stores/mpk/types/types';
import { ModuleType } from '@/stores/mpk/types/types';

export const mockActivities: CalendarActivity[] = [
  {
    id: 1,
    name: 'SLD Presentation',
    location: 'Room A',
    startDate: new Date('2025-03-27T10:00:00'),
    endDate: new Date('2025-03-27T11:00:00'),
    notes: 'Presentation on SLD topic',
    ownerId: 1,
    module: ModuleType.Training,
    activityType: 'Presentation',
    activityCategory: 'Training'
  },
  {
    id: 2,
    name: 'Weekly Discussion',
    location: 'Room B',
    startDate: new Date('2025-03-28T10:00:00'),
    endDate: new Date('2025-03-28T11:00:00'),
    notes: 'Weekly discussion',
    ownerId: 2,
    module: ModuleType.Convenience,
    activityType: 'Meeting',
    activityCategory: 'Discussion'
  },
  {
    id: 3,
    name: 'Monthly Team Meeting',
    location: 'Conference Room',
    startDate: new Date('2025-03-26T14:00:00'),
    endDate: new Date('2025-03-26T15:30:00'),
    notes: 'Monthly team progress review',
    ownerId: 3,
    module: ModuleType.Parent,
    activityType: 'Meeting',
    activityCategory: 'Team'
  },
  {
    id: 4,
    name: 'Technical Workshop',
    location: 'Training Center',
    startDate: new Date('2025-03-25T09:00:00'),
    endDate: new Date('2025-03-25T12:00:00'),
    notes: 'Workshop on new technologies',
    ownerId: 4,
    module: ModuleType.Core,
    activityType: 'Workshop',
    activityCategory: 'Technical'
  },
  {
    id: 5,
    name: 'Staff Orientation',
    location: 'Main Hall',
    startDate: new Date('2025-03-24T13:00:00'),
    endDate: new Date('2025-03-24T15:00:00'),
    notes: 'Orientation for new staff members',
    ownerId: 5,
    module: ModuleType.Related,
    activityType: 'Orientation',
    activityCategory: 'HR'
  },
  {
    id: 6,
    name: 'Project Kickoff',
    location: 'Room C',
    startDate: new Date('2025-03-26T09:00:00'),
    endDate: new Date('2025-03-26T10:30:00'),
    notes: 'Kickoff meeting for new project',
    ownerId: 6,
    module: ModuleType.Core,
    activityType: 'Meeting',
    activityCategory: 'Project'
  }
];

export const mockCompetenceOwners: CompetenceOwner[] = [
  {
    id: 1,
    name: 'MUHAMMAD ALI BIN ABDULLAH',
    competence: 'Project Management',
    identificationNumber: '78XXXXX-XXXXX',
    position: 'Senior Manager'
  },
  {
    id: 2,
    name: 'MUHAMMAD FAIZAL BIN UDA',
    competence: 'Software Development',
    identificationNumber: '80XXXX-XX-XXXX',
    position: 'Lead Developer'
  },
  {
    id: 3,
    name: 'MUHAMMAD HARRUDDIN BIN SHAMSUL',
    competence: 'Data Analysis',
    identificationNumber: '76XXXXX-XXXXX',
    position: 'Data Scientist'
  },
  {
    id: 4,
    name: 'NORDIN BIN NISAH',
    competence: 'Training',
    identificationNumber: '73XXXXX-XXXXX',
    position: 'Training Coordinator'
  },
  {
    id: 5,
    name: 'NORMAN BIN HAKIM',
    competence: 'HR Management',
    identificationNumber: '69XXXX-XX-XXXX',
    position: 'HR Manager'
  },
  {
    id: 6,
    name: 'NOR IHSAN BIN ZAIN',
    competence: 'Technical Support',
    identificationNumber: '82XXXX-XX-XXXX',
    position: 'Support Lead'
  },
  {
    id: 7,
    name: 'NOR AZLINA BINTI GHAIZ',
    competence: 'Quality Assurance',
    identificationNumber: '90XXXX-XX-XXXX',
    position: 'QA Lead'
  },
  {
    id: 8,
    name: 'OSMAN BIN JALANI',
    competence: 'Network Administration',
    identificationNumber: '77XXXXX-XXXXX',
    position: 'Network Admin'
  },
  {
    id: 9,
    name: 'ROSMAN BIN ALWI',
    competence: 'System Architecture',
    identificationNumber: '72XXXXX-XXXXX',
    position: 'System Architect'
  }
];
