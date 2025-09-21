import React, { useState, useRef, useEffect } from 'react';

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
const ALL_STOPS = [...new Set(busData.flatMap(trip => trip.stops.map(stop => stop.stop_name)))];

// --- TYPES ---
// Unified types consistent with RoutePlanner
interface BusTrip {
    id: string; route: string; vehicle_id: string; fare_per_stop: number;
    stops: { stop_name: string; eta: number; }[];
}
interface RouteStop { name: string; eta: number; }
interface Route {
    id: string; busNumber: string; name: string; stops: RouteStop[]; fare_per_stop: number;
    journeyFare?: number; journeyStops?: RouteStop[]; journeyTime?: number;
}
enum MessageAuthor { USER = 'user', AI = 'ai' }
interface ChatMessage {
    author: MessageAuthor;
    text: string;
    routeSuggestion?: Route; // Use the unified Route type
}

// --- CHILD COMPONENTS & ICONS ---
// All components are now included directly in this file.
const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => ( <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L13 12l-1.293 1.293a1 1 0 01-1.414 0L8 10.414a1 1 0 010-1.414L10.293 6.707a1 1 0 011.414 0L13 9.414l1.293-1.293a1 1 0 011.414 0L17 9.414 19 7.414" /></svg> );
const UserIcon: React.FC<{ className?: string }> = ({ className }) => ( <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> );
const ClockIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const RupeeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 4h4m5 4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2z" /></svg>);
const BusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H3" /><path d="M12 20h2.133a4 4 0 003.867-2.857L20 12l-2-7H6l-2 7 2.143 5.143A4 4 0 009.867 20H12z" /></svg>);

// Using the same RouteResultCard component as the RoutePlanner for consistency
const RouteResultCard: React.FC<{ route: Route }> = ({ route }) => {
    const fromStopName = route.journeyStops?.[0]?.name || 'Start';
    const toStopName = route.journeyStops?.[route.journeyStops.length - 1]?.name || 'End';
    const cardTitle = `${fromStopName} to ${toStopName}`;
    const journeyStopsDisplay = route.journeyStops?.map(s => s.name).join(' → ') || 'Not available.';

    return (
        <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 mt-2 bg-gray-50 dark:bg-gray-800 shadow-sm">
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

// --- ADAPTER FUNCTION & DATA PREP ---
const adaptBusDataToRoutes = (data: BusTrip[]): Route[] => {
    return data.map(trip => ({
        id: trip.id, busNumber: trip.vehicle_id, name: trip.route,
        stops: trip.stops.map(stop => ({ name: stop.stop_name, eta: stop.eta })),
        fare_per_stop: trip.fare_per_stop,
    }));
};
const ROUTES: Route[] = adaptBusDataToRoutes(busData);

// --- ADVANCED AI LOGIC ---
enum Intent { TRAVEL_QUERY, APP_NAVIGATION, UNKNOWN, CONTEXTUAL_QUERY }
enum AppNavigationTopic { LIVE_MAP, ROUTE_PLANNER, LOGOUT, FARE_INFO, SHOW_COMPLETE_ROUTE, CHANGE_LANGUAGE }

const appNavigationResponses = new Map<AppNavigationTopic, string>([
    [AppNavigationTopic.LIVE_MAP, "You can see all buses on the live map by clicking the 'Live Bus Map' button in the header navigation."],
    [AppNavigationTopic.ROUTE_PLANNER, "To find the best route for your journey, please use the 'Route Planner' tab in the main navigation."],
    [AppNavigationTopic.LOGOUT, "To log out of your account, simply click the 'Logout' button in the top-right corner."],
    [AppNavigationTopic.FARE_INFO, "Fares are calculated based on the number of stops. To get a specific fare, please ask me to find a route for you, like 'from [place] to [place]'."],
    [AppNavigationTopic.CHANGE_LANGUAGE, "You can change the language by clicking the language toggle button in the top-right corner."]
]);

const classifyUserIntent = async (query: string, context: Route | null): Promise<{ intent: Intent; topic?: AppNavigationTopic }> => {
    await new Promise(res => setTimeout(res, 300));
    const lowerCaseQuery = query.toLowerCase();
    if (context) {
        if (lowerCaseQuery === 'fare' || lowerCaseQuery === 'cost' || lowerCaseQuery === 'price' || lowerCaseQuery === 'how much') {
            return { intent: Intent.CONTEXTUAL_QUERY, topic: AppNavigationTopic.FARE_INFO };
        }
        if (lowerCaseQuery.includes('complete route') || lowerCaseQuery.includes('all stops') || lowerCaseQuery.includes('full route')) {
            return { intent: Intent.CONTEXTUAL_QUERY, topic: AppNavigationTopic.SHOW_COMPLETE_ROUTE };
        }
    }
    const navKeywords = ['map', 'plan', 'logout', 'sign out', 'language', 'hindi'];
    if (navKeywords.some(keyword => lowerCaseQuery.includes(keyword))) {
        if (lowerCaseQuery.includes('live') && lowerCaseQuery.includes('map')) return { intent: Intent.APP_NAVIGATION, topic: AppNavigationTopic.LIVE_MAP };
        if (lowerCaseQuery.includes('plan') || lowerCaseQuery.includes('planner')) return { intent: Intent.APP_NAVIGATION, topic: AppNavigationTopic.ROUTE_PLANNER };
        if (lowerCaseQuery.includes('logout') || lowerCaseQuery.includes('sign out')) return { intent: Intent.APP_NAVIGATION, topic: AppNavigationTopic.LOGOUT };
        if (lowerCaseQuery.includes('language') || lowerCaseQuery.includes('hindi')) return { intent: Intent.APP_NAVIGATION, topic: AppNavigationTopic.CHANGE_LANGUAGE };
    }
    const travelKeywords = ['from', 'to', 'bus', 'reach', 'get to', 'fare', 'price', 'ticket'];
    if (travelKeywords.some(keyword => lowerCaseQuery.includes(keyword))) {
        if ((lowerCaseQuery.includes('fare') || lowerCaseQuery.includes('price')) && !lowerCaseQuery.includes('from') && !lowerCaseQuery.includes('to')) {
            return { intent: Intent.APP_NAVIGATION, topic: AppNavigationTopic.FARE_INFO };
        }
        return { intent: Intent.TRAVEL_QUERY };
    }
    return { intent: Intent.UNKNOWN };
};

const calculateLevenshteinDistance = (a: string, b: string): number => {
    const matrix = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(null));
    for (let i = 0; i <= a.length; i++) { matrix[i][0] = i; }
    for (let j = 0; j <= b.length; j++) { matrix[0][j] = j; }
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
        }
    }
    return matrix[a.length][b.length];
};

