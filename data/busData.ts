
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
      { stop_name: 'Model Town Park', eta: 2 },
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
];
