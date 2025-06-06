
import { ReferralDashboard } from "@/components/referral/ReferralDashboard";
import { MainNavigation } from "@/components/resume/MainNavigation";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const Referrals = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <MainNavigation />
      <div className="container mx-auto px-4 py-8">
        <ReferralDashboard />
      </div>
    </div>
  );
};

export default Referrals;
