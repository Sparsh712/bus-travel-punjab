import React, { useState, useMemo } from 'react';
import type { Route, BusTrip } from '../types'; // Make sure your types file exports both
import { RouteResultCard } from './RouteResultCard';
import { busData } from '../data/busData';
import { ALL_STOPS } from '../constants'; // This should contain all possible stop names

// --- ICONS & HELPER COMPONENTS ---

const LocationIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
        <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.1.4-.223.654-.369.395-.226.86-.52 1.358-.863.564-.406 1.258-1.015 1.94-1.765C15.53 14.945 16 13.825 16 12.5a6 6 0 10-12 0c0 1.325.47 2.445 1.157 3.328.682.75 1.376 1.36 1.94 1.765.498.343.963.637 1.358.863.254.146.468.27.654.369a5.741 5.741 0 00.281.14l.018.008.006.003zM10 8.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
    </svg>
);

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
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder={placeholder}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                autoComplete="off"
            />
            <LocationIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            {showSuggestions && suggestions.length > 0 && value.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {suggestions.map(stop => (
                        <li key={stop}
                            onMouseDown={() => handleSelect(stop)}
                            className="px-4 py-2 cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-700">
                            {stop}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// --- ADAPTER FUNCTION TO CONVERT DATA ---

const adaptBusDataToRoutes = (data: BusTrip[]): Route[] => {
    return data.map(trip => {
        const lastStop = trip.stops[trip.stops.length - 1];
        return {
            id: trip.id,
            busNumber: trip.vehicle_id,
            name: trip.route,
            stops: trip.stops.map(stop => ({
                name: stop.stop_name,
                isMajor: false,
                eta: stop.eta, // <-- ADD THIS LINE
            })),
            estimatedTime: lastStop ? lastStop.eta : 0,
            estimatedFare: 30,
        };
    });
};

// --- DATA INITIALIZATION ---

const ROUTES: Route[] = adaptBusDataToRoutes(busData);

// --- MAIN COMPONENT ---

const RoutePlanner: React.FC = () => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [results, setResults] = useState<Route[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = () => {
        const fromVal = from.trim().toLowerCase();
        const toVal = to.trim().toLowerCase();

        if (!fromVal || !toVal) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            const filteredRoutes = ROUTES.filter(route => {
                const stops = route.stops.map(s => (s.name || '').trim().toLowerCase());
                
                // Use findIndex with 'includes' for partial matching
                const fromIndex = stops.findIndex(stop => stop.includes(fromVal));
                const toIndex = stops.findIndex(stop => stop.includes(toVal));

                return fromIndex > -1 && toIndex > -1 && fromIndex < toIndex;
            });

            setResults(filteredRoutes);
            setIsLoading(false);
        }, 300);
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
            <h2 className="text-2xl font-bold text-orange-400 mb-2">Find Your Route</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Enter your start and end points to find the best bus route.</p>

            <div className="flex flex-col md:flex-row items-center gap-2 mb-6">
                <AutocompleteInput value={from} setValue={setFrom} suggestions={fromSuggestions} placeholder="From" />
                <button onClick={handleSwap} aria-label="swap" className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                    <SwapIcon className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
                </button>
                <AutocompleteInput value={to} setValue={setTo} suggestions={toSuggestions} placeholder="To" />
                <button 
                    onClick={handleSearch} 
                    className="w-full md:w-auto mt-2 md:mt-0 flex justify-center items-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 transition-all"
                    disabled={isLoading}
                >
                    {isLoading ? <SpinnerIcon /> : 'Search'}
                </button>
            </div>

            <div className="space-y-3">
                {results === null && <p className="text-center text-gray-500">Enter your locations to begin your search.</p>}
                {results && results.length === 0 && <p className="text-center text-gray-500">No direct routes found for your search.</p>}
                {results && results.map((route, idx) => (
                    <RouteResultCard 
                        key={`${route.id}-${idx}`} 
                        route={route} 
                        from={from}
                        to={to}
                    />
                ))}
            </div>
        </div>
    );
};

export default RoutePlanner;