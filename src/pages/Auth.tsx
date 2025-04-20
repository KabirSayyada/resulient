
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AuthForm } from "@/components/auth/AuthForm";
import { Loader2 } from "lucide-react";

const AuthPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // If already logged in, redirect home
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-extrabold text-primary mb-2">Welcome Back!</h2>
          <p className="text-gray-500">Sign in or create an account to continue</p>
        </div>
        <AuthForm />
        <div className="mt-8 text-xs text-center text-gray-400">
          &copy; {new Date().getFullYear()} ATS Resume Optimizer
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
