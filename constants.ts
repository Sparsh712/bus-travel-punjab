import type { Route } from './types';

export const SEAT_PRICE = 15; // Price per seat in INR

export const ROUTES: Route[] = [
  {
    id: 'MBS-1',
    busNumber: 'Metro Bus',
    name: 'Gajjumata to Shahdara',
    stops: [
      { name: 'Gajjumata', isMajor: true },
      { name: 'Nishtar Colony' },
      { name: 'Kamahan' },
      { name: 'Chungi Amar Sidhu' },
      { name: 'Model Town' },
      { name: 'Kalma Chowk', isMajor: true },
      { name: 'Ichhra' },
      { name: 'MAO College' },
      { name: 'Azadi Chowk', isMajor: true },
      { name: 'Shahdara', isMajor: true },
    ],
    estimatedTime: 65,
    estimatedFare: 45,
  },
  {
    id: 'OL-1',
    busNumber: 'Orange Line',
    name: 'Ali Town to Dera Gujran',
    stops: [
      { name: 'Ali Town', isMajor: true },
      { name: 'Thokar Niaz Baig' },
      { name: 'Canal View' },
      { name: 'Hanjarwal' },
      { name: 'Chauburji' },
      { name: 'Anarkali', isMajor: true },
      { name: 'Railway Station', isMajor: true },
      { name: 'UET' },
      { name: 'Baghbanpura' },
      { name: 'Dera Gujran', isMajor: true },
    ],
    estimatedTime: 75,
    estimatedFare: 50,
  },
  {
    id: 'S-B2',
    busNumber: 'Speedo B2',
    name: 'Railway Station to Valencia Town',
    stops: [
      { name: 'Lahore Railway Station', isMajor: true },
      { name: 'Shimla Pahari' },
      { name: 'Jail Road' },
      { name: 'Canal Road' },
      { name: 'Muslim Town' },
      { name: 'Faisal Town' },
      { name: 'Jinnah Hospital' },
      { name: 'Wapda Town' },
      { name: 'Valencia Town', isMajor: true },
    ],
    estimatedTime: 55,
    estimatedFare: 25,
  },
  {
    id: 'S-B12',
    busNumber: 'Speedo B12',
    name: 'Bata Pur to Daroghawala',
    stops: [
      { name: 'Bata Pur', isMajor: true },
      { name: 'Manawan' },
      { name: 'Daroghawala', isMajor: true },
      { name: 'Shalimar Gardens' },
      { name: 'Garhi Shahu' },
      { name: 'Lahore Railway Station', isMajor: true },
    ],
    estimatedTime: 40,
    estimatedFare: 20,
  },
];

export const ALL_STOPS = [...new Set(ROUTES.flatMap(r => r.stops.map(s => s.name)))];