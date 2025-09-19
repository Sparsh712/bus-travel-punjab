
import React from 'react';
import { busData } from '../data/busData';
import { useAppContext } from '../hooks/useAppContext';

const AdminView: React.FC = () => {
  const { t } = useAppContext();

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">{t.adminDashboard}</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left font-semibold">{t.vehicleId}</th>
                <th className="py-3 px-4 text-left font-semibold">{t.route}</th>
                <th className="py-3 px-4 text-left font-semibold">{t.lastLocation}</th>
                <th className="py-3 px-4 text-left font-semibold">{t.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {busData.map((bus) => (
                <tr key={bus.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{bus.vehicle_id}</td>
                  <td className="py-3 px-4">{bus.route}</td>
                  <td className="py-3 px-4">{bus.stops[0].stop_name}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 text-base rounded-full font-semibold ${
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
        </div>
      </div>
    </div>
  );
};

export default AdminView;
