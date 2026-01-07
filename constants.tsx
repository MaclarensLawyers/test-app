
import { University, Stage, CandidateType, ReminderFrequency } from './types';

export const INITIAL_UNIVERSITIES: University[] = [
  { id: '1', name: 'University of Milan', city: 'Milan', website: 'https://www.unimi.it', description: 'One of the largest universities in Europe.' },
  { id: '2', name: 'Sapienza University of Rome', city: 'Rome', website: 'https://www.uniroma1.it', description: 'Historically one of the most prestigious Italian universities.' },
  { id: '3', name: 'University of Pavia', city: 'Pavia', website: 'https://web.unipv.it', description: 'Renowned for its medical faculty.' },
  { id: '4', name: 'University of Bologna', city: 'Bologna', website: 'https://www.unibo.it', description: 'The oldest university in the Western world.' },
];

export const INITIAL_STAGES: Stage[] = [
  { id: 's1', name: 'Pre-Enrollment', order: 1 },
  { id: 's2', name: 'IMAT Registration', order: 2 },
  { id: 's3', name: 'Visa Application', order: 3 },
  { id: 's4', name: 'Enrollment', order: 4 },
];

export const EU_COUNTRIES = [
  'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark',
  'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy',
  'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Poland', 'Portugal',
  'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Norway', 'Iceland'
];
