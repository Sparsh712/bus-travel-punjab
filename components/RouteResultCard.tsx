import React from 'react';
import type { Route } from '../types';
import { BusIcon } from './icons/BusIcon';
import { ClockIcon } from './icons/ClockIcon';
import { MoneyIcon } from './icons/MoneyIcon';
import { LocationMarkerIcon } from './icons/LocationMarkerIcon';

export const RouteResultCard: React.FC<{ route: Route }> = ({ route }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-300 rounded-full flex items-center justify-center">
            <BusIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-lg text-gray-800 dark:text-white">{route.busNumber}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">{route.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-6 mt-3 sm:mt-0 text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300" title="Estimated Time">
            <ClockIcon className="w-5 h-5" />
            <span>{route.estimatedTime} min</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300" title="Estimated Fare">
            <MoneyIcon className="w-5 h-5" />
            <span>₹{route.estimatedFare}</span>
          </div>
        </div>
      </div>
      <div>
        <h5 className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 mb-2">Key Stops</h5>
        <div className="flex flex-wrap gap-2">
          {route.stops.filter(s => s.isMajor).map(stop => (
            <div key={stop.name} className="flex items-center gap-1.5 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs px-2 py-1 rounded-full border border-gray-200 dark:border-gray-500">
              <LocationMarkerIcon className="w-3 h-3 text-orange-500" />
              {stop.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};