import React, { useState, useMemo } from 'react';

// --- DATA SOURCE ---
// The data is now included directly in this file to prevent import errors.
const busData = [
    { id: 'bus-001', vehicle_id: 'BT-01', route: 'Model Town to Liberty Market', fare_per_stop: 10, stops: [ { stop_name: 'Model Town Park', eta: 2 }, { stop_name: 'Kalma Chowk', eta: 8 }, { stop_name: 'Centre Point', eta: 15 }, { stop_name: 'Liberty Market', eta: 20 }, ], },
    { id: 'bus-002', vehicle_id: 'BT-02', route: 'Railway Station to DHA', fare_per_stop: 8, stops: [ { stop_name: 'Railway Station', eta: 3 }, { stop_name: 'Garhi Shahu', eta: 10 }, { stop_name: 'Dharampura', eta: 18 }, { stop_name: 'LUMS', eta: 25 }, { stop_name: 'Y-Block Market', eta: 30 }, ], },
    { id: 'bus-003', vehicle_id: 'BT-03', route: 'Thokar Niaz Baig to Anarkali', fare_per_stop: 9, stops: [ { stop_name: 'Thokar Niaz Baig', eta: 5 }, { stop_name: 'Multan Chungi', eta: 12 }, { stop_name: 'Chauburji', eta: 20 }, { stop_name: 'MAO College', eta: 25 }, { stop_name: 'Anarkali', eta: 30 }, ], },
    { id: 'bus-004', vehicle_id: 'BT-04', route: 'Gajumata to Azadi Chowk', fare_per_stop: 10, stops: [ { stop_name: 'Gajumata', eta: 5 }, { stop_name: 'Nishtar Colony', eta: 15}, { stop_name: 'Kalma Chowk', eta: 25 }, { stop_name: 'Ichhra', eta: 35 }, { stop_name: 'Data Darbar', eta: 45 }, { stop_name: 'Azadi Chowk', eta: 55 }, ], },
    { id: 'bus-005', vehicle_id: 'BT-05', route: 'Green Town to Shahdara', fare_per_stop: 9, stops: [ { stop_name: 'Green Town', eta: 5 }, { stop_name: 'Model Town', eta: 15 }, { stop_name: 'Canal Road', eta: 25 }, { stop_name: 'The Mall', eta: 35 }, { stop_name: 'Shahdara', eta: 50 }, ], },
    { id: 'bus-006', vehicle_id: 'BT-06', route: 'Johar Town to Mughalpura', fare_per_stop: 8, stops: [ { stop_name: 'Johar Town', eta: 5 }, { stop_name: 'Shaukat Khanum', eta: 10 }, { stop_name: 'Jinnah Hospital', eta: 20 }, { stop_name: 'Ferozepur Road', eta: 30 }, { stop_name: 'Mughalpura', eta: 45 }, ], },
    { id: 'bus-007', vehicle_id: 'BT-07', route: 'Cantt to Samanabad', fare_per_stop: 10, stops: [ { stop_name: 'Lahore Cantt', eta: 5 }, { stop_name: 'Fortress Stadium', eta: 10 }, { stop_name: 'Saddar', eta: 15 }, { stop_name: 'Jail Road', eta: 25 }, { stop_name: 'Samanabad', eta: 35 }, ], },
    { id: 'bus-008', vehicle_id: 'BT-08', route: 'Walled City to Gulberg', fare_per_stop: 7, stops: [ { stop_name: 'Delhi Gate', eta: 5 }, { stop_name: 'Anarkali', eta: 10 }, { stop_name: 'Civil Lines', eta: 18 }, { stop_name: 'Shadman', eta: 25 }, { stop_name: 'Gulberg Main Market', eta: 35 }, ], }
];

// --- CONSTANTS ---
// ALL_STOPS is now derived directly from the busData
const ALL_STOPS = [...new Set(busData.flatMap(trip => trip.stops.map(stop => stop.stop_name)))];

// --- TYPES ---
// Types are now defined in this file to prevent import errors.
interface BusTrip {
    id: string; route: string; vehicle_id: string; fare_per_stop: number;
    stops: { stop_name: string; eta: number; }[];
}
interface RouteStop { name: string; eta: number; }
interface Route {
    id: string; busNumber: string; name: string; stops: RouteStop[]; fare_per_stop: number;
    journeyFare?: number; journeyStops?: RouteStop[]; journeyTime?: number;
}

// --- CHILD COMPONENTS ---
// All child components (Icons, Cards) are now included directly in this file.

const LocationIcon = ({ className }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}><path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.1.4-.223.654-.369.395-.226.86-.52 1.358-.863.564-.406 1.258-1.015 1.94-1.765C15.53 14.945 16 13.825 16 12.5a6 6 0 10-12 0c0 1.325.47 2.445 1.157 3.328.682.75 1.376 1.36 1.94 1.765.498.343.963.637 1.358.863.254.146.468.27.654.369a5.741 5.741 0 00.281.14l.018.008.006.003zM10 8.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" /></svg> );
const SwapIcon = ({ className }: { className?: string }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg> );
const SpinnerIcon = () => ( <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> );
const ClockIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const RupeeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 4h4m5 4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2z" /></svg>);
const BusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H3" /><path d="M12 20h2.133a4 4 0 003.867-2.857L20 12l-2-7H6l-2 7 2.143 5.143A4 4 0 009.867 20H12z" /></svg>);

