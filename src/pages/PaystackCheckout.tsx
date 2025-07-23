
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, CreditCard, Shield, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PaystackCheckout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product");
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const [loading, setLoading] = useState(false);

  const productDetails = {
    "premium-monthly": { name: "Premium", price: "₦20,000", cycle: "Monthly", tier: "premium" },
    "premium-yearly": { name: "Premium", price: "₦200,000", cycle: "Yearly", tier: "premium" },
    "platinum-monthly": { name: "Platinum", price: "₦50,000", cycle: "Monthly", tier: "platinum" },
    "platinum-yearly": { name: "Platinum", price: "₦500,000", cycle: "Yearly", tier: "platinum" },
  };

  const product = productDetails[productId as keyof typeof productDetails];

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (!productId || !product) {
      navigate("/pricing");
      return;
    }
  }, [user, productId, product, navigate]);

  const handlePayment = async () => {
    if (!user || !productId) return;

    setLoading(true);
    try {
      const response = await supabase.functions.invoke<{
        checkoutUrl: string;
        reference: string;
        amount: number;
      }>("paystack-checkout", {
        body: { 
          productId,
          email: user.email 
        }
      });

      if (response.error) {
        console.error("Checkout error:", response.error);
        toast({
          title: "Payment Error",
          description: "Failed to initialize payment. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (response.data?.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast({
        title: "Payment Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/pricing")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pricing
          </Button>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
            <CardTitle className="text-2xl font-bold text-center">
              Complete Your Purchase
            </CardTitle>
            <p className="text-center text-indigo-100">
              Secure payment powered by Paystack
            </p>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Plan Summary */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Plan Summary</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Plan:</span>
                  <span className="font-medium">{product.name} {product.cycle}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Billing:</span>
                  <span className="font-medium">{product.cycle}</span>
                </div>
                <div className="border-t pt-2 mt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{product.price}</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h4 className="font-semibold">What you'll get:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center text-green-600 dark:text-green-400">
                    <Shield className="h-4 w-4 mr-2" />
                    Unlimited resume scorings
                  </li>
                  <li className="flex items-center text-green-600 dark:text-green-400">
                    <Shield className="h-4 w-4 mr-2" />
                    Unlimited resume optimizations
                  </li>
                  {product.tier === "platinum" ? (
                    <li className="flex items-center text-green-600 dark:text-green-400">
                      <Shield className="h-4 w-4 mr-2" />
                      Unlimited report downloads
                    </li>
                  ) : (
                    <li className="flex items-center text-green-600 dark:text-green-400">
                      <Shield className="h-4 w-4 mr-2" />
                      10 report downloads daily
                    </li>
                  )}
                  <li className="flex items-center text-green-600 dark:text-green-400">
                    <Clock className="h-4 w-4 mr-2" />
                    Priority support
                  </li>
                </ul>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                      Secure Payment
                    </p>
                    <p className="text-blue-600 dark:text-blue-300">
                      Your payment is secured by Paystack's industry-standard encryption. 
                      We never store your card details.
                    </p>
                  </div>
                </div>
              </div>

              {/* Current Subscription Notice */}
              {subscription.tier !== "free" && (
                <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    <strong>Note:</strong> Your current {subscription.tier} subscription will be upgraded 
                    to {product.name} {product.cycle} upon successful payment.
                  </p>
                </div>
              )}

              <Button 
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 h-12 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Pay with Paystack
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                By proceeding, you agree to our Terms of Service and Privacy Policy.
                You can cancel your subscription at any time.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaystackCheckout;
