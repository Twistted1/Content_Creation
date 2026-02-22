import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

// EXPORT is crucial here so PaymentModal can see it
export const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Change this URL to wherever you want them to go after success
        return_url: window.location.origin + "/success",
      },
    });

    // This only runs on error (success redirects away)
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "An unexpected error occurred.");
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />

      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <i className="fas fa-spinner fa-spin"></i> Processing...
          </span>
        ) : (
          "Pay Now"
        )}
      </button>

      {/* Error Message Display */}
      {message && (
        <div id="payment-message" className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded border border-red-800">
          {message}
        </div>
      )}
    </form>
  );
};