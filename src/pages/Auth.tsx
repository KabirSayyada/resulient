import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AuthForm } from "@/components/auth/AuthForm";
import { Loader2 } from "lucide-react";

const AuthPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
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
          <span className="font-brand text-4xl sm:text-5xl font-extrabold text-transparent bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-yellow-400 bg-clip-text animate-fade-in drop-shadow-lg tracking-tight select-none inline-block mb-2">
            Resulient
          </span>
          <h2 className="text-3xl font-extrabold text-primary mb-2 mt-2">Welcome Back!</h2>
          <p className="text-gray-600 text-base">
            Join <span className="text-fuchsia-700 font-bold">Resulient</span> and unlock the superpower of a resume that stands out!<br className="hidden sm:block" />
            With Resulient, you’ll:
          </p>
          <ul className="mt-3 mb-0 space-y-1 text-left text-sm text-indigo-600 font-medium ml-6">
            <li>• Discover how your resume measures up, instantly</li>
            <li>• Get tailored suggestions to beat any ATS or recruiter</li>
            <li>• Access your resume progress and scoring history</li>
          </ul>
        </div>
        <AuthForm />
        <div className="mt-8 text-xs text-center text-gray-400">
          By signing up, you agree to our{" "}
          <Link to="/legal" className="text-primary hover:underline">
            Terms of Service, Privacy Policy, and Refund Policy
          </Link>
          <br />
          &copy; {new Date().getFullYear()} ATS Resume Optimizer
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
