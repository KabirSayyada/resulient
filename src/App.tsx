
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResumeScoring from "./pages/ResumeScoring";
import SubscriptionDetails from "./pages/SubscriptionDetails";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import Pricing from "./pages/Pricing";
import ProfileSetup from "./pages/ProfileSetup";
import ProfileEdit from "./pages/ProfileEdit";
import Legal from "./pages/Legal";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import IndustryLeaderboard from "./pages/IndustryLeaderboard";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogCategory from "./pages/BlogCategory";
import BlogAdmin from "./pages/BlogAdmin";
import NotFound from "./pages/NotFound";
import Referrals from "./pages/Referrals";
import "./App.css";

const queryClient = new QueryClient();

function AppContent() {
  // Track referral on mount only for non-authenticated users
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('ref');
    
    if (referralCode) {
      // Store referral code in localStorage for later use when user signs up
      localStorage.setItem('pendingReferralCode', referralCode);
      console.log('Referral code stored:', referralCode);
    }
  }, []);
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/resume-scoring" element={<ResumeScoring />} />
      <Route path="/subscription-details" element={<SubscriptionDetails />} />
      <Route path="/subscription-success" element={<SubscriptionSuccess />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/profile-edit" element={<ProfileEdit />} />
      <Route path="/legal" element={<Legal />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/refund" element={<RefundPolicy />} />
      <Route path="/leaderboard" element={<IndustryLeaderboard />} />
      <Route path="/referrals" element={<Referrals />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/blog/category/:category" element={<BlogCategory />} />
      <Route path="/blog-admin" element={<BlogAdmin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
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
