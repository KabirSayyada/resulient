
import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <section className="prose max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
          <p>At Resulient, we take your privacy seriously. We collect:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Account information (email, name)</li>
            <li>Resume content for analysis</li>
            <li>Usage data and analytics</li>
            <li>Payment information (processed securely through our payment processor)</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide and improve our resume optimization services</li>
            <li>Process payments and manage your subscription</li>
            <li>Send important service updates and notifications</li>
            <li>Improve our AI algorithms and service quality</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">3. Data Security</h2>
          <p>We implement industry-standard security measures to protect your data:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security audits and updates</li>
            <li>Secure access controls and authentication</li>
            <li>Regular backups and disaster recovery procedures</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">4. Data Sharing</h2>
          <p>We never sell your personal data. We only share data with:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Service providers necessary for our operations</li>
            <li>Legal authorities when required by law</li>
            <li>Third parties with your explicit consent</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Access your personal data</li>
            <li>Request data correction or deletion</li>
            <li>Opt-out of marketing communications</li>
            <li>Export your data</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">6. Cookies and Tracking</h2>
          <p>We use cookies and similar technologies to improve your experience and analyze service usage. You can control cookie settings through your browser.</p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7. Contact Us</h2>
          <p>For privacy-related questions, please contact our Data Protection Officer at privacy@resulient.com</p>

          <div className="mt-8 space-x-4">
            <Link to="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link>
            <span className="text-gray-300">|</span>
            <Link to="/refund-policy" className="text-primary hover:underline">Refund Policy</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
