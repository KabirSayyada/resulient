
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { lazy, Suspense, useEffect } from "react";
import { useHideToasterOnPathChange } from "@/hooks/useHideToasterOnPathChange";
import { Loader2 } from "lucide-react";

// Import pages
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const ResumeScoring = lazy(() => import("./pages/ResumeScoring"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogCategory = lazy(() => import("./pages/BlogCategory"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const BlogAdmin = lazy(() => import("./pages/BlogAdmin"));
const Legal = lazy(() => import("./pages/Legal"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const location = useLocation();
  
  // Track page views
  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-ZB5NWGMDTS", {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
  
  useHideToasterOnPathChange();

  return (
    <>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/resume-scoring" element={<ResumeScoring />} />
          
          {/* Blog routes */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/category/:categorySlug" element={<BlogCategory />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/blog/admin" element={<BlogAdmin />} />
          
          {/* Legal pages */}
          <Route path="/terms-of-service" element={<Legal key="terms" />} />
          <Route path="/privacy-policy" element={<Legal key="privacy" />} />
          <Route path="/refund-policy" element={<Legal key="refund" />} />
          
          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
