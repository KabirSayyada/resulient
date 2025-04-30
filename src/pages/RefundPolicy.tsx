
import React from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">Refund Policy</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <section className="prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">1. Refund Eligibility</h2>
          <p className="text-gray-800 dark:text-gray-300">At Resulient, we want you to be completely satisfied with our services. We offer refunds under the following conditions:</p>
          <ul className="list-disc pl-6 mb-4 text-gray-800 dark:text-gray-300">
            <li>Within 14 days of purchase for monthly subscriptions</li>
            <li>Within 30 days of purchase for annual subscriptions</li>
            <li>Service unavailability or technical issues lasting more than 24 hours</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">2. Refund Process</h2>
          <p className="text-gray-800 dark:text-gray-300">To request a refund:</p>
          <ul className="list-disc pl-6 mb-4 text-gray-800 dark:text-gray-300">
            <li>Contact our support team at support@resulient.com</li>
            <li>Provide your account email and reason for the refund</li>
            <li>Allow up to 5-7 business days for processing</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">3. Non-Refundable Items</h2>
          <p className="text-gray-800 dark:text-gray-300">The following are not eligible for refunds:</p>
          <ul className="list-disc pl-6 mb-4 text-gray-800 dark:text-gray-300">
            <li>Promotional or discounted purchases</li>
            <li>Service used beyond the refund period</li>
            <li>Accounts terminated due to terms violations</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">4. Payment Method</h2>
          <p className="text-gray-800 dark:text-gray-300">Refunds will be processed to the original payment method used for the purchase. Processing time may vary depending on your payment provider.</p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">5. Cancellation Policy</h2>
          <p className="text-gray-800 dark:text-gray-300">You can cancel your subscription at any time:</p>
          <ul className="list-disc pl-6 mb-4 text-gray-800 dark:text-gray-300">
            <li>Access will continue until the end of your billing period</li>
            <li>No partial refunds for unused time</li>
            <li>Cancel at least 24 hours before renewal to avoid charges</li>
          </ul>

          <div className="mt-8 space-x-4">
            <Link to="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RefundPolicy;
