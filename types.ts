
export enum CandidateType {
  EU = 'EU',
  NON_EU = 'NON_EU',
  BOTH = 'BOTH'
}

export enum ReminderFrequency {
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  BIWEEKLY = 'Bi-weekly',
  NONE = 'None'
}

export interface University {
  id: string;
  name: string;
  city: string;
  website: string;
  description: string;
}

export interface Stage {
  id: string;
  name: string;
  order: number;
}

export interface Requirement {
  id: string;
  name: string;
  description?: string;
  dueBy?: string;
  appliesTo: CandidateType;
  universityId?: string; // Optional: applies to specific university
  reminderFrequency: ReminderFrequency;
  stageId: string;
}

export interface Deadline {
  id: string;
  name: string;
  date: string;
  appliesTo: CandidateType;
  universityId?: string;
  clientId?: string;
  reminderFrequency: ReminderFrequency;
  description?: string;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  passportCountry: string;
  residenceCountry: string;
  candidateType: CandidateType;
  preferredUniversities: string[]; // IDs
  completedRequirementIds: string[];
  files: ClientFile[];
  createdAt: string;
}

export interface ClientFile {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  url: string;
}

export type AppView = 'DASHBOARD' | 'CLIENTS' | 'UNIVERSITIES' | 'DEADLINES' | 'REQUIREMENTS' | 'STAGES' | 'INTAKE';
