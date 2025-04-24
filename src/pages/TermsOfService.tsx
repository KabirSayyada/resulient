
import React from "react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <section className="prose max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
          <p>Welcome to Resulient ("we," "our," "us," or the "Company"). These Terms of Service govern your access to and use of the Resulient website and services.</p>
          
          <p>Resulient is owned and operated by Kabir Garba Ringim as a sole proprietorship.</p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">2. Service Description</h2>
          <p>Resulient is a Software as a Service (SaaS) platform that provides AI-powered resume optimization services. Our platform helps users improve their resumes for better performance with Applicant Tracking Systems (ATS).</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">3. Scope of Services</h2>
          <p>We exclusively provide resume optimization and analysis services. We do not engage in any prohibited activities or services. Our services include:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Resume analysis and scoring</li>
            <li>ATS optimization suggestions</li>
            <li>Keyword analysis and recommendations</li>
            <li>Performance tracking and analytics</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">4. User Accounts</h2>
          <p>To access our services, you must create an account and agree to these terms. You are responsible for maintaining the confidentiality of your account credentials.</p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">5. Intellectual Property</h2>
          <p>All content, features, and functionality of the Resulient service are owned by Kabir Garba Ringim and are protected by international copyright, trademark, and other intellectual property laws.</p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">6. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Use the service for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with other users' access to the service</li>
            <li>Share your account credentials with others</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7. Termination</h2>
          <p>We reserve the right to terminate or suspend your account for violations of these terms or for any other reason at our sole discretion.</p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">8. Changes to Terms</h2>
          <p>We may modify these terms at any time. Continued use of our service constitutes acceptance of any modifications.</p>

          <div className="mt-8 space-x-4">
            <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
            <span className="text-gray-300">|</span>
            <Link to="/refund-policy" className="text-primary hover:underline">Refund Policy</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
