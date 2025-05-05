
import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Helmet } from "react-helmet-async";
import { LegalFooter } from "@/components/layout/LegalFooter";

const Legal = () => {
  const { page } = useParams<{ page: string }>();
  
  // Determine which content to show based on the route
  let title = "";
  let content = null;
  
  switch (page) {
    case "terms-of-service":
      title = "Terms of Service";
      content = <TermsOfService />;
      break;
    case "privacy-policy":
      title = "Privacy Policy";
      content = <PrivacyPolicy />;
      break;
    case "refund-policy":
      title = "Refund Policy";
      content = <RefundPolicy />;
      break;
    default:
      return <Navigate to="/not-found" />;
  }
  
  return (
    <>
      <Helmet>
        <title>{title} | Resulient</title>
        <meta name="description" content={`${title} for Resulient resume optimization services.`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center">
            <Link to="/" className="inline-block mb-6">
              <span className="font-brand text-3xl sm:text-4xl font-extrabold text-transparent bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-yellow-400 bg-clip-text drop-shadow-lg tracking-tight select-none">
                Resulient
              </span>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">{title}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Content */}
          <section className="prose dark:prose-invert max-w-none">
            {content}
          </section>

          <div className="text-center pt-8">
            <Link to="/" className="text-primary hover:underline">
              Back to Home
            </Link>
          </div>
          
          <LegalFooter />
        </div>
      </div>
    </>
  );
};

// Terms of Service content
function TermsOfService() {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">1. Introduction</h2>
      <p>Welcome to Resulient ("we," "our," or "us"). By accessing or using our AI-powered resume optimization service, you agree to be bound by these Terms of Service.</p>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">2. Services</h2>
      <p>Resulient provides AI-powered resume optimization services to help users improve their resumes for better performance with Applicant Tracking Systems (ATS). Our services include resume scoring, keyword analysis, and improvement suggestions.</p>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">3. User Accounts</h2>
      <p>To access our services, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">4. User Content</h2>
      <p>You retain all rights to your resume content. By using our service, you grant us permission to analyze and process your resume to provide our services.</p>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">5. Payment and Subscription</h2>
      <p>Some features of our service may require a subscription. By subscribing to our premium services, you agree to pay the fees as described at the time of purchase.</p>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">6. Termination</h2>
      <p>We reserve the right to terminate or suspend your account at our discretion, without notice, particularly if you violate these Terms of Service.</p>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">7. Changes to Terms</h2>
      <p>We may modify these Terms of Service at any time. Continued use of our service after such changes constitutes your acceptance of the new terms.</p>
    </>
  );
}

// Privacy Policy content
function PrivacyPolicy() {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">1. Information We Collect</h2>
      <p>We collect information you provide, including:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Account information (email, password)</li>
        <li>Resume content for analysis</li>
        <li>Usage data to improve our services</li>
      </ul>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">2. How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Provide resume optimization services</li>
        <li>Improve our AI algorithms</li>
        <li>Communicate about service updates</li>
      </ul>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">3. Data Security</h2>
      <p>We implement security measures to protect your personal information and resume content. Your data is encrypted and stored securely.</p>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">4. Cookies and Tracking</h2>
      <p>We use cookies and similar technologies to enhance your experience, analyze usage, and assist in our marketing efforts.</p>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">5. Third-Party Services</h2>
      <p>We may use third-party services to help analyze how our service is used. These services may collect information about your use of our site.</p>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">6. Your Rights</h2>
      <p>You have rights regarding your personal data, including the right to access, correct, or delete your personal information. Contact us to exercise these rights.</p>
    </>
  );
}

// Refund Policy content
function RefundPolicy() {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">1. Refund Eligibility</h2>
      <p>We offer refunds within 14 days of purchase if you are not satisfied with our services. To request a refund, contact our support team.</p>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">2. Refund Process</h2>
      <p>Refunds will be processed using your original payment method. Processing time may vary depending on your payment provider.</p>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">3. Exclusions</h2>
      <p>Refunds may not be available for certain promotional offers or discounted services. These exceptions will be clearly stated at the time of purchase.</p>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">4. Cancellation</h2>
      <p>You may cancel your subscription at any time. Upon cancellation, you will continue to have access to the service until the end of your current billing period.</p>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">5. Changes to Refund Policy</h2>
      <p>We reserve the right to modify this refund policy at any time. Changes will be effective immediately upon posting on our website.</p>
    </>
  );
}

export default Legal;
