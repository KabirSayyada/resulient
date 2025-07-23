
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface PaystackCheckoutData {
  checkoutUrl: string;
  reference: string;
  amount: number;
}

export function usePaystackCheckout() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const initiatePayment = async (productId: string): Promise<PaystackCheckoutData | null> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue with payment.",
        variant: "destructive",
      });
      return null;
    }

    setLoading(true);
    try {
      const response = await supabase.functions.invoke<PaystackCheckoutData>("paystack-checkout", {
        body: { 
          productId,
          email: user.email 
        }
      });

      if (response.error) {
        console.error("Paystack checkout error:", response.error);
        toast({
          title: "Payment Error",
          description: "Failed to initialize payment. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error initiating Paystack payment:", error);
      toast({
        title: "Payment Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    initiatePayment,
    loading
  };
}
