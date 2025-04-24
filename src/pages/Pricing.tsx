import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, CheckCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
}

const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    description: "Perfect for trying out Resulient",
    monthlyPrice: null,
    yearlyPrice: null,
    features: [
      { text: "3 Resume Scorings Daily", included: true },
      { text: "2 Resume Optimizations Daily", included: true },
      { text: "Detailed Reports (View Only)", included: true },
      { text: "Daily Reset of Credits", included: true },
      { text: "Basic Support", included: true },
      { text: "Report Downloads", included: false },
      { text: "Unlimited Optimizations", included: false },
    ],
    badge: "Free Forever"
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
      { text: "Unlimited Downloads", included: false },
    ],
    badge: "Most Popular",
    popular: true
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
      { text: "Priority Support", included: true },
      { text: "All Premium Features", included: true },
      { text: "Advanced Analytics", included: true },
      { text: "Early Access to New Features", included: true },
    ],
    badge: "Best Value"
  }
];

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="font-brand text-4xl sm:text-5xl font-extrabold text-transparent bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-yellow-400 bg-clip-text animate-fade-in drop-shadow-lg tracking-tight select-none inline-block mb-6">
            Resulient
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Investment in Your Career
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Getting your dream job shouldn't be a dream. We're changing that by making professional resume optimization accessible to everyone. Start with our free tier or unlock unlimited potential with our premium plans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-md border border-indigo-100">
            <Star className="h-8 w-8 text-yellow-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Stand Out</h3>
            <p className="text-gray-600">Get noticed by both ATS systems and human recruiters with our optimized resumes.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border border-indigo-100">
            <CheckCircle className="h-8 w-8 text-green-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Proven Results</h3>
            <p className="text-gray-600">Our users report higher interview rates and faster job placements.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border border-indigo-100">
            <Star className="h-8 w-8 text-purple-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Expert Guidance</h3>
            <p className="text-gray-600">Get detailed insights and suggestions from our advanced AI system.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {pricingTiers.map((tier) => (
            <Card key={tier.name} className={`relative ${
              tier.popular 
                ? 'border-2 border-indigo-500 shadow-xl' 
                : 'border border-gray-200 shadow-md'
            }`}>
              {tier.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500">
                  {tier.badge}
                </Badge>
              )}
              <CardHeader className="text-center pt-8">
                <h3 className="text-2xl font-bold">{tier.name}</h3>
                <p className="text-gray-600 mt-2">{tier.description}</p>
                <div className="mt-4">
                  {tier.monthlyPrice ? (
                    <>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-4xl font-bold">${tier.monthlyPrice}</span>
                        <span className="text-gray-600">/month</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        or ${tier.yearlyPrice}/year
                      </div>
                    </>
                  ) : (
                    <span className="text-4xl font-bold">Free</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className={`h-5 w-5 ${
                        feature.included ? 'text-green-500' : 'text-gray-300'
                      }`} />
                      <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  className={`w-full ${
                    tier.popular
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
                      : ''
                  }`}
                >
                  <Link to="/auth">
                    {tier.monthlyPrice ? 'Get Started' : 'Try for Free'}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-20 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="bg-white rounded-lg shadow-md p-6">
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
          <h2 className="text-2xl font-bold mb-4">Still not convinced?</h2>
          <p className="text-gray-600 mb-6">
            Start with our free tier and experience the power of Resulient. No credit card required. 
            If you don't find value in our service, you won't pay a dime.
          </p>
          <Button asChild variant="outline">
            <Link to="/auth">Start Your Journey</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
