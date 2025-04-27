
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, BarChart2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export const MainNavigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const isAtHomePage = location.pathname === "/";
  const isAtScoringPage = location.pathname === "/resume-scoring";

  return (
    <div className="flex flex-wrap gap-3 justify-center sm:justify-start mb-6 mt-2">
      <Button
        variant={isAtHomePage ? "default" : "outline"}
        size={isMobile ? "sm" : "default"}
        asChild
        className={`flex items-center gap-2 ${
          isAtHomePage 
            ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white font-semibold" 
            : "border-indigo-300"
        }`}
      >
        <Link to="/">
          <FileText className="h-4 w-4" />
          <span>ATS Optimizer</span>
        </Link>
      </Button>
      <Button
        variant={isAtScoringPage ? "default" : "outline"}
        size={isMobile ? "sm" : "default"}
        asChild
        className={`flex items-center gap-2 ${
          isAtScoringPage 
            ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white font-semibold" 
            : "border-indigo-300"
        }`}
      >
        <Link to="/resume-scoring">
          <BarChart2 className="h-4 w-4" />
          <span>Resume Scoring</span>
        </Link>
      </Button>
    </div>
  );
};
