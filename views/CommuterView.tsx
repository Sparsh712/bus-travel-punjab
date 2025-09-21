import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { BusTrip } from '../types';
import { useAppContext } from '../hooks/useAppContext';
import { stopCoordinates } from '../data/stopCoordinates';
import RoutePlanner from '../components/RoutePlanner';
import ChatAssistant from '../components/ChatAssistant';

declare var google: any;

declare global {
    interface Window {
        initMap?: () => void;
    }
}

interface CommuterViewProps {
  buses: BusTrip[];
  onSelectBus: (bus: BusTrip) => void;
}

interface BusPosition {
  lat: number;
  lng: number;
}

const loadGoogleMapsScript = (apiKey: string, callback: () => void) => {
    if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
        callback();
        return;
    }
    const existingScript = document.getElementById('googleMapsScript');
    if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'googleMapsScript';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
        script.async = true;
        script.defer = true;
        window.initMap = callback;
        document.head.appendChild(script);
    }
};


const MapComponent: React.FC<{
  positions: { [key: string]: BusPosition },
  onLoadError: () => void,
}> = ({ positions, onLoadError }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const mapInstanceRef = useRef<any | null>(null);

  const busIconPath = 'M18.92 6.01C18.72 5.42 18.16 5 17.5 5H15V4a1 1 0 00-1-1H6a1 1 0 00-1 1v1H3.5A1.5 1.5 0 002 6.5V18.5A1.5 1.5 0 003.5 20h1A1.5 1.5 0 006 21.5a1.5 1.5 0 001.5-1.5h7A1.5 1.5 0 0016 21.5a1.5 1.5 0 001.5-1.5h1a1.5 1.5 0 001.5-1.5v-11c0-.66-.34-1.26-.88-1.49zM9 19a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0zM4 17V7h16v10H4z';

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    
    // WARNING: Hardcoding API keys is not secure. This is for demonstration purposes only.
    const apiKey = "  AIzaSyBFO4KJeePp37jfH5_W6sJSqd3len5o3Fk";
    if (!apiKey) {
      onLoadError();
      return;
    }

    loadGoogleMapsScript(apiKey, () => {
        if (!mapRef.current) return;
        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          center: { lat: 30.9010, lng: 75.8573 }, // Ludhiana center
          zoom: 12,
          disableDefaultUI: true,
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
            { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] },
          ],
        });
    });
  }, [onLoadError]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || typeof google === 'undefined') return;

    const newPositionIds = Object.keys(positions);

    newPositionIds.forEach(busId => {
      const position = positions[busId];
      if (markersRef.current[busId]) {
        markersRef.current[busId].setPosition(position);
      } else {
        markersRef.current[busId] = new google.maps.Marker({
          position,
          map,
          icon: {
            path: busIconPath,
            fillColor: '#2563EB',
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: '#ffffff',
            rotation: Math.random() * 360,
            scale: 1.1,
            anchor: new google.maps.Point(12, 12),
          },
        });
      }
    });

  }, [positions, busIconPath]);

  return <div ref={mapRef} className="absolute inset-0 w-full h-full" />;
};

