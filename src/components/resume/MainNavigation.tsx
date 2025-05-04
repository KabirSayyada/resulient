
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { FileText, BarChart3, ArrowUpRight, Crown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useSubscription } from "@/hooks/useSubscription";

export const MainNavigation = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { subscription } = useSubscription();
  
  if (!user) return null;
  
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 mb-6 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
      <Link
        to="/"
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
          location.pathname === "/" ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-medium" : ""
        }`}
      >
        <span className="sr-only">Dashboard</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="h-5 w-5"
        >
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
        Dashboard
      </Link>

      <Link
        to="/resume-scoring"
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
          location.pathname === "/resume-scoring" ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-medium" : ""
        }`}
      >
        <FileText className="h-5 w-5" />
        Score Resume
      </Link>

      <Link
        to="/industry-leaderboard"
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
          location.pathname === "/industry-leaderboard" ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-medium" : ""
        }`}
      >
        <BarChart3 className="h-5 w-5" />
        Leaderboard
      </Link>
      
      <Link
        to="/subscription"
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
          location.pathname === "/subscription" ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-medium" : ""
        }`}
      >
        <Crown className="h-5 w-5" />
        My Subscription
      </Link>

      <div className="flex-1"></div>

      {subscription.tier === "free" && (
        <Button asChild size="sm" className="ml-auto bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600">
          <Link to="/pricing">
            Upgrade <ArrowUpRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  );
};
