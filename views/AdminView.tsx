
import React, { useState, useMemo } from 'react';
import { busData } from '../data/busData';
import { useAppContext } from '../hooks/useAppContext';

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
);

const AdminView: React.FC = () => {
  const { t } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'on_time' | 'delayed'>('all');

  // Memoize filtered results for performance
  const filteredBuses = useMemo(() => {
    return busData
      .filter(bus => {
        if (statusFilter === 'on_time') return bus.on_time;
        if (statusFilter === 'delayed') return !bus.on_time;
        return true;
      })
      .filter(bus => 
        bus.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.vehicle_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [searchTerm, statusFilter]);

  // Memoize counts for summary cards
  const onTimeCount = useMemo(() => busData.filter(b => b.on_time).length, []);
  const delayedCount = useMemo(() => busData.filter(b => !b.on_time).length, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold text-orange-400">{t.adminDashboard}</h2>
      
      {/* --- Summary Cards for Quick Overview --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">Total Buses</p>
            <p className="text-4xl font-bold text-blue-600">{busData.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">{t.onTime}</p>
            <p className="text-4xl font-bold text-green-600">{onTimeCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">{t.delayed}</p>
            <p className="text-4xl font-bold text-red-600">{delayedCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* --- Interactive Filters and Search Bar --- */}
        <div className="p-4 border-b flex flex-col md:flex-row items-center gap-4 justify-between">
            <div className="flex items-center gap-2">
                <button onClick={() => setStatusFilter('all')} className={`px-4 py-2 rounded-lg font-semibold transition ${statusFilter === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>All</button>
                <button onClick={() => setStatusFilter('on_time')} className={`px-4 py-2 rounded-lg font-semibold transition ${statusFilter === 'on_time' ? 'bg-green-600 text-white shadow-sm' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{t.onTime}</button>
                <button onClick={() => setStatusFilter('delayed')} className={`px-4 py-2 rounded-lg font-semibold transition ${statusFilter === 'delayed' ? 'bg-red-600 text-white shadow-sm' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{t.delayed}</button>
            </div>
            <div className="relative w-full md:w-auto">
                <input
                    type="text"
                    placeholder="Search by Route or ID..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full md:w-80 p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <SearchIcon />
                </div>
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase">
              <tr>
                <th className="py-3 px-4 text-left font-semibold">{t.vehicleId}</th>
                <th className="py-3 px-4 text-left font-semibold">{t.route}</th>
                <th className="py-3 px-4 text-left font-semibold">Current Stop</th>
                <th className="py-3 px-4 text-left font-semibold">{t.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBuses.map((bus) => (
                <tr key={bus.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-gray-700">{bus.vehicle_id}</td>
                  <td className="py-3 px-4 text-gray-800 font-medium">{bus.route}</td>
                  <td className="py-3 px-4 text-gray-600">{bus.stops[0].stop_name}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 text-xs rounded-full font-semibold ${
                      bus.on_time 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {bus.on_time ? t.onTime : t.delayed}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredBuses.length === 0 && (
            <div className="text-center py-12 text-gray-500">
                <h3 className="text-xl font-medium">No buses found.</h3>
                <p>Try adjusting your search or filters.</p>
            </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default AdminView;
