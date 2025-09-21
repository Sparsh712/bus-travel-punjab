
import React, { useState, useMemo } from 'react';
import { ROUTES, ALL_STOPS } from '../constants';
import type { Route } from '../types';
import { RouteResultCard } from './RouteResultCard';
import { LocationIcon } from './icons/LocationIcon';

const RoutePlanner: React.FC = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [results, setResults] = useState<Route[] | null>(null);

  const handleSearch = () => {
    if (!from || !to) {
      setResults([]);
      return;
    }
    const filteredRoutes = ROUTES.filter(route => {
      const stops = route.stops.map(s => s.name.toLowerCase());
      return stops.includes(from.toLowerCase()) && stops.includes(to.toLowerCase());
    });
    setResults(filteredRoutes);
  };

  const fromSuggestions = useMemo(() => {
    if (!from) return [];
    return ALL_STOPS.filter(stop => stop.toLowerCase().includes(from.toLowerCase())).slice(0, 5);
  }, [from]);

  const toSuggestions = useMemo(() => {
    if (!to) return [];
    return ALL_STOPS.filter(stop => stop.toLowerCase().includes(to.toLowerCase())).slice(0, 5);
  }, [to]);

  const AutocompleteInput = ({ value, setValue, suggestions, placeholder }: { value: string, setValue: (val: string) => void, suggestions: string[], placeholder: string }) => (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
      <LocationIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      {suggestions.length > 0 && value.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map(stop => (
            <li key={stop}
              onClick={() => { setValue(stop); }}
              className="px-4 py-2 cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-700">
              {stop}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Find Your Route</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Enter your start and end points to find the best bus route.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <AutocompleteInput value={from} setValue={setFrom} suggestions={fromSuggestions} placeholder="From: e.g., Kalma Chowk" />
        <AutocompleteInput value={to} setValue={setTo} suggestions={toSuggestions} placeholder="To: e.g., Azadi Chowk" />
      </div>

      <button
        onClick={handleSearch}
        className="w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300 shadow-md"
      >
        Search Routes
      </button>

      <div className="mt-8">
        {results === null && (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>Your journey plan will appear here.</p>
          </div>
        )}
        {results && results.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Available Routes</h3>
            {results.map(route => <RouteResultCard key={route.id} route={route} />)}
          </div>
        )}
        {results && results.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 p-8 border-2 border-dashed rounded-lg">
            <p className="font-semibold">No direct routes found.</p>
            <p>Try using our AI Assistant for more complex travel queries!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutePlanner;
