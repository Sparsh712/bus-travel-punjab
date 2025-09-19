export interface Stop {
  name: string;
  isMajor?: boolean;
}

export interface Route {
  id: string;
  busNumber: string;
  name: string;
  stops: Stop[];
  estimatedTime: number; // in minutes
  estimatedFare: number; // in INR
}

export enum MessageAuthor {
  USER = 'user',
  AI = 'ai',
}

export interface ChatMessage {
  author: MessageAuthor;
  text: string;
  routeSuggestion?: Route;
}

// New Types for Booking App
export type View = 'LOGIN' | 'COMMUTER' | 'ADMIN' | 'BOOKING' | 'PAYMENT';

export interface StopDetails {
  stop_name: string;
  eta: number; // minutes
}

export interface BusTrip {
  id: string;
  vehicle_id: string;
  route: string;
  bus_type: 'AC' | 'Non-AC';
  on_time: boolean;
  stops: StopDetails[];
  capacity: number;
}