const RouteResultCard: React.FC<{ route: Route }> = ({ route }) => {
    const fromStopName = route.journeyStops?.[0]?.name || 'Start';
    const toStopName = route.journeyStops?.[route.journeyStops.length - 1]?.name || 'End';
    const cardTitle = `${fromStopName} to ${toStopName}`;
    const journeyStopsDisplay = route.journeyStops?.map(s => s.name).join(' → ') || 'Not available.';
    return (
        <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <p className="text-xs text-orange-500 font-semibold uppercase tracking-wider">{route.busNumber}</p>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{cardTitle}</h3>
                </div>
                <div className="text-right flex-shrink-0">
                    <div className="flex items-center justify-end font-bold text-lg text-green-600 dark:text-green-400">
                        <RupeeIcon /> ₹{route.journeyFare ?? 'N/A'}
                    </div>
                    <div className="flex items-center justify-end text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <ClockIcon /> {route.journeyTime ?? 'N/A'} mins
                    </div>
                </div>
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"><BusIcon />Stops for your journey:</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-100 dark:bg-gray-700 p-2 rounded-md">{journeyStopsDisplay}</p>
            </div>
        </div>
    );
};

const AutocompleteInput = ({ value, setValue, suggestions, placeholder }: { value: string, setValue: (val: string) => void, suggestions: string[], placeholder: string }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const handleSelect = (stop: string) => {
        setValue(stop);
        setShowSuggestions(false);
    };
    return (
        <div className="relative w-full">
            <input type="text" value={value} onChange={(e) => { setValue(e.target.value); if (!showSuggestions) setShowSuggestions(true); }} onFocus={() => setShowSuggestions(true)} onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} placeholder={placeholder} className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white" autoComplete="off" />
            <LocationIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            {showSuggestions && suggestions.length > 0 && value.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {suggestions.map(stop => (
                        <li
                            key={stop}
                            onMouseDown={() => handleSelect(stop)}
                            className="px-4 py-2 cursor-pointer hover:bg-orange-600/20 text-white"
                        >
                            {stop}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// --- ADAPTER FUNCTION ---
const adaptBusDataToRoutes = (data: BusTrip[]): Route[] => {
    return data.map(trip => ({
        id: trip.id,
        busNumber: trip.vehicle_id,
        name: trip.route,
        stops: trip.stops.map(stop => ({ name: stop.stop_name, eta: stop.eta })),
        fare_per_stop: trip.fare_per_stop,
    }));
};

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
        if (!fromVal || !toVal) { setResults([]); return; }

        setIsLoading(true);
        setTimeout(() => {
            const filteredRoutes = ROUTES.filter(route => {
                const stops = route.stops.map(s => s.name.trim().toLowerCase());
                const fromIndex = stops.findIndex(stop => stop.includes(fromVal));
                const toIndex = stops.findIndex(stop => stop.includes(toVal));
                return fromIndex > -1 && toIndex > -1 && fromIndex < toIndex;
            });

            // Dynamic calculation logic
            const journeyResults = filteredRoutes.map(route => {
                const stops = route.stops.map(s => s.name.trim().toLowerCase());
                const fromIndex = stops.findIndex(stop => stop.includes(fromVal));
                const toIndex = stops.findIndex(stop => stop.includes(toVal));
                
                const journeyStops = route.stops.slice(fromIndex, toIndex + 1);
                const stopsCount = toIndex - fromIndex;
                const journeyFare = stopsCount * route.fare_per_stop;
                const startTime = route.stops[fromIndex]?.eta || 0;
                const endTime = route.stops[toIndex]?.eta || 0;
                const journeyTime = endTime - startTime;

                return { ...route, journeyFare, journeyStops, journeyTime };
            });

            setResults(journeyResults);
            setIsLoading(false);
        }, 500);
    };
    
    const handleSwap = () => { setFrom(to); setTo(from); };

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
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-2xl font-bold text-orange-400 mb-2">Find Your Route</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Enter your start and end points to find the best bus route.</p>

            <div className="flex flex-col md:flex-row items-center gap-2 mb-6">
                <AutocompleteInput value={from} setValue={setFrom} suggestions={fromSuggestions} placeholder="From" />
                <button onClick={handleSwap} aria-label="swap" className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                    <SwapIcon className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
                </button>
                <AutocompleteInput value={to} setValue={setTo} suggestions={toSuggestions} placeholder="To" />
                <button onClick={handleSearch} className="w-full md:w-auto mt-2 md:mt-0 flex justify-center items-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 transition-all" disabled={isLoading}>
                    {isLoading ? <SpinnerIcon /> : 'Search'}
                </button>
            </div>

            <div className="space-y-4">
                {results === null && <p className="text-center text-gray-500 pt-4">Enter your locations to begin your search.</p>}
                {results?.length === 0 && <p className="text-center text-gray-500 pt-4">No direct routes found for your search.</p>}
                {results?.map((route, idx) => ( <RouteResultCard key={`${route.id}-${idx}`} route={route} /> ))}
            </div>
        </div>
    );
};

export default RoutePlanner;

