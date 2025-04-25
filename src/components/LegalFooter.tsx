
import { Link } from "react-router-dom";

export const LegalFooter = () => {
  return (
    <div className="mt-6 text-xs text-center text-gray-400">
      <Link to="/terms-of-service" className="text-primary hover:underline">Terms</Link>
      {" · "}
      <Link to="/privacy-policy" className="text-primary hover:underline">Privacy</Link>
      {" · "}
      <Link to="/refund-policy" className="text-primary hover:underline">Refunds</Link>
    </div>
  );
};
