
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResumeScoring from "./pages/ResumeScoring";
import ATSResumeBuilder from "./pages/ATSResumeBuilder";
import Jobs from "./pages/Jobs";
import Pricing from "./pages/Pricing";
import PaystackCheckout from "./pages/PaystackCheckout";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import SubscriptionDetails from "./pages/SubscriptionDetails";
import ProfileSetup from "./pages/ProfileSetup";
import ProfileEdit from "./pages/ProfileEdit";
import ReferralProgram from "./pages/ReferralProgram";
import IndustryLeaderboard from "./pages/IndustryLeaderboard";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import Legal from "./pages/Legal";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogCategory from "./pages/BlogCategory";
import BlogAdmin from "./pages/BlogAdmin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Helmet>
              <title>Resulient - AI-Powered Resume Optimization</title>
              <meta name="description" content="Optimize your resume with AI-powered insights, get detailed scoring, and improve your job application success rate." />
            </Helmet>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/resume-scoring" element={<ResumeScoring />} />
                <Route path="/ats-resume-builder" element={<ATSResumeBuilder />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/checkout" element={<PaystackCheckout />} />
                <Route path="/subscription-success" element={<SubscriptionSuccess />} />
                <Route path="/subscription-details" element={<SubscriptionDetails />} />
                <Route path="/profile-setup" element={<ProfileSetup />} />
                <Route path="/profile-edit" element={<ProfileEdit />} />
                <Route path="/referrals" element={<ReferralProgram />} />
                <Route path="/leaderboard" element={<IndustryLeaderboard />} />
                <Route path="/legal" element={<Legal />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/category/:categorySlug" element={<BlogCategory />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/blog-admin" element={<BlogAdmin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
