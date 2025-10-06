
import React from "react";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="parchment p-8 sm:p-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-amber-900 mb-4" style={{ fontFamily: 'var(--font-header)' }}>
            Privacy Policy
          </h1>
          <p className="text-amber-900/70 mb-8">
            <strong>Last Updated:</strong> January 2025
          </p>

          <div className="space-y-8 text-amber-900/90">
            <section>
              <p className="text-lg leading-relaxed mb-4">
                Summit Software Solutions LLC ("we", "us", or "our") operates the DungeonRoller application 
                (the "Service"). This page informs you of our policies regarding the collection, use, and 
                disclosure of personal data when you use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-header)' }}>
                1. Information We Collect
              </h2>
              <p className="leading-relaxed mb-3">
                We collect several types of information to provide and improve our Service:
              </p>
              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-lg mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Email address</li>
                    <li>Display name or username</li>
                    <li>Profile information you provide</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Usage Data</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Pages visited and features used</li>
                    <li>Time spent on the Service</li>
                    <li>Device and browser information</li>
                    <li>IP address and location data</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Game Data</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Characters you create</li>
                    <li>Adventures and stories you generate</li>
                    <li>Game progress and statistics</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-header)' }}>
                2. How We Use Your Information
              </h2>
              <p className="leading-relaxed mb-2">We use the collected information for various purposes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>To provide and maintain our Service</li>
                <li>To notify you about changes to our Service</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information to improve the Service</li>
                <li>To monitor usage and detect issues</li>
                <li>To provide personalized experiences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-header)' }}>
                3. Data Security
              </h2>
              <p className="leading-relaxed mb-3">
                The security of your data is important to us. We implement appropriate technical and 
                organizational measures to protect your personal information against unauthorized access, 
                alteration, disclosure, or destruction.
              </p>
              <p className="leading-relaxed">
                However, no method of transmission over the Internet or electronic storage is 100% secure. 
                While we strive to protect your personal information, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-header)' }}>
                4. Data Sharing and Disclosure
              </h2>
              <p className="leading-relaxed mb-2">
                We may share your information in the following situations:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>With your consent:</strong> We may share information when you give us permission</li>
                <li><strong>For legal reasons:</strong> To comply with legal obligations or protect our rights</li>
                <li><strong>Business transfers:</strong> In connection with any merger, sale, or acquisition</li>
                <li><strong>Service providers:</strong> With third-party service providers who assist in operating our Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-header)' }}>
                5. Your Data Rights
              </h2>
              <p className="leading-relaxed mb-2">You have the following rights regarding your personal data:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Access:</strong> Request copies of your personal data</li>
                <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                <li><strong>Data portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Objection:</strong> Object to processing of your personal data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-header)' }}>
                6. Cookies and Tracking
              </h2>
              <p className="leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our Service and 
                hold certain information. You can instruct your browser to refuse all cookies or to 
                indicate when a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-header)' }}>
                7. Children's Privacy
              </h2>
              <p className="leading-relaxed">
                Our Service is not intended for children under 13 years of age. We do not knowingly 
                collect personally identifiable information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-header)' }}>
                8. Changes to This Privacy Policy
              </h2>
              <p className="leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-header)' }}>
                9. Contact Us
              </h2>
              <p className="leading-relaxed mb-3">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="bg-amber-800/10 p-4 rounded-lg border border-amber-800/20">
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
