
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const { t } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="flex items-center justify-center min-h-screen -m-8 bg-gradient-to-br from-green-100 to-blue-200">
      <div className="w-full max-w-sm p-8 space-y-8 bg-white rounded-2xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">Safar-E-Punjab</h1>
          <p className="mt-2 text-xl text-gray-600">{t.loginTitle}</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="mobile" className="text-lg font-medium text-gray-700">{t.mobileNumber}</label>
            <input
              id="mobile"
              name="mobile"
              type="tel"
              autoComplete="tel"
              required
              className="w-full px-4 py-3 mt-2 text-lg text-gray-900 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="98765 43210"
            />
          </div>
          <div>
            <label htmlFor="city" className="text-lg font-medium text-gray-700">{t.selectCity}</label>
            <select
              id="city"
              name="city"
              required
              className="w-full px-4 py-3 mt-2 text-lg text-gray-900 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option>Ludhiana</option>
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              {t.login}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginView;
