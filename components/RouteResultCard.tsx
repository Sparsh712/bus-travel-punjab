import React from 'react';
import type { Route } from '../types';

// --- ICONS (assuming these are in a separate folder) ---

const BusIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
        <path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" />
    </svg>
);
const ClockIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const MoneyIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const LocationMarkerIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
        <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.1.4-.223.654-.369.395-.226.86-.52 1.358-.863.564-.406 1.258-1.015 1.94-1.765C15.53 14.945 16 13.825 16 12.5a6 6 0 10-12 0c0 1.325.47 2.445 1.157 3.328.682.75 1.376 1.36 1.94 1.765.498.343.963.637 1.358.863.254.146.468.27.654.369a5.741 5.741 0 00.281.14l.018.008.006.003zM10 8.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
    </svg>
);

// --- MAIN COMPONENT ---

export const RouteResultCard: React.FC<{ route: Route, from: string, to: string }> = ({ route, from, to }) => {
    const fromLower = from.trim().toLowerCase();
    const toLower = to.trim().toLowerCase();

    // --- CALCULATION LOGIC ---
    // 1. Find the start and end index for the user's trip
    const startIndex = route.stops.findIndex(stop => stop.name.toLowerCase().includes(fromLower));
    const endIndex = route.stops.findIndex(stop => stop.name.toLowerCase().includes(toLower));

    let tripDuration = route.estimatedTime; // Default to full route time
    let tripFare = route.estimatedFare;     // Default to full route fare
    
    // 2. If valid stops are found, calculate the specific ETA and Fare
    if (startIndex > -1 && endIndex > -1 && startIndex < endIndex) {
        const startStop = route.stops[startIndex];
        const endStop = route.stops[endIndex];

        // Calculate ETA difference
        tripDuration = endStop.eta - startStop.eta;
        
        // Calculate Fare (e.g., ₹10 base fare + ₹1.5 per minute)
        const baseFare = 10;
        const ratePerMinute = 1.5;
        tripFare = baseFare + (tripDuration * ratePerMinute);
    }
    
    return (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <BusIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-gray-800 dark:text-white">
                            {route.busNumber}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{route.name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-6 mt-3 sm:mt-0 text-sm w-full sm:w-auto justify-around">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300" title="Estimated Trip Time">
                        <ClockIcon className="w-5 h-5" />
                        <span>{tripDuration} min</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300" title="Estimated Trip Fare">
                        <MoneyIcon className="w-5 h-5" />
                        <span>₹{tripFare.toFixed(0)}</span>
                    </div>
                </div>
            </div>
            <div>
                <h5 className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 mb-2">Your Trip Segment</h5>
                <div className="flex flex-wrap gap-2">
                    {route.stops.map((stop, i) => {
                        // Check if the current stop is part of the user's trip segment
                        const isInSegment = startIndex > -1 && endIndex > -1 && i >= startIndex && i <= endIndex;

                        const highlightClass = isInSegment
                            ? 'bg-orange-500 text-white border-orange-600 font-semibold' // Highlighted style
                            : 'bg-white dark:bg-gray-600 border-gray-200 dark:border-gray-500'; // Default style

                        return (
                            <div
                                key={`${stop.name}-${i}`}
                                className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border transition-colors ${highlightClass}`}
                            >
                                <LocationMarkerIcon className={`w-3 h-3 ${isInSegment ? 'text-white' : 'text-orange-500'}`} />
                                {stop.name}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};