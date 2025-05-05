
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { LegalFooter } from "@/components/layout/LegalFooter";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="flex-grow flex items-center justify-center bg-gray-100 px-4">
        <div className="text-center max-w-md w-full">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
          <p className="text-gray-500 mb-8">
            We couldn't find the page you were looking for. It might have been moved or deleted.
          </p>
          <a 
            href="/" 
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </a>
        </div>
      </div>
      <LegalFooter />
    </div>
  );
};

export default NotFound;
