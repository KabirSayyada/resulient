
import { Link } from "react-router-dom";

export const LegalFooter = () => {
  return (
    <div className="text-center text-sm text-gray-500">
      <div className="space-x-4">
        <Link to="/terms-of-service" className="hover:text-gray-700 hover:underline">Terms of Service</Link>
        <span>·</span>
        <Link to="/privacy-policy" className="hover:text-gray-700 hover:underline">Privacy Policy</Link>
        <span>·</span>
        <Link to="/refund-policy" className="hover:text-gray-700 hover:underline">Refund Policy</Link>
      </div>
    </div>
  );
};
