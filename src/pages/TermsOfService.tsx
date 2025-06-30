
import React from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <section className="prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">1. Introduction</h2>
          <p className="text-gray-800 dark:text-gray-300">Welcome to Resulient ("we," "our," "us," or the "Company"). These Terms of Service govern your access to and use of the Resulient website and services.</p>
          
          <p className="text-gray-800 dark:text-gray-300">Resulient is a technology company providing AI-powered resume optimization services to users worldwide. By accessing our platform, you agree to comply with these terms and conditions.</p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">2. Service Description</h2>
          <p className="text-gray-800 dark:text-gray-300">Resulient is a Software as a Service (SaaS) platform that provides AI-powered resume optimization services. Our platform helps users improve their resumes for better performance with Applicant Tracking Systems (ATS).</p>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">3. Scope of Services</h2>
          <p className="text-gray-800 dark:text-gray-300">We exclusively provide resume optimization and analysis services. We do not engage in any prohibited activities or services. Our services include:</p>
          <ul className="list-disc pl-6 mb-4 text-gray-800 dark:text-gray-300">
            <li>Resume analysis and scoring</li>
            <li>ATS optimization suggestions</li>
            <li>Keyword analysis and recommendations</li>
            <li>Performance tracking and analytics</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">4. User Accounts</h2>
          <p className="text-gray-800 dark:text-gray-300">To access our services, you must create an account and agree to these terms. You are responsible for maintaining the confidentiality of your account credentials and ensuring the security of your account.</p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">5. Intellectual Property</h2>
          <p className="text-gray-800 dark:text-gray-300">All content, features, and functionality of the Resulient service are owned by the Company and are protected by international copyright, trademark, and other intellectual property laws. You retain ownership of your resume content while granting us permission to process it for service delivery.</p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">6. Acceptable Use</h2>
          <p className="text-gray-800 dark:text-gray-300">You agree not to:</p>
          <ul className="list-disc pl-6 mb-4 text-gray-800 dark:text-gray-300">
            <li>Use the service for any unlawful purpose or in violation of these terms</li>
            <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
            <li>Interfere with other users' access to the service or disrupt our operations</li>
            <li>Share your account credentials with others or create multiple accounts</li>
            <li>Upload malicious content or attempt to compromise our platform security</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">7. Data Processing and Privacy</h2>
          <p className="text-gray-800 dark:text-gray-300">We process your personal information and resume content in accordance with our Privacy Policy. By using our services, you consent to our data processing practices as outlined in our privacy documentation.</p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">8. Service Availability</h2>
          <p className="text-gray-800 dark:text-gray-300">While we strive to maintain continuous service availability, we do not guarantee uninterrupted access. We may perform maintenance, updates, or modifications that temporarily affect service availability.</p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">9. Termination</h2>
          <p className="text-gray-800 dark:text-gray-300">We reserve the right to terminate or suspend your account for violations of these terms or for any other reason at our sole discretion. You may also terminate your account at any time by contacting our support team.</p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">10. Changes to Terms</h2>
          <p className="text-gray-800 dark:text-gray-300">We may modify these terms at any time to reflect changes in our services, legal requirements, or business practices. Continued use of our service constitutes acceptance of any modifications.</p>

          <div className="mt-8 space-x-4">
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <Link to="/refund-policy" className="text-primary hover:underline">Refund Policy</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
