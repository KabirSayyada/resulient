
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import ResumeScoring from "@/pages/ResumeScoring";
import ATSResumeBuilder from "@/pages/ATSResumeBuilder";
import ProfileSetup from "@/pages/ProfileSetup";
import ProfileEdit from "@/pages/ProfileEdit";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import RefundPolicy from "@/pages/RefundPolicy";
import Legal from "@/pages/Legal";
import Pricing from "@/pages/Pricing";
import SubscriptionSuccess from "@/pages/SubscriptionSuccess";
import SubscriptionDetails from "@/pages/SubscriptionDetails";
import ReferralProgram from "@/pages/ReferralProgram";
// Blog imports
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import BlogCategory from "@/pages/BlogCategory";
import BlogAdmin from "@/pages/BlogAdmin";
import { Sitemap } from "@/components/blog/Sitemap";

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/resume-builder" element={<ATSResumeBuilder />} />
        <Route path="/resume-optimization" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/profile-edit" element={<ProfileEdit />} />
        <Route path="/resume-scoring" element={<ResumeScoring />} />
        <Route path="/ats-resume-builder" element={<ATSResumeBuilder />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/subscription-success" element={<SubscriptionSuccess />} />
        <Route path="/subscription" element={<SubscriptionDetails />} />
        <Route path="/referrals" element={<ReferralProgram />} />
        {/* Blog routes */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/blog/category/:category" element={<BlogCategory />} />
        <Route path="/blog/admin" element={<BlogAdmin />} />
        {/* SEO routes */}
        <Route path="/sitemap.xml" element={<Sitemap />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <Sonner />
    </ThemeProvider>
  );
}

export default App;
