
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import type { View } from '../types';

interface HeaderProps {
  onLogout: () => void;
  onToggleAdmin: () => void;
  currentView: View;
}

const Header: React.FC<HeaderProps> = ({ onLogout, onToggleAdmin, currentView }) => {
  const { language, setLanguage, t } = useAppContext();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
      <h1 className="text-2xl font-bold text-green-700">{t.appName}</h1>
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleAdmin}
          className="px-4 py-2 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          {currentView === 'ADMIN' ? t.commuter : t.admin}
        </button>
        <button
          onClick={toggleLanguage}
          className="px-4 py-2 text-lg font-semibold text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          {language === 'en' ? 'हिंदी' : 'English'}
        </button>
        <button
          onClick={onLogout}
          className="px-4 py-2 text-lg font-semibold text-red-600 hover:text-red-800 transition"
        >
          {t.logout}
        </button>
      </div>
    </header>
  );
};

export default Header;
