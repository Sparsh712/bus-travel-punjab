import type { BusTrip } from '../types';

export const busData: BusTrip[] = [
  {
    id: 'bus-001',
    vehicle_id: 'LHR-A-123',
    route: 'Model Town to Liberty Market',
    bus_type: 'AC',
    on_time: true,
    capacity: 40,
    stops: [
      { stop_name: 'Model Town', eta: 2 },
      { stop_name: 'Kalma Chowk', eta: 8 },
      { stop_name: 'Centre Point', eta: 15 },
      { stop_name: 'Liberty Market', eta: 20 },
    ],
  },
  {
    id: 'bus-002',
    vehicle_id: 'LHR-B-456',
    route: 'Railway Station to DHA',
    bus_type: 'Non-AC',
    on_time: false,
    capacity: 40,
    stops: [
      { stop_name: 'Railway Station', eta: 3 },
      { stop_name: 'Garhi Shahu', eta: 10 },
      { stop_name: 'Dharampura', eta: 18 },
      { stop_name: 'LUMS', eta: 25 },
      { stop_name: 'Y-Block Market', eta: 30 },
    ],
  },
  {
    id: 'bus-003',
    vehicle_id: 'LHR-C-789',
    route: 'Thokar Niaz Baig to Anarkali',
    bus_type: 'AC',
    on_time: true,
    capacity: 40,
    stops: [
      { stop_name: 'Thokar Niaz Baig', eta: 5 },
      { stop_name: 'Multan Chungi', eta: 12 },
      { stop_name: 'Chauburji', eta: 20 },
      { stop_name: 'MAO College', eta: 25 },
      { stop_name: 'Anarkali', eta: 30 },
    ],
  },

  {
    id: 'bus-LDH-1',
    vehicle_id: 'PB10-G-1122',
    route: 'Railway Station to Sarabha Nagar',
    bus_type: 'AC',
    on_time: true,
    capacity: 50,
    stops: [
      { stop_name: 'Ludhiana Railway Station', eta: 0 },
      { stop_name: 'Clock Tower', eta: 7 },
      { stop_name: 'Chaura Bazar', eta: 12 },
      { stop_name: 'PAU Gate 1', eta: 20 },
      { stop_name: 'Sarabha Nagar Market', eta: 28 },
    ],
  },
  {
    id: 'bus-LDH-2',
    vehicle_id: 'PB10-H-3344',
    route: 'Samrala Chowk to Model Town',
    bus_type: 'Non-AC',
    on_time: true,
    capacity: 50,
    stops: [
      { stop_name: 'Samrala Chowk', eta: 0 },
      { stop_name: 'CMC Hospital', eta: 8 },
      { stop_name: 'Dandi Swami Chowk', eta: 15 },
      { stop_name: 'Feroze Gandhi Market', eta: 22 },
      { stop_name: 'Ludhiana Model Town', eta: 30 },
    ],
  },
];