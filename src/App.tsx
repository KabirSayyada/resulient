
import React, { Suspense, lazy } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";

// Lazy load routes
const NotFound = lazy(() => import("./pages/NotFound"));
const Auth = lazy(() => import("./pages/Auth"));
const ResumeScoring = lazy(() => import("./pages/ResumeScoring"));
const Pricing = lazy(() => import("./pages/Pricing"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const Legal = lazy(() => import("./pages/Legal"));
const ProfileSetup = lazy(() => import("./pages/ProfileSetup"));
const ProfileEdit = lazy(() => import("./pages/ProfileEdit"));
const SitemapRoute = lazy(() => import("./components/routes/SitemapRoute"));
const BlogAdmin = lazy(() => import("./pages/BlogAdmin"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const BlogCategory = lazy(() => import("./pages/BlogCategory"));
const IndustryLeaderboard = lazy(() => import("./pages/IndustryLeaderboard"));
const SubscriptionDetails = lazy(() => import("./pages/SubscriptionDetails"));
const SubscriptionSuccess = lazy(() => import("./pages/SubscriptionSuccess"));

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="resulient-theme">
        <HelmetProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route
                path="/auth"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <Auth />
                  </Suspense>
                }
              />
              <Route
                path="/resume-scoring"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <ResumeScoring />
                  </Suspense>
                }
              />
              <Route
                path="/pricing"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <Pricing />
                  </Suspense>
                }
              />
              <Route
                path="/terms"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <TermsOfService />
                  </Suspense>
                }
              />
              <Route
                path="/privacy"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <PrivacyPolicy />
                  </Suspense>
                }
              />
              <Route
                path="/refund-policy"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <RefundPolicy />
                  </Suspense>
                }
              />
              <Route
                path="/legal"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <Legal />
                  </Suspense>
                }
              />
              <Route
                path="/profile-setup"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <ProfileSetup />
                  </Suspense>
                }
              />
              <Route
                path="/profile-edit"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <ProfileEdit />
                  </Suspense>
                }
              />
              <Route
                path="/blog"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <Blog />
                  </Suspense>
                }
              />
              <Route
                path="/blog/:slug"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <BlogPost />
                  </Suspense>
                }
              />
              <Route
                path="/blog/category/:category"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <BlogCategory />
                  </Suspense>
                }
              />
              <Route
                path="/blog/admin"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <BlogAdmin />
                  </Suspense>
                }
              />
              <Route
                path="/industry-leaderboard"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <IndustryLeaderboard />
                  </Suspense>
                }
              />
              <Route
                path="/subscription-details"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <SubscriptionDetails />
                  </Suspense>
                }
              />
              <Route
                path="/subscription-success"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <SubscriptionSuccess />
                  </Suspense>
                }
              />
              {/* Add sitemap.xml route */}
              <Route
                path="/sitemap.xml"
                element={
                  <Suspense fallback={null}>
                    <SitemapRoute />
                  </Suspense>
                }
              />
              <Route
                path="*"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <NotFound />
                  </Suspense>
                }
              />
            </Routes>
            <Toaster position="top-right" richColors />
          </BrowserRouter>
        </HelmetProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
