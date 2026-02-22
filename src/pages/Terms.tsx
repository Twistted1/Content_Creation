import React from 'react';
import { TopNav } from '@/components/dashboard/TopNav';
import { Footer } from '@/components/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans pt-20 pb-12">
      <TopNav />
      <main className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p>Last updated: January 20, 2026</p>
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
            <p>By accessing or using ContentFlow, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Use License</h2>
            <p>Permission is granted to temporarily download one copy of the materials (information or software) on ContentFlow's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>modify or copy the materials;</li>
              <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
              <li>attempt to decompile or reverse engineer any software contained on ContentFlow's website;</li>
              <li>remove any copyright or other proprietary notations from the materials;</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. AI Generated Content</h2>
            <p>You retain ownership of all content generated using our AI tools. However, you acknowledge that AI generation may produce similar content for other users. You are responsible for ensuring that your use of generated content does not violate any third-party rights.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Disclaimer</h2>
            <p>The materials on ContentFlow's website are provided on an 'as is' basis. ContentFlow makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Governing Law</h2>
            <p>These terms and conditions are governed by and construed in accordance with the laws of the United States and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
