import React, { useState } from 'react';
import { TopNav } from '@/components/dashboard/TopNav';
import { auth } from '@/lib/firebase';
import { PaymentModal } from '@/components/stripe/PaymentModal';
import { usageService } from '@/services/usageService';
import { showToast } from '@/utils/toast';

const PLANS = [
  {
    id: 'free',
    name: 'Starter',
    price: '$0',
    period: '/mo',
    description: 'Perfect for trying out ContentFlow.',
    features: [
      '5 AI Ideas per day',
      'Basic Script Generation',
      'Watermarked Video Export',
      'Community Support'
    ],
    buttonText: 'Current Plan',
    active: true,
    highlighted: false
  },
  {
    id: 'creator',
    name: 'Creator',
    price: '$29',
    period: '/mo',
    description: 'For growing content creators.',
    features: [
      'Unlimited AI Ideas',
      'Advanced Script Templates',
      '1080p No-Watermark Exports',
      'Priority Support',
      'Custom Voice Clones (3)'
    ],
    buttonText: 'Upgrade to Creator',
    active: false,
    highlighted: true
  },
  {
    id: 'pro',
    name: 'Agency',
    price: '$99',
    period: '/mo',
    description: 'Scale your production workflow.',
    features: [
      'Everything in Creator',
      'Team Collaboration',
      '4K Video Export',
      'API Access',
      'Dedicated Account Manager'
    ],
    buttonText: 'Contact Sales',
    active: false,
    highlighted: false
  }
];

export default function Pricing() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null);

  const handlePlanClick = (plan: typeof PLANS[0]) => {
    if (!auth.currentUser) {
        showToast("Please login first to upgrade your plan.", "error");
        // Optional: navigate('/login');
        return;
    }

    if (plan.id === 'pro') {
      window.location.href = 'mailto:sales@contentflow.com';
      return;
    }
    
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    if (selectedPlan) {
      try {
        await usageService.upgradePlan(selectedPlan.id);
        setShowPaymentModal(false);
        showToast(`Successfully upgraded to ${selectedPlan.name} plan!`, 'success');
        
        // Refresh page to reflect changes or update local state
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        console.error("Upgrade failed:", error);
        showToast('Payment successful, but plan update failed. Contact support.', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans pt-20 pb-12">
      <TopNav />
      
      <main className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose the plan that fits your content creation journey. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan) => (
            <div 
              key={plan.id}
              className={`relative bg-gray-800 rounded-2xl p-8 border transition-all duration-300 hover:transform hover:-translate-y-2 ${
                plan.highlighted 
                  ? 'border-purple-500 shadow-2xl shadow-purple-500/20 scale-105 z-10' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-400 ml-1">{plan.period}</span>
              </div>
              <p className="text-gray-400 mb-6 min-h-[48px]">{plan.description}</p>
              
              <button 
                onClick={() => !plan.active && handlePlanClick(plan)}
                disabled={plan.active}
                className={`w-full py-3 rounded-xl font-bold mb-8 transition-all ${
                  plan.active 
                    ? 'bg-gray-700 text-gray-400 cursor-default' 
                    : plan.highlighted 
                      ? 'gradient-bg hover:opacity-90 shadow-lg' 
                      : 'bg-white text-gray-900 hover:bg-gray-100'
                }`}
              >
                {plan.buttonText}
              </button>
              
              <div className="space-y-4">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.active || plan.highlighted ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                      <i className="fas fa-check text-xs"></i>
                    </div>
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center bg-gray-800 rounded-2xl p-8 border border-gray-700 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Enterprise Needs?</h3>
            <p className="text-gray-400 mb-6">
                Need custom integrations, SLA guarantees, or on-premise deployment? We've got you covered.
            </p>
            <button className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition">
                Contact Enterprise Sales
            </button>
        </div>
      </main>

      {/* Stripe Payment Modal */}
      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        plan={selectedPlan}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