interface LiveBusState {
  bus: BusTrip;
  currentStopIndex: number;
  progress: number;
  position: BusPosition;
  eta: number;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const generateRandomEta = () => Math.floor(Math.random() * 15) + 1;

const LiveTracker: React.FC<CommuterViewProps> = ({ buses, onSelectBus }) => {
  const { t } = useAppContext();
  const [liveBuses, setLiveBuses] = useState<{ [id: string]: LiveBusState }>({});
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    const initialLiveBuses: { [id: string]: LiveBusState } = {};
    buses.forEach(bus => {
      const startStopIndex = Math.floor(Math.random() * (bus.stops.length - 1));
      const startProgress = Math.random();
      const currentStopCoords = stopCoordinates[bus.stops[startStopIndex].stop_name];
      const nextStopCoords = stopCoordinates[bus.stops[startStopIndex + 1]?.stop_name];

      let initialPosition = { lat: 30.9010, lng: 75.8573 };
      if (currentStopCoords && nextStopCoords) {
        initialPosition = {
          lat: lerp(currentStopCoords.lat, nextStopCoords.lat, startProgress),
          lng: lerp(currentStopCoords.lng, nextStopCoords.lng, startProgress),
        };
      }

      initialLiveBuses[bus.id] = {
        bus,
        currentStopIndex: startStopIndex,
        progress: startProgress,
        position: initialPosition,
        eta: generateRandomEta(),
      };
    });
    setLiveBuses(initialLiveBuses);
  }, [buses]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveBuses(prev => {
        const nextState = { ...prev };
        for (const busId in nextState) {
          const current = nextState[busId];
          const newProgress = current.progress + 0.02;

          let newStopIndex = current.currentStopIndex;
          let finalProgress = newProgress;
          let newEta = current.eta;

          if (newProgress >= 1) {
            newStopIndex = (current.currentStopIndex + 1);
            if(newStopIndex >= current.bus.stops.length - 1) {
              newStopIndex = 0;
            }
            finalProgress = 0;
            newEta = generateRandomEta();
          }

          const currentStopCoords = stopCoordinates[current.bus.stops[newStopIndex].stop_name];
          const nextStopCoords = stopCoordinates[current.bus.stops[newStopIndex + 1]?.stop_name];

          let newPosition = current.position;
          if (currentStopCoords && nextStopCoords) {
             newPosition = {
              lat: lerp(currentStopCoords.lat, nextStopCoords.lat, finalProgress),
              lng: lerp(currentStopCoords.lng, nextStopCoords.lng, finalProgress),
            };
          }

          nextState[busId] = {
            ...current,
            currentStopIndex: newStopIndex,
            progress: finalProgress,
            position: newPosition,
            eta: newEta,
          };
        }
        return nextState;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const busPositionsForMap = useMemo(() => {
    return Object.fromEntries(
      Object.entries(liveBuses).map(([id, state]) => [id, state.position])
    );
  }, [liveBuses]);

  const renderMapContent = () => {
    if (mapError) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-700 bg-red-50 p-4 rounded-xl text-center">
          <h3 className="font-bold text-xl mb-2">Map Loading Error</h3>
          <p className="text-md">
            Could not load map. Please ensure a valid API_KEY is configured in your environment for Google Maps.
          </p>
        </div>
      );
    }
    return <MapComponent positions={busPositionsForMap} onLoadError={() => setMapError(true)} />;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-orange-400 mb-4">{t.liveMap}</h2>
        <div className="relative w-full h-80 bg-gray-200 rounded-xl overflow-hidden shadow-lg border-4 border-white">
          {renderMapContent()}
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold text-orange-400 mb-4">{t.nearbyBuses}</h2>
        <div className="space-y-4">
          {Object.values(liveBuses).map(liveBus => {
            const currentStop = liveBus.bus.stops[liveBus.currentStopIndex];
            return (
              <div key={liveBus.bus.id} className="p-4 bg-white rounded-lg shadow-md flex items-center justify-between transition hover:shadow-xl hover:scale-105">
                <div>
                  <p className="text-xl font-bold text-blue-700">{t.route}: {liveBus.bus.route}</p>
                  <p className="text-lg text-gray-600">{t.currentStop}: {currentStop.stop_name}</p>
                  <p className="text-lg text-green-700 font-semibold">{t.eta}: {liveBus.eta} min</p>
                </div>
                <button
                  onClick={() => onSelectBus(liveBus.bus)}
                  className="px-6 py-3 text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                >
                  {t.select}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CommuterView: React.FC<CommuterViewProps> = (props) => {
    const { t } = useAppContext();
    const [activeTab, setActiveTab] = useState<'tracker' | 'planner' | 'ai'>('tracker');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'planner':
                return <RoutePlanner />;
            case 'ai':
                return <ChatAssistant />;
            case 'tracker':
            default:
                return <LiveTracker {...props} />;
        }
    };
    
    // FIX: Used React.FC to correctly type the component, resolving an issue where React's special 'key' prop was being incorrectly passed to the component's props.
    const NavButton: React.FC<{
        isActive: boolean;
        onClick: () => void;
        children: React.ReactNode;
    }> = ({ isActive, onClick, children }) => (
        <button
            onClick={onClick}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 text-base sm:text-lg font-bold rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                isActive
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
        >
            {children}
        </button>
    );

    return (
        <div>
            <div className="mb-6 bg-gray-200 rounded-lg p-1.5 flex flex-col sm:flex-row gap-2">
                <NavButton isActive={activeTab === 'tracker'} onClick={() => setActiveTab('tracker')}>
                    {t.liveMap}
                </NavButton>
                <NavButton isActive={activeTab === 'planner'} onClick={() => setActiveTab('planner')}>
                    {t.routePlanner}
                </NavButton>
                <NavButton isActive={activeTab === 'ai'} onClick={() => setActiveTab('ai')}>
                    {t.aiAssistant}
                </NavButton>
            </div>

            <div>{renderTabContent()}</div>
        </div>
    );
};

export default CommuterView;