const getSmartTravelAdvice = async (query: string): Promise<{ summary: string; journey?: Route }> => {
    await new Promise(res => setTimeout(res, 700));
    const lowerCaseQuery = query.toLowerCase().replace(/\s+/g, ' ').trim();
    
    let fromLocation: string | undefined, toLocation: string | undefined;
    const parts = lowerCaseQuery.split(/ to | toh /);

    if (parts.length === 2) {
        fromLocation = parts[0].replace('from', '').trim();
        toLocation = parts[1].trim();
    } else {
        const words = lowerCaseQuery.split(' ');
        if (words.length > 1) {
            fromLocation = words.slice(0, Math.floor(words.length / 2)).join(" ");
            toLocation = words.slice(Math.floor(words.length / 2)).join(" ");
        }
    }

    if (fromLocation && toLocation) {
        const findBestMatch = (location: string) => {
            const loc = location.toLowerCase().trim();
            // fast substring match first
            const substr = ALL_STOPS.find(stop => stop.toLowerCase().includes(loc));
            if (substr) return substr;
            // fallback: best Levenshtein match
            let bestMatch = '';
            let minDistance = Infinity;
            ALL_STOPS.forEach(stop => {
                const distance = calculateLevenshteinDistance(loc, stop.toLowerCase());
                if (distance < minDistance) { minDistance = distance; bestMatch = stop; }
            });
            // accept only if distance is reasonable relative to input length
            const threshold = Math.max(3, Math.floor(loc.length * 0.6));
            return minDistance <= threshold ? bestMatch : '';
        };
        const correctedFrom = findBestMatch(fromLocation);
        const correctedTo = findBestMatch(toLocation);

        if (correctedFrom && correctedTo && correctedFrom.toLowerCase() !== correctedTo.toLowerCase()) {
            const foundRoute = ROUTES.find(route => {
                const stopsLower = route.stops.map(stop => stop.name.toLowerCase());
                return stopsLower.includes(correctedFrom.toLowerCase()) && stopsLower.includes(correctedTo.toLowerCase());
            });

            if (foundRoute) {
                const fromIndex = foundRoute.stops.map(s => s.name.toLowerCase()).indexOf(correctedFrom.toLowerCase());
                const toIndex = foundRoute.stops.map(s => s.name.toLowerCase()).indexOf(correctedTo.toLowerCase());
                
                if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
                    const journeyStops = foundRoute.stops.slice(fromIndex, toIndex + 1);
                    const stopsCount = toIndex - fromIndex;
                    const journeyFare = stopsCount * foundRoute.fare_per_stop;
                    const startTime = foundRoute.stops[fromIndex]?.eta || 0;
                    const endTime = foundRoute.stops[toIndex]?.eta || 0;
                    const journeyTime = endTime - startTime;
                    const journey: Route = { ...foundRoute, journeyFare, journeyStops, journeyTime };
                    
                    const summary = (fromLocation === correctedFrom.toLowerCase() && toLocation === correctedTo.toLowerCase())
                        ? `Yes, I found a direct route for you from ${correctedFrom} to ${correctedTo}.`
                        : `Did you mean from ${correctedFrom} to ${correctedTo}? Here is a direct route.`;
                    return { summary, journey };
                }
            }
        }
        return { summary: `Sorry, I couldn't find a direct route from ${fromLocation} to ${toLocation} in my data. You may need to change buses.` };
    }
    return { summary: "I can help with routes, fares, and app navigation. For routes, please ask in a 'from [place] to [place]' format." };
};

// --- MAIN CHAT COMPONENT ---
const ChatAssistant: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([ { author: MessageAuthor.AI, text: "Hello! I am an advanced travel assistant. I can help you find bus routes, fares, and navigate the app." } ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [lastRouteContext, setLastRouteContext] = useState<Route | null>(null);

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        const userMessage: ChatMessage = { author: MessageAuthor.USER, text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);
        try {
            const classified = await classifyUserIntent(currentInput, lastRouteContext);
            let aiMessage: ChatMessage;

            switch (classified.intent) {
                case Intent.CONTEXTUAL_QUERY:
                    if (lastRouteContext && lastRouteContext.journeyStops) {
                        if (classified.topic === AppNavigationTopic.FARE_INFO) {
                            aiMessage = { author: MessageAuthor.AI, text: `The fare for your trip from ${lastRouteContext.journeyStops[0].name} to ${lastRouteContext.journeyStops[lastRouteContext.journeyStops.length - 1].name} is ₹${lastRouteContext.journeyFare}.` };
                        } else if (classified.topic === AppNavigationTopic.SHOW_COMPLETE_ROUTE) {
                            aiMessage = { author: MessageAuthor.AI, text: `Sure! Here is the complete list of stops for this bus route:\n\n${lastRouteContext.stops.map(s=>s.name).join(' → ')}` };
                        } else {
                            aiMessage = { author: MessageAuthor.AI, text: "I'm not sure what you're asking about that route. Can you clarify?" };
                        }
                    } else {
                        aiMessage = { author: MessageAuthor.AI, text: "I don't have a route in memory to talk about. Please ask me to find a route first." };
                    }
                    break;
                case Intent.APP_NAVIGATION:
                    setLastRouteContext(null);
                    const responseText = appNavigationResponses.get(classified.topic!) || "Sorry, I can't help with that.";
                    aiMessage = { author: MessageAuthor.AI, text: responseText };
                    break;
                case Intent.TRAVEL_QUERY:
                    const aiResponse = await getSmartTravelAdvice(currentInput);
                    setLastRouteContext(aiResponse.journey || null);
                    aiMessage = { author: MessageAuthor.AI, text: aiResponse.summary, routeSuggestion: aiResponse.journey };
                    break;
                default:
                    setLastRouteContext(null);
                    aiMessage = { author: MessageAuthor.AI, text: "I can help with travel planning or app questions. How can I assist?" };
                    break;
            }
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { author: MessageAuthor.AI, text: "Sorry, I encountered an error. Please try again." }]);
        } finally { setIsLoading(false); }
    };

    const MessageBubble: React.FC<{ msg: ChatMessage }> = ({ msg }) => {
        const isUser = msg.author === MessageAuthor.USER;
        return (
            <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && <div className="w-8 h-8 rounded-full bg-orange-500 flex-shrink-0 flex items-center justify-center"><SparklesIcon className="w-5 h-5 text-white" /></div>}
                <div className={`max-w-md p-4 rounded-xl ${isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'}`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    {msg.routeSuggestion && ( <RouteResultCard route={msg.routeSuggestion} /> )}
                </div>
                {isUser && <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0 flex items-center justify-center"><UserIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" /></div>}
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-4xl mx-auto flex flex-col h-[75vh] animate-fade-in">
            <div className="p-4 border-b dark:border-orange-400 flex justify-between items-center">
                <h2 className="text-xl font-bold text-center flex-1 text-orange-400">AI Travel Assistant</h2>
            </div>
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                {messages.map((msg, index) => <MessageBubble key={index} msg={msg} />)}
                {isLoading && ( <div className="flex justify-start gap-3"><div className="w-8 h-8 rounded-full bg-orange-500 flex-shrink-0 flex items-center justify-center"><SparklesIcon className="w-5 h-5 text-white" /></div><div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-xl rounded-bl-none"><div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div><div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-75"></div><div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-150"></div><span>Thinking...</span></div></div></div> )}
                <div ref={chatEndRef} />
            </div>
            <div className="p-4 border-t dark:border-gray-700">
                <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about routes, fares, or app features..." disabled={isLoading} className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50" />
                    <button type="submit" disabled={isLoading} className="bg-orange-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300 disabled:bg-orange-400 disabled:cursor-not-allowed">Send</button>
                </form>
            </div>
        </div>
    );
};

export default ChatAssistant;
