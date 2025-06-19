
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, CheckCircle, Loader2, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LegalFooter } from "@/components/layout/LegalFooter";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingTier {
  name: string;
  description: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  features: PricingFeature[];
  badge?: string;
  popular?: boolean;
  productId: {
    monthly: string | null;
    yearly: string | null;
  };
}

const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    description: "Perfect for trying out Resulient",
    monthlyPrice: null,
    yearlyPrice: null,
    features: [
      { text: "2 Resume Scorings Daily", included: true },
      { text: "1 Resume Optimization Daily", included: true },
      { text: "Detailed Reports (View Only)", included: true },
      { text: "Daily Reset of Credits", included: true },
      { text: "Basic Support", included: true },
      { text: "Report Downloads", included: false },
      { text: "Resume Comparison", included: false },
      { text: "Unlimited Optimizations", included: false },
    ],
    badge: "Free Forever",
    productId: {
      monthly: null,
      yearly: null
    }
  },
  {
    name: "Premium",
    description: "For serious job seekers",
    monthlyPrice: 10,
    yearlyPrice: 99,
    features: [
      { text: "Unlimited Resume Scorings", included: true },
      { text: "Unlimited Resume Optimizations", included: true },
      { text: "10 Report Downloads Daily", included: true },
      { text: "Priority Support", included: true },
      { text: "All Free Features", included: true },
      { text: "Advanced Analytics", included: true },
      { text: "Resume Comparison", included: false },
      { text: "Unlimited Downloads", included: false },
    ],
    badge: "Most Popular",
    popular: true,
    productId: {
      monthly: "premium-monthly",
      yearly: "premium-yearly"
    }
  },
  {
    name: "Platinum",
    description: "Maximum flexibility and power",
    monthlyPrice: 18,
    yearlyPrice: 180,
    features: [
      { text: "Unlimited Resume Scorings", included: true },
      { text: "Unlimited Resume Optimizations", included: true },
      { text: "Unlimited Report Downloads", included: true },
      { text: "Resume Comparison Tool", included: true },
      { text: "Priority Support", included: true },
      { text: "All Premium Features", included: true },
      { text: "Advanced Analytics", included: true },
      { text: "Early Access to New Features", included: true },
    ],
    badge: "Best Value",
    productId: {
      monthly: "platinum-monthly",
      yearly: "platinum-yearly"
    }
  }
];

const PricingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { subscription, checkout } = useSubscription();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly'); // Changed default to 'monthly'
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handlePurchase = async (tier: PricingTier) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in or create an account to subscribe.",
      });
      navigate("/auth");
      return;
    }

    try {
      setLoadingTier(tier.name);
      const productId = billingCycle === 'yearly' ? tier.productId.yearly : tier.productId.monthly;
      
      if (!productId) {
        if (tier.name === "Free") {
          toast({
            title: "Free Tier",
            description: "You're already on the free tier. No purchase necessary.",
          });
        }
        setLoadingTier(null);
        return;
      }

      const checkoutData = await checkout(productId);
      
      if (checkoutData?.checkoutUrl) {
        // Success - redirect to Gumroad
        window.location.href = checkoutData.checkoutUrl;
      } else {
        toast({
          title: "Checkout Error",
          description: "Unable to start checkout process. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast({
        title: "Payment Error",
        description: "There was a problem initiating checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingTier(null);
    }
  };

  // Determine if user is already on a paid plan
  const isCurrentSubscriber = subscription.tier !== "free" && !subscription.isLoading;
  const currentTierName = subscription.tier === "premium" ? "Premium" : subscription.tier === "platinum" ? "Platinum" : "Free";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 px-4 py-12">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="font-brand text-4xl sm:text-5xl font-extrabold text-transparent bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-yellow-400 bg-clip-text animate-fade-in drop-shadow-lg tracking-tight select-none inline-block mb-6">
            Resulient
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
            Investment in Your Career
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Getting your dream job shouldn't be a dream. We're changing that by making professional resume optimization accessible to everyone. Start with our free tier or unlock unlimited potential with our premium plans.
          </p>
          
          {isCurrentSubscriber && (
            <div className="mt-6 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-full shadow-sm border border-green-300 dark:border-green-700">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="font-medium text-green-800 dark:text-green-300">
                You're currently on the <span className="font-bold">{currentTierName} Plan</span>
              </span>
            </div>
          )}
          
          {/* Tabs for billing cycle selection, with monthly as default */}
          <div className="mt-8">
            <Tabs 
              defaultValue="monthly" 
              value={billingCycle}
              onValueChange={(value) => setBillingCycle(value as 'monthly' | 'yearly')}
              className="max-w-xs mx-auto"
            >
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="monthly" className="relative px-6">
                  Monthly
                </TabsTrigger>
                <TabsTrigger value="yearly" className="relative px-6">
                  Yearly
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">Save 20%</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-indigo-100 dark:border-indigo-900">
            <Star className="h-8 w-8 text-yellow-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Stand Out</h3>
            <p className="text-gray-600 dark:text-gray-300">Get noticed by both ATS systems and human recruiters with our optimized resumes.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-indigo-100 dark:border-indigo-900">
            <CheckCircle className="h-8 w-8 text-green-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Proven Results</h3>
            <p className="text-gray-600 dark:text-gray-300">Our users report higher interview rates and faster job placements.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-indigo-100 dark:border-indigo-900">
            <Star className="h-8 w-8 text-purple-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Expert Guidance</h3>
            <p className="text-gray-600 dark:text-gray-300">Get detailed insights and suggestions from our advanced AI system.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {pricingTiers.map((tier) => (
            <Card key={tier.name} className={`relative ${
              tier.popular 
                ? 'border-2 border-indigo-500 shadow-xl dark:border-indigo-400' 
                : 'border border-gray-200 dark:border-gray-700 shadow-md'
            }`}>
              {tier.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500">
                  {tier.badge}
                </Badge>
              )}
              <CardHeader className="text-center pt-8">
                <h3 className="text-2xl font-bold dark:text-white">{tier.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">{tier.description}</p>
                <div className="mt-4">
                  {tier.monthlyPrice ? (
                    <>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-4xl font-bold dark:text-white">
                          ${billingCycle === 'yearly' ? tier.yearlyPrice : tier.monthlyPrice}
                        </span>
                        <span className="text-gray-600 dark:text-gray-300">
                          {billingCycle === 'yearly' ? "/year" : "/month"}
                        </span>
                      </div>
                      {billingCycle === 'yearly' && (
                        <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                          Save ${Math.round(tier.monthlyPrice! * 12 - tier.yearlyPrice!)} per year
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-4xl font-bold dark:text-white">Free</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className={`h-5 w-5 ${
                        feature.included ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'
                      }`} />
                      <span className={feature.included ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handlePurchase(tier)}
                  disabled={loadingTier === tier.name || (subscription.tier === tier.name.toLowerCase() && subscription.tier !== "free")}
                  className={`w-full ${
                    tier.popular
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
                      : ''
                  }`}
                >
                  {loadingTier === tier.name ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : subscription.tier === tier.name.toLowerCase() && subscription.tier !== "free" ? (
                    "Current Plan"
                  ) : (
                    <>
                      {tier.monthlyPrice ? 'Get Started' : 'Try for Free'}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-20 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <AccordionItem value="item-1">
              <AccordionTrigger>What happens when I reach my daily limit on the free tier?</AccordionTrigger>
              <AccordionContent>
                Your daily limits reset at midnight UTC. Until then, you can continue viewing your previous results and reports, but you'll need to wait for the reset to perform new scans or optimizations.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Can I switch between monthly and yearly billing?</AccordionTrigger>
              <AccordionContent>
                Yes! You can switch between monthly and yearly billing at any time. If you switch to yearly, you'll immediately benefit from the discounted rate. If you switch to monthly, the change will take effect at your next billing cycle.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
              <AccordionContent>
                We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. All payments are processed securely through our payment processor.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Is there a difference in features between monthly and yearly subscriptions?</AccordionTrigger>
              <AccordionContent>
                No, you get exactly the same features whether you choose monthly or yearly billing. The only difference is that yearly subscribers enjoy significant savings on their subscription cost.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Can I cancel my subscription at any time?</AccordionTrigger>
              <AccordionContent>
                Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period. We don't offer refunds for partial months, but you can check our refund policy for more details.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>What happens to my saved reports if I downgrade to the free tier?</AccordionTrigger>
              <AccordionContent>
                Your previously generated reports remain accessible, but download capabilities will be limited to free tier restrictions. We recommend downloading any important reports before downgrading.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>Do you offer refunds if I'm not satisfied?</AccordionTrigger>
              <AccordionContent>
                Yes, we offer a satisfaction guarantee. If you're not happy with our service, you can request a refund within 14 days of your subscription purchase. Please refer to our refund policy for detailed information.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger>Can I share my account with others?</AccordionTrigger>
              <AccordionContent>
                No, accounts are for individual use only. Each user should have their own account to maintain the quality of service and ensure proper tracking of usage limits.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9">
              <AccordionTrigger>How do I get started with the free tier?</AccordionTrigger>
              <AccordionContent>
                Simply sign up for an account - no credit card required! You'll immediately have access to all free tier features, including daily resume scorings and optimizations.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10">
              <AccordionTrigger>What support options are available?</AccordionTrigger>
              <AccordionContent>
                Free tier users receive basic email support. Premium and Platinum subscribers enjoy priority support with faster response times and access to advanced troubleshooting assistance.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Still not convinced?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Start with our free tier and experience the power of Resulient. No credit card required. 
            If you don't find value in our service, you won't pay a dime.
          </p>
          <Button asChild variant="outline">
            <Link to="/auth">Start Your Journey</Link>
          </Button>
        </div>

        <div className="mt-16">
          <LegalFooter />
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
