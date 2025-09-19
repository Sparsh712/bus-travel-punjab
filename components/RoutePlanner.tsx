
import React, { useState, useMemo } from 'react';
import { ROUTES, ALL_STOPS } from '../constants';
import type { Route } from '../types';
import { RouteResultCard } from './RouteResultCard';
import { LocationIcon } from './icons/LocationIcon';

const SwapIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
);

const SpinnerIcon = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const AutocompleteInput = ({ value, setValue, suggestions, placeholder }: { value: string, setValue: (val: string) => void, suggestions: string[], placeholder: string }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleSelect = (stop: string) => {
        setValue(stop);
        setShowSuggestions(false);
    };

    return (
        <div className="relative w-full">
            <input
                type="text"
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    if (!showSuggestions) setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} // Delay allows click event to register
                placeholder={placeholder}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                autoComplete="off"
            />
            <LocationIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            {showSuggestions && suggestions.length > 0 && value.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {suggestions.map(stop => (
                        <li key={stop}
                            onMouseDown={() => handleSelect(stop)} // Use onMouseDown to prevent blur from firing first
                            className="px-4 py-2 cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-700">
                            {stop}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


const RoutePlanner: React.FC = () => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [results, setResults] = useState<Route[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = () => {
        if (!from || !to) {
            setResults([]);
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            const filteredRoutes = ROUTES.filter(route => {
                const stops = route.stops.map(s => s.name.toLowerCase());
                const fromIndex = stops.indexOf(from.toLowerCase());
                const toIndex = stops.indexOf(to.toLowerCase());
                return fromIndex > -1 && toIndex > -1 && fromIndex < toIndex;
            });
            setResults(filteredRoutes);
            setIsLoading(false);
        }, 500);
    };
    
    const handleSwap = () => {
        setFrom(to);
        setTo(from);
    };

    const fromSuggestions = useMemo(() => {
        if (!from) return [];
        const fromLower = from.toLowerCase();
        return ALL_STOPS.filter(stop => stop.toLowerCase().includes(fromLower) && stop.toLowerCase() !== fromLower).slice(0, 5);
    }, [from]);

    const toSuggestions = useMemo(() => {
        if (!to) return [];
        const toLower = to.toLowerCase();
        return ALL_STOPS.filter(stop => stop.toLowerCase().includes(toLower) && stop.toLowerCase() !== toLower).slice(0, 5);
    }, [to]);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Find Your Route</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Enter your start and end points to find the best bus route.</p>

            <div className="flex flex-col md:flex-row items-center gap-2 mb-6">
                <div className="w-full flex-1">
                    <AutocompleteInput value={from} setValue={setFrom} suggestions={fromSuggestions} placeholder="From: e.g., Kalma Chowk" />
                </div>
                <button
                    onClick={handleSwap}
                    className="p-2 rounded-full text-gray-500 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-transform duration-200 ease-in-out hover:scale-110"
                    aria-label="Swap locations"
                >
                    <SwapIcon className="w-5 h-5 md:rotate-0 rotate-90" />
                </button>
                <div className="w-full flex-1">
                    <AutocompleteInput value={to} setValue={setTo} suggestions={toSuggestions} placeholder="To: e.g., Azadi Chowk" />
                </div>
            </div>

            <button
                onClick={handleSearch}
                disabled={isLoading || !from || !to}
                className="w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300 shadow-md flex items-center justify-center disabled:bg-orange-400 disabled:scale-100 disabled:cursor-not-allowed"
            >
                {isLoading ? <SpinnerIcon /> : 'Search Routes'}
            </button>

            <div className="mt-8">
                {results === null && (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        <p>Your journey plan will appear here.</p>
                    </div>
                )}
                {results && results.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold dark:text-white">Available Routes</h3>
                        {results.map(route => <RouteResultCard key={route.id} route={route} />)}
                    </div>
                )}
                {results && results.length === 0 && (
                    <div className="text-center text-gray-500 dark:text-gray-400 p-8 border-2 border-dashed rounded-lg">
                        <p className="font-semibold">No direct routes found.</p>
                        <p>Try checking your spelling or select different stops.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoutePlanner;