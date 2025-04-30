
import React from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const Legal = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">Legal Information</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Terms of Service, Privacy Policy, and Refund Policy for Resulient</p>
        </div>

        {/* Terms of Service */}
        <section className="prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Terms of Service</h2>
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h3 className="text-xl font-semibold mb-3">1. Introduction</h3>
          <p>Welcome to Resulient ("we," "our," or "us"). By accessing or using our AI-powered resume optimization service, you agree to be bound by these Terms of Service.</p>
          
          <h3 className="text-xl font-semibold mb-3">2. Services</h3>
          <p>Resulient provides AI-powered resume optimization services to help users improve their resumes for better performance with Applicant Tracking Systems (ATS). Our services include resume scoring, keyword analysis, and improvement suggestions.</p>
          
          <h3 className="text-xl font-semibold mb-3">3. User Accounts</h3>
          <p>To access our services, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
          
          <h3 className="text-xl font-semibold mb-3">4. User Content</h3>
          <p>You retain all rights to your resume content. By using our service, you grant us permission to analyze and process your resume to provide our services.</p>
        </section>

        {/* Privacy Policy */}
        <section className="prose max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy Policy</h2>
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h3 className="text-xl font-semibold mb-3">1. Information We Collect</h3>
          <p>We collect information you provide, including:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Account information (email, password)</li>
            <li>Resume content for analysis</li>
            <li>Usage data to improve our services</li>
          </ul>
          
          <h3 className="text-xl font-semibold mb-3">2. How We Use Your Information</h3>
          <p>We use your information to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide resume optimization services</li>
            <li>Improve our AI algorithms</li>
            <li>Communicate about service updates</li>
          </ul>
          
          <h3 className="text-xl font-semibold mb-3">3. Data Security</h3>
          <p>We implement security measures to protect your personal information and resume content. Your data is encrypted and stored securely.</p>
        </section>

        {/* Refund Policy */}
        <section className="prose max-w-none mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Policy</h2>
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h3 className="text-xl font-semibold mb-3">1. Refund Eligibility</h3>
          <p>We offer refunds within 14 days of purchase if you are not satisfied with our services. To request a refund, contact our support team.</p>
          
          <h3 className="text-xl font-semibold mb-3">2. Refund Process</h3>
          <p>Refunds will be processed using your original payment method. Processing time may vary depending on your payment provider.</p>
          
          <h3 className="text-xl font-semibold mb-3">3. Exclusions</h3>
          <p>Refunds may not be available for certain promotional offers or discounted services. These exceptions will be clearly stated at the time of purchase.</p>
        </section>

        <div className="text-center">
          <Link to="/auth" className="text-primary hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Legal;
