
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown, Diamond, Star, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LegalFooter } from "@/components/layout/LegalFooter";
import { UserMenuWithTheme } from "@/components/theme/UserMenuWithTheme";
import { SubscriptionTierIndicator } from "@/components/subscription/SubscriptionTierIndicator";
import { useSubscription } from "@/hooks/useSubscription";

const Pricing = () => {
  const { subscription } = useSubscription();

  const plans = [
    {
      name: "Free",
      price: "₦0",
      description: "Perfect for getting started",
      icon: <Star className="h-6 w-6" />,
      features: [
        "Resume scoring (view only)",
        "Basic optimization tips",
        "Limited daily usage",
        "Community support"
      ],
      buttonText: "Current Plan",
      buttonVariant: "outline" as const,
      popular: false,
      tier: "free" as const,
      disabled: true
    },
    {
      name: "Premium",
      price: "₦20,000",
      yearlyPrice: "₦200,000",
      description: "For serious job seekers",
      icon: <Diamond className="h-6 w-6 text-blue-500" />,
      features: [
        "Unlimited resume scorings",
        "Unlimited resume optimizations",
        "10 report downloads daily",
        "Priority support",
        "Industry benchmarking",
        "ATS optimization"
      ],
      buttonText: "Choose Premium",
      buttonVariant: "default" as const,
      popular: true,
      tier: "premium" as const,
      monthlyProduct: "premium-monthly",
      yearlyProduct: "premium-yearly"
    },
    {
      name: "Platinum",
      price: "₦50,000",
      yearlyPrice: "₦500,000",
      description: "For career professionals",
      icon: <Crown className="h-6 w-6 text-purple-500" />,
      features: [
        "Everything in Premium",
        "Unlimited report downloads",
        "Resume comparison tool",
        "Early access to features",
        "1-on-1 career consultation",
        "Custom resume templates"
      ],
      buttonText: "Choose Platinum",
      buttonVariant: "default" as const,
      popular: false,
      tier: "platinum" as const,
      monthlyProduct: "platinum-monthly",
      yearlyProduct: "platinum-yearly"
    }
  ];

  const getCurrentPlanButton = (plan: typeof plans[0]) => {
    if (plan.tier === "free") {
      return (
        <Button variant="outline" className="w-full" disabled>
          Current Plan
        </Button>
      );
    }

    if (subscription.tier === plan.tier) {
      return (
        <Button variant="outline" className="w-full" disabled>
          Current Plan
        </Button>
      );
    }

    return (
      <div className="space-y-2">
        <Button asChild className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600">
          <Link to={`/checkout?product=${plan.monthlyProduct}`}>
            {plan.buttonText} Monthly
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link to={`/checkout?product=${plan.yearlyProduct}`}>
            {plan.buttonText} Yearly (Save 17%)
          </Link>
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/" className="flex items-center">
              <span className="font-brand text-3xl sm:text-5xl font-extrabold text-transparent bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-yellow-400 bg-clip-text animate-fade-in drop-shadow-lg tracking-tight select-none">
                Resulient
              </span>
            </Link>
            <Badge className="rounded-full px-3 py-1 text-xs sm:text-sm font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 shadow border border-indigo-200 dark:border-indigo-700 animate-fade-in whitespace-nowrap">
              Pricing
            </Badge>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <SubscriptionTierIndicator variant="badge" size="sm" />
            <UserMenuWithTheme />
          </div>
        </div>

        {/* Pricing Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Unlock your career potential with our AI-powered resume optimization tools
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                plan.popular 
                  ? 'ring-2 ring-indigo-500 dark:ring-indigo-400 scale-105' 
                  : 'hover:scale-105'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-sm font-semibold py-2 px-4 text-center">
                  Most Popular
                </div>
              )}
              
              <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${
                    plan.name === 'Premium' ? 'bg-blue-100 dark:bg-blue-900' :
                    plan.name === 'Platinum' ? 'bg-purple-100 dark:bg-purple-900' :
                    'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                    {plan.price}
                  </div>
                  {plan.yearlyPrice && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      or {plan.yearlyPrice}/year
                    </div>
                  )}
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    per month
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter className="pt-0">
                {getCurrentPlanButton(plan)}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-4 font-semibold">Features</th>
                  <th className="text-center py-4 font-semibold">Free</th>
                  <th className="text-center py-4 font-semibold">Premium</th>
                  <th className="text-center py-4 font-semibold">Platinum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="py-4">Resume Scoring</td>
                  <td className="text-center py-4">View Only</td>
                  <td className="text-center py-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="text-center py-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4">Resume Optimization</td>
                  <td className="text-center py-4">Limited</td>
                  <td className="text-center py-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="text-center py-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4">Report Downloads</td>
                  <td className="text-center py-4">-</td>
                  <td className="text-center py-4">10/day</td>
                  <td className="text-center py-4">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4">Resume Comparison</td>
                  <td className="text-center py-4">-</td>
                  <td className="text-center py-4">-</td>
                  <td className="text-center py-4"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600 dark:text-gray-400">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600 dark:text-gray-400">We offer a 7-day money-back guarantee for all paid plans if you're not satisfied.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is my payment secure?</h3>
              <p className="text-gray-600 dark:text-gray-400">Yes, all payments are processed securely through Paystack with industry-standard encryption.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I upgrade or downgrade?</h3>
              <p className="text-gray-600 dark:text-gray-400">You can upgrade or downgrade your plan at any time from your account settings.</p>
            </div>
          </div>
        </div>

        <LegalFooter />
      </div>
    </div>
  );
};

export default Pricing;
