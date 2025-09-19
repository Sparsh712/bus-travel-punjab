
import React, { useState } from 'react';
import type { View, BusTrip } from './types';
import { AppProvider } from './context/AppContext';

import LoginView from './views/LoginView';
import CommuterView from './views/CommuterView';
import AdminView from './views/AdminView';
import BookingView from './views/BookingView';
import PaymentView from './views/PaymentView';
import Header from './components/Header';
import { busData } from './data/busData';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<View>('COMMUTER');
  const [bookingState, setBookingState] = useState<{ bus: BusTrip | null; seats: number[] }>({
    bus: null,
    seats: [],
  });

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('COMMUTER');
  };

  const handleSelectBus = (bus: BusTrip) => {
    setBookingState({ bus, seats: [] });
    setCurrentView('BOOKING');
  };

  const handleProceedToPayment = () => {
    if (bookingState.bus && bookingState.seats.length > 0) {
      setCurrentView('PAYMENT');
    }
  };

  const handleBackToCommuter = () => {
    setBookingState({ bus: null, seats: [] });
    setCurrentView('COMMUTER');
  };
  
  const handleBackToBooking = () => setCurrentView('BOOKING');

  const renderContent = () => {
    if (!isLoggedIn) {
      return <LoginView onLogin={handleLogin} />;
    }

    const mainContent = () => {
      switch (currentView) {
        case 'ADMIN':
          return <AdminView />;
        case 'BOOKING':
          if (!bookingState.bus) return <CommuterView buses={busData} onSelectBus={handleSelectBus} />;
          return (
            <BookingView
              bus={bookingState.bus}
              selectedSeats={bookingState.seats}
              setSelectedSeats={(seats) => setBookingState(prev => ({ ...prev, seats: typeof seats === 'function' ? seats(prev.seats) : seats }))}
              onProceed={handleProceedToPayment}
              onBack={handleBackToCommuter}
            />
          );
        case 'PAYMENT':
           return <PaymentView selectedSeatsCount={bookingState.seats.length} onBack={handleBackToBooking} />;
        case 'COMMUTER':
        default:
          return <CommuterView buses={busData} onSelectBus={handleSelectBus} />;
      }
    };

    return (
      <div className="font-sans">
        <Header 
          currentView={currentView}
          onToggleAdmin={() => setCurrentView(currentView === 'ADMIN' ? 'COMMUTER' : 'ADMIN')}
          onLogout={handleLogout} 
        />
        <main className="container mx-auto p-4 sm:p-6">
          {mainContent()}
        </main>
      </div>
    );
  };
  
  return (
    <AppProvider>
       {renderContent()}
    </AppProvider>
  );
};

export default App;
