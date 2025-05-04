
import { useEffect } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { Diamond, Crown, CheckCircle, ArrowUpRight, Calendar, ArrowLeft, Sparkles, Download, Clock, Lock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LegalFooter } from "@/components/layout/LegalFooter";
import { Separator } from "@/components/ui/separator";
import { UserMenuWithTheme } from "@/components/theme/UserMenuWithTheme";
import { SubscriptionTierIndicator } from "@/components/subscription/SubscriptionTierIndicator";

interface FeatureItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  value: string | number;
  maxValue?: number;
  isPremium?: boolean;
}

const FeatureItem = ({ title, description, icon, value, maxValue, isPremium = false }: FeatureItemProps) => (
  <div className={`p-5 rounded-lg border ${isPremium ? 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950' : 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950'}`}>
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center gap-2">
        <div className={`rounded-full p-1.5 ${isPremium ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400' : 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'}`}>
          {icon}
        </div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className={`font-bold ${isPremium ? 'text-purple-600 dark:text-purple-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
        {value}
      </div>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    {maxValue !== undefined && value !== "Unlimited" && (
      <div className="mt-3">
        <Progress value={(Number(value) / maxValue) * 100} className="h-2" />
        <div className="flex justify-between text-xs mt-1 text-gray-500">
          <span>Used: {value}</span>
          <span>Limit: {maxValue}</span>
        </div>
      </div>
    )}
  </div>
);

const SubscriptionDetails = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { subscription, refreshSubscription } = useSubscription();
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    
    // Refresh subscription data when the page loads
    refreshSubscription();
  }, [user, authLoading, navigate, refreshSubscription]);
  
  if (authLoading || subscription.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl font-semibold text-gray-600 dark:text-gray-400">
          Loading subscription details...
        </div>
      </div>
    );
  }
  
  // Format expiration date
  const expirationDate = subscription.expiresAt 
    ? new Date(subscription.expiresAt).toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : null;
    
  // Get appropriate tier color
  const getTierColors = () => {
    switch(subscription.tier) {
      case "platinum":
        return {
          bg: "from-purple-500 to-indigo-600",
          text: "text-purple-100",
          accent: "text-purple-300",
          border: "border-purple-400",
          icon: <Crown className="h-10 w-10 text-purple-300" />
        };
      case "premium":
        return {
          bg: "from-indigo-500 to-blue-600",
          text: "text-indigo-100",
          accent: "text-indigo-300",
          border: "border-indigo-400",
          icon: <Diamond className="h-10 w-10 text-indigo-300" />
        };
      default:
        return {
          bg: "from-gray-600 to-gray-700",
          text: "text-gray-200",
          accent: "text-gray-300",
          border: "border-gray-500",
          icon: <Sparkles className="h-10 w-10 text-gray-300" />
        };
    }
  };
  
  const tierColors = getTierColors();
  
  // Get tier-specific content
  const getTierContent = () => {
    switch(subscription.tier) {
      case "platinum":
        return {
          title: "Platinum",
          description: "You're enjoying our most comprehensive plan with access to all premium features.",
          features: [
            { 
              title: "Resume Scorings", 
              description: "Benchmark your resume against industry standards with detailed analytics.", 
              icon: <CheckCircle className="h-4 w-4" />,
              value: "Unlimited" 
            },
            { 
              title: "Resume Optimizations", 
              description: "AI-powered resume enhancements tailored to specific job descriptions.", 
              icon: <CheckCircle className="h-4 w-4" />,
              value: "Unlimited" 
            },
            { 
              title: "Report Downloads", 
              description: "Download comprehensive resume analysis reports in PDF format.", 
              icon: <Download className="h-4 w-4" />,
              value: "Unlimited" 
            },
            { 
              title: "Resume Comparison", 
              description: "Compare different versions of your resume to track improvements over time.", 
              icon: <CheckCircle className="h-4 w-4" />,
              value: "Unlimited",
              isPremium: true
            },
            { 
              title: "Early Access Features", 
              description: "Be the first to try new features and tools before they're widely available.", 
              icon: <Crown className="h-4 w-4" />,
              value: "Included",
              isPremium: true
            },
          ]
        };
      case "premium":
        return {
          title: "Premium",
          description: "You're on our popular plan with access to most premium features.",
          features: [
            { 
              title: "Resume Scorings", 
              description: "Benchmark your resume against industry standards with detailed analytics.", 
              icon: <CheckCircle className="h-4 w-4" />,
              value: "Unlimited" 
            },
            { 
              title: "Resume Optimizations", 
              description: "AI-powered resume enhancements tailored to specific job descriptions.", 
              icon: <CheckCircle className="h-4 w-4" />,
              value: "Unlimited" 
            },
            { 
              title: "Report Downloads", 
              description: "Download comprehensive resume analysis reports in PDF format.", 
              icon: <Download className="h-4 w-4" />,
              value: 10,
              maxValue: 10
            },
            { 
              title: "Resume Comparison", 
              description: "Compare different versions of your resume to track improvements over time.", 
              icon: <Lock className="h-4 w-4" />,
              value: "Not Available",
              isPremium: true
            },
          ]
        };
      default:
        return {
          title: "Free",
          description: "You're on our free tier with basic features and daily limits.",
          features: [
            { 
              title: "Resume Scorings", 
              description: "Benchmark your resume against industry standards with detailed analytics.", 
              icon: <Clock className="h-4 w-4" />,
              value: 2,
              maxValue: 2
            },
            { 
              title: "Resume Optimizations", 
              description: "AI-powered resume enhancements tailored to specific job descriptions.", 
              icon: <Clock className="h-4 w-4" />,
              value: 1,
              maxValue: 1
            },
            { 
              title: "Report Downloads", 
              description: "Download comprehensive resume analysis reports in PDF format.", 
              icon: <Lock className="h-4 w-4" />,
              value: "Not Available"
            },
            { 
              title: "Resume Comparison", 
              description: "Compare different versions of your resume to track improvements over time.", 
              icon: <Lock className="h-4 w-4" />,
              value: "Not Available",
              isPremium: true
            },
          ]
        };
    }
  };
  
  const tierContent = getTierContent();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/" className="flex items-center">
              <span className="font-brand text-3xl sm:text-5xl font-extrabold text-transparent bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-yellow-400 bg-clip-text animate-fade-in drop-shadow-lg tracking-tight select-none">
                Resulient
              </span>
            </Link>
            <Badge className="rounded-full px-3 py-1 text-xs sm:text-sm font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 shadow border border-indigo-200 dark:border-indigo-700 animate-fade-in whitespace-nowrap">
              Subscription
            </Badge>
          </div>
          <div className="flex justify-between items-center w-full sm:w-auto mt-2 sm:mt-0">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1"
              asChild
            >
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-2 sm:gap-3">
              <SubscriptionTierIndicator variant="badge" size="sm" />
              <UserMenuWithTheme />
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <Card className="overflow-hidden">
            <div className={`bg-gradient-to-r ${tierColors.bg} p-6 text-white`}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className={`text-3xl font-bold ${tierColors.text}`}>
                    {tierContent.title} Plan
                  </h2>
                  <p className={`mt-2 ${tierColors.accent}`}>
                    {tierContent.description}
                  </p>
                  
                  {expirationDate && subscription.tier !== "free" && (
                    <div className={`mt-4 flex items-center gap-2 ${tierColors.text} text-sm border px-3 py-1.5 rounded-full inline-block ${tierColors.border}`}>
                      <Calendar className="h-4 w-4" />
                      {subscription.billingCycle === "yearly" ? "Yearly Plan" : "Monthly Plan"} · Renews {expirationDate}
                    </div>
                  )}
                </div>
                <div className="rounded-full bg-white/10 p-3">
                  {tierColors.icon}
                </div>
              </div>
            </div>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Your Plan Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tierContent.features.map((feature, index) => (
                  <FeatureItem 
                    key={index}
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                    value={feature.value}
                    maxValue={feature.maxValue}
                    isPremium={feature.isPremium}
                  />
                ))}
              </div>
              
              {subscription.tier === "free" && (
                <div className="mt-8 text-center">
                  <div className="text-lg font-semibold mb-2">Ready to unlock unlimited potential?</div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Upgrade to Premium or Platinum for unlimited resume scorings and optimizations.
                  </p>
                  <Button asChild className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600">
                    <Link to="/pricing">
                      View Pricing Plans
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
              
              {(subscription.tier === "premium") && (
                <div className="mt-8 p-4 border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full p-2 bg-purple-100 dark:bg-purple-900">
                      <Crown className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-purple-700 dark:text-purple-300">Upgrade to Platinum</h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Get unlimited report downloads, resume comparison tool, and early access to new features.
                      </p>
                      <Button asChild className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
                        <Link to="/pricing">
                          Upgrade Now
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Need help with your subscription? Contact us at support@resulient.com
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/pricing">
                  View All Plans
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-12">
          <LegalFooter />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetails;
