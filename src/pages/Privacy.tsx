import React from 'react';
import { TopNav } from '@/components/dashboard/TopNav';
import { Footer } from '@/components/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans pt-20 pb-12">
      <TopNav />
      <main className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p>Last updated: January 20, 2026</p>
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p>Welcome to ContentFlow. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Data We Collect</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data:</strong> includes email address and telephone number.</li>
              <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
              <li><strong>Usage Data:</strong> includes information about how you use our website, products and services (e.g., scripts generated, videos created).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Data</h2>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>To provide the AI content generation services you requested.</li>
              <li>To manage your subscription and payments.</li>
              <li>To improve our website, products/services, marketing or customer relationships.</li>
            </ul>
          </section>
          
          <section>
             <h2 className="text-2xl font-bold text-white mb-4">4. YouTube API Services</h2>
             <p>ContentFlow uses YouTube API Services to allow you to publish content directly to YouTube. By using our service, you agree to be bound by the YouTube Terms of Service.</p>
             <p className="mt-2">We do not store your YouTube password. We store an authentication token which allows us to upload videos on your behalf. You can revoke this access at any time via your Google Security settings.</p>
             <p className="mt-2">For more information, please refer to the <a href="http://www.google.com/policies/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Google Privacy Policy</a>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Contact Us</h2>
            <p>If you have any questions about this privacy policy or our privacy practices, please contact us at: support@contentflow.com</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
