
import React from "react";
import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="parchment p-8 sm:p-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-amber-900 mb-4" style={{ fontFamily: 'var(--font-header)' }}>
            Terms of Service
          </h1>
          <p className="text-amber-900/70 mb-8">
            <strong>Last Updated:</strong> January 2025
          </p>

          <div className="space-y-8 text-amber-900/90">
            <section>
              <p className="text-lg leading-relaxed mb-4">
                These Terms of Service ("Terms") govern your use of the DungeonRoller application 
                ("Service") operated by Summit Software Solutions LLC ("Company", "we", "us", or "our").
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-header)' }}>
                1. Acceptance of Terms
              </h2>
              <p className="leading-relaxed">
                By accessing and using DungeonRoller, you accept and agree to be bound by the terms 
                and provisions of this agreement. If you do not agree to these Terms, please do not 
                use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-header)' }}>
                2. Intellectual Property Rights
              </h2>
              <p className="leading-relaxed mb-3">
                The Service and its original content, features, and functionality are and will remain 
                the exclusive property of Summit Software Solutions LLC and its licensors.
              </p>
              <p className="leading-relaxed">
                The Service is protected by copyright, trademark, and other laws. Our trademarks and 
                trade dress may not be used without our prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-header)' }}>
                3. User Content
              </h2>
              <p className="leading-relaxed mb-3">
                Our Service may allow you to create, upload, and share content including characters, 
                adventures, and stories ("User Content"). You retain ownership of your User Content.
              </p>
              <p className="leading-relaxed">
                By creating User Content, you grant us a worldwide, non-exclusive, royalty-free license 
                to use, reproduce, modify, and display your User Content solely for the purpose of 
                operating and improving the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-header)' }}>
                4. User Conduct
              </h2>
              <p className="leading-relaxed mb-2">You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use the Service for any illegal purpose</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Upload malicious code or viruses</li>
                <li>Attempt to gain unauthorized access to the Service</li>
                <li>Impersonate any person or entity</li>
                <li>Interfere with the Service's operation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-header)' }}>
                5. Account Security
              </h2>
              <p className="leading-relaxed">
                You are responsible for maintaining the confidentiality of your account credentials 
                and for all activities that occur under your account. You must immediately notify us 
                of any unauthorized use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-header)' }}>
                6. Termination
              </h2>
              <p className="leading-relaxed">
                We may terminate or suspend your access to the Service immediately, without prior notice 
                or liability, for any reason, including breach of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-header)' }}>
                7. Disclaimer of Warranties
              </h2>
              <p className="leading-relaxed">
                The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, 
                either express or implied. We do not warrant that the Service will be uninterrupted, 
                secure, or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-header)' }}>
                8. Limitation of Liability
              </h2>
              <p className="leading-relaxed">
                In no event shall Summit Software Solutions LLC be liable for any indirect, incidental, 
                special, consequential, or punitive damages arising out of or related to your use of 
                the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-header)' }}>
                9. Changes to Terms
              </h2>
              <p className="leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of any 
                material changes via email or through the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-header)' }}>
                10. Contact Information
              </h2>
              <p className="leading-relaxed">
                For questions about these Terms, please contact us at:
              </p>
              <div className="bg-amber-800/10 p-4 rounded-lg border border-amber-800/20 mt-3">
                <p><strong>Email:</strong> <a href="mailto:info@summitsoftwaresolutions.dev" className="text-amber-700 hover:text-amber-900">info@summitsoftwaresolutions.dev</a></p>
                <p><strong>Company:</strong> Summit Software Solutions LLC</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
