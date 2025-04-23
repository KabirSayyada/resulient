
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/hooks/useAuth";
import AuthPage from "./pages/Auth";
import ResumeScoring from "./pages/ResumeScoring";
import ProfileSetup from "@/pages/ProfileSetup";
import ProfileEdit from "@/pages/ProfileEdit";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";

const queryClient = new QueryClient();

// Route guard to require profile info after signup
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile(user?.id);

  if (loading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  // If user just signed up, profile (especially first/last name) is needed
  if (user && (!profile || !profile.first_name || !profile.last_name)) {
    return <Navigate to="/profile-setup" replace />;
  }

  return <>{children}</>;
}

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route path="/profile-edit" element={<ProfileEdit />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resume-scoring"
              element={
                <ProtectedRoute>
                  <ResumeScoring />
                </ProtectedRoute>
              }
            />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
