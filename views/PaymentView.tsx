import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { UserProvidedQrCodeIcon } from '../components/icons/UserProvidedQrCodeIcon';
import { SEAT_PRICE } from '../constants';

interface PaymentViewProps {
  onBack: () => void;
  selectedSeatsCount: number;
}

const PaymentView: React.FC<PaymentViewProps> = ({ onBack, selectedSeatsCount }) => {
  const { t } = useAppContext();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const totalPrice = selectedSeatsCount * SEAT_PRICE;

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-orange-400">{t.paymentPortal}</h2>
        <button onClick={onBack} className="text-lg text-blue-600 hover:underline">&larr; {t.back}</button>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="flex border-2 border-blue-500 rounded-lg overflow-hidden">
          <button
            onClick={() => setPaymentMethod('card')}
            className={`w-1/2 py-3 text-lg font-semibold transition-all duration-300 ${paymentMethod === 'card' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
          >
            {t.cardPayment}
          </button>
          <button
            onClick={() => setPaymentMethod('upi')}
            className={`w-1/2 py-3 text-lg font-semibold transition-all duration-300 ${paymentMethod === 'upi' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
          >
            {t.upiPayment}
          </button>
        </div>

        {paymentMethod === 'card' && (
          <form className="mt-6 space-y-4 animate-fade-in">
            <div>
              <label htmlFor="card-number" className="text-lg font-medium text-gray-700">{t.cardNumber}</label>
              <input type="text" id="card-number" className="w-full mt-1 p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500" placeholder="•••• •••• •••• ••••" />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="expiry" className="text-lg font-medium text-gray-700">{t.expiryDate}</label>
                <input type="text" id="expiry" className="w-full mt-1 p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500" placeholder="MM/YY" />
              </div>
              <div className="flex-1">
                <label htmlFor="cvv" className="text-lg font-medium text-gray-700">{t.cvv}</label>
                <input type="text" id="cvv" className="w-full mt-1 p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500" placeholder="•••" />
              </div>
            </div>
            <button type="submit" className="w-full mt-4 py-4 text-xl font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition">
              {t.payNow} ₹{totalPrice}
            </button>
          </form>
        )}

        {paymentMethod === 'upi' && (
          <div className="mt-6 text-center animate-fade-in">
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-lg text-gray-600">{t.payableAmount}</p>
              <p className="text-4xl font-bold text-gray-800">₹{totalPrice}</p>
              <p className="text-sm text-gray-500 mt-1">{t.payTo}</p>
            </div>
            <div className="my-6">
              <div className="flex justify-center p-2 bg-white border-4 border-gray-300 rounded-lg">
                <UserProvidedQrCodeIcon className="w-48 h-48 text-gray-800" />
              </div>
              <p className="mt-2 font-semibold text-gray-700">{t.scanToPay}</p>
            </div>
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500 font-semibold">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
             <div>
                <label htmlFor="upi-id" className="text-lg font-medium text-gray-700">{t.orPayWithUpiId}</label>
                <div className="flex mt-2">
                    <input type="text" id="upi-id" className="w-full p-3 border border-gray-300 rounded-l-lg text-lg focus:ring-2 focus:ring-blue-500" placeholder={t.enterUpiId} />
                    <button className="px-4 py-2 text-lg font-semibold text-white bg-blue-600 rounded-r-lg hover:bg-blue-700 transition">{t.verifyAndPay}</button>
                </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentView;
