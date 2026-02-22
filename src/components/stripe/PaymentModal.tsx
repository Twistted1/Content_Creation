import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { CheckoutForm } from './CheckoutForm';

// 1. Initialize Stripe (Replace with your actual Publishable Key)
const stripePromise = loadStripe("pk_test_51Ss8ig99SwZHUFarqE8sOGL3NenHAOPF19J2al2i2rcGBOXQt72DDNc5Q5R2F5nwVERK30bY88o1gyoRQNBGceRi00E3lkq37i");

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    id: string; // "basic" or "pro"
    name: string;
    price: string;
  } | null;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, plan, onSuccess }) => {
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");

  // 2. Fetch the "Client Secret" from your Backend when the modal opens
  useEffect(() => {
    if (isOpen && plan) {
      const functions = getFunctions();
      // This name 'createPaymentIntent' MUST match your backend function name
      const createPaymentIntent = httpsCallable(functions, 'createPaymentIntent');

      // We send the plan.id (e.g. "pro") to the backend
      createPaymentIntent({ productId: plan.id })
        .then((result: any) => {
          setClientSecret(result.data.clientSecret);
        })
        .catch((err) => {
          console.error("Backend Error:", err);
          setError("Could not initialize payment. Please try again.");
        });
    }
  }, [isOpen, plan]);

  if (!isOpen || !plan) return null;

  // 3. Customize the "appearance" of the credit card inputs to match your dark theme
  const appearance = {
    theme: 'night' as const,
    labels: 'floating' as const,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl overflow-hidden">

        {/* Modal Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
          <div>
            <h3 className="text-xl font-bold text-white">Upgrade to {plan.name}</h3>
            <p className="text-sm text-gray-400">Complete your subscription</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="mb-6 flex justify-between items-end">
            <span className="text-gray-400">Total due today:</span>
            <span className="text-3xl font-bold text-white">{plan.price}</span>
          </div>

          {/* 4. Only render the form when we have the secret from the backend */}
          {clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
              {/* We don't need to pass props to CheckoutForm anymore, Stripe handles it */}
              <CheckoutForm />
            </Elements>
          ) : (
            // Loading State
            <div className="flex justify-center py-8">
              {!error ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              ) : (
                <div className="text-red-400 text-center">{error}</div>
              )}
            </div>
          )}

          <div className="mt-6 flex items-center gap-2 text-xs text-gray-500 justify-center">
            <i className="fas fa-lock"></i>
            <span>Payments secured by Stripe</span>
          </div>
        </div>
      </div>
    </div>
  );
};