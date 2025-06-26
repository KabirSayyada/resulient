
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { useReferralTracking } from "@/hooks/useReferralTracking";
import Index from "./pages/Index";
import ATSResumeBuilder from "./pages/ATSResumeBuilder";
import ResumeScoring from "./pages/ResumeScoring";
import Auth from "./pages/Auth";
import ProfileSetup from "./pages/ProfileSetup";
import ProfileEdit from "./pages/ProfileEdit";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import SubscriptionDetails from "./pages/SubscriptionDetails";
import Pricing from "./pages/Pricing";
import ReferralProgram from "./pages/ReferralProgram";
import IndustryLeaderboard from "./pages/IndustryLeaderboard";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogCategory from "./pages/BlogCategory";
import BlogAdmin from "./pages/BlogAdmin";
import Legal from "./pages/Legal";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import Jobs from "./pages/Jobs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  useReferralTracking();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/resume-builder" element={<ATSResumeBuilder />} />
      <Route path="/resume-scoring" element={<ResumeScoring />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/profile-edit" element={<ProfileEdit />} />
      <Route path="/subscription-success" element={<SubscriptionSuccess />} />
      <Route path="/subscription" element={<SubscriptionDetails />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/referrals" element={<ReferralProgram />} />
      <Route path="/leaderboard" element={<IndustryLeaderboard />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/blog/category/:category" element={<BlogCategory />} />
      <Route path="/blog-admin" element={<BlogAdmin />} />
      <Route path="/legal" element={<Legal />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/refund-policy" element={<RefundPolicy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="resulient-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
