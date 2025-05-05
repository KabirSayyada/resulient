
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AuthForm } from "@/components/auth/AuthForm";
import { Loader2, Shield } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Helmet } from "react-helmet-async";

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
    <>
      <Helmet>
        <title>Secure Login | Resulient</title>
        <meta name="description" content="Securely log in to your Resulient account to access resume optimization tools and career resources." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 px-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md border border-gray-100 dark:border-gray-700">
          <div className="mb-6 text-center">
            <span className="font-brand text-4xl font-extrabold text-transparent bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-yellow-400 bg-clip-text animate-fade-in drop-shadow-lg tracking-tight select-none inline-block mb-2">
              Resulient
            </span>
            <div className="flex items-center justify-center mb-2">
              <Shield className="h-5 w-5 text-green-500 mr-2" />
              <h2 className="text-2xl font-bold text-primary dark:text-primary-foreground">Secure Login</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Your data is protected with industry-standard encryption
            </p>
            <div className="mt-3 mb-0 space-y-1 text-left text-sm text-indigo-600 dark:text-indigo-400 font-medium ml-6">
              <p className="text-center text-gray-600 dark:text-gray-400 mb-4 mt-2">
                Sign in to <span className="text-fuchsia-700 dark:text-fuchsia-400 font-bold">Resulient</span> to:
              </p>
              <div className="px-4 sm:px-6">
                <ul className="space-y-1">
                  <li>• Optimize your resume for any job application</li>
                  <li>• Track your resume performance metrics</li>
                  <li>• Get tailored feedback to improve your job search</li>
                </ul>
              </div>
            </div>
          </div>
          <AuthForm />
          <div className="mt-8 text-xs text-center text-gray-400 dark:text-gray-500">
            By signing up, you agree to our{" "}
            <Link to="/terms-of-service" className="text-primary hover:underline">
              Terms of Service
            </Link>
            ,{" "}
            <Link to="/privacy-policy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            , and{" "}
            <Link to="/refund-policy" className="text-primary hover:underline">
              Refund Policy
            </Link>
            <br />
            &copy; {new Date().getFullYear()} Resulient
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
