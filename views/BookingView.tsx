import React from 'react';
import type { BusTrip } from '../types';
import { useAppContext } from '../hooks/useAppContext';
import { SeatIcon } from '../components/icons/SeatIcon';
import { SEAT_PRICE } from '../constants';

interface BookingViewProps {
  bus: BusTrip;
  onProceed: () => void;
  onBack: () => void;
  selectedSeats: number[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<number[]>>;
}

const Seat: React.FC<{ status: 'available' | 'occupied' | 'selected'; onClick: () => void; }> = ({ status, onClick }) => {
  const baseClasses = "w-12 h-12 cursor-pointer transition-transform transform hover:scale-110";
  const statusClasses = {
    available: "text-gray-400 hover:text-green-500",
    occupied: "text-gray-600 cursor-not-allowed",
    selected: "text-blue-500",
  };
  return <SeatIcon className={`${baseClasses} ${statusClasses[status]}`} onClick={status !== 'occupied' ? onClick : undefined} />;
};

const BookingView: React.FC<BookingViewProps> = ({ bus, onProceed, onBack, selectedSeats, setSelectedSeats }) => {
  const { t } = useAppContext();
  
  const occupiedSeats = React.useMemo(() => {
    const occupied = new Set<number>();
    const count = Math.floor(Math.random() * bus.capacity * 0.4); // Randomly occupy some seats
    while (occupied.size < count) {
      occupied.add(Math.floor(Math.random() * bus.capacity));
    }
    return Array.from(occupied);
  }, [bus.capacity]);

  const toggleSeat = (seatIndex: number) => {
    setSelectedSeats(prev => 
      prev.includes(seatIndex) 
        ? prev.filter(s => s !== seatIndex) 
        : [...prev, seatIndex]
    );
  };

  const seats = Array.from({ length: bus.capacity }, (_, i) => i);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-orange-400">{t.bookingTitle}</h2>
        <button onClick={onBack} className="text-lg text-blue-600 hover:underline">&larr; {t.back}</button>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-2">{t.busDetails}</h3>
        <p className="text-lg"><span className="font-semibold">{t.route}:</span> {bus.route}</p>
        <p className="text-lg"><span className="font-semibold">{t.vehicleId}:</span> {bus.vehicle_id} ({bus.bus_type})</p>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4">{t.seatLayout}</h3>
        <div className="p-4 border-2 border-gray-300 rounded-lg bg-gray-50 relative">
          <div className="absolute top-4 left-4 text-lg font-bold text-gray-700">{t.driver}</div>
          <div className="grid grid-cols-5 gap-2 justify-center mt-12">
            {seats.map((seatIndex) => (
              <React.Fragment key={seatIndex}>
                {(seatIndex) % 4 === 2 && <div className="col-span-1"></div>}
                <Seat
                  onClick={() => toggleSeat(seatIndex)}
                  status={
                    selectedSeats.includes(seatIndex) ? 'selected' :
                    occupiedSeats.includes(seatIndex) ? 'occupied' : 'available'
                  }
                />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md sticky bottom-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg">{t.selectedSeats}: <span className="font-bold">{selectedSeats.length}</span></p>
            <p className="text-2xl font-bold">{t.totalPrice}: <span className="text-green-700">₹{selectedSeats.length * SEAT_PRICE}</span></p>
          </div>
          <button
            onClick={onProceed}
            disabled={selectedSeats.length === 0}
            className="px-8 py-4 text-xl font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {t.proceedToPayment}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingView;
