
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseSupabaseFunctionReturn {
  callFunction: <T = any>(
    functionName: string,
    payload?: any
  ) => Promise<T>;
  loading: boolean;
  error: Error | null;
  reset: () => void;
}

export function useSupabaseFunction(): UseSupabaseFunctionReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reset = () => {
    setError(null);
  };

  async function callFunction<T = any>(
    functionName: string,
    payload?: any
  ): Promise<T> {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke<T>(
        functionName,
        {
          body: payload,
        }
      );
      
      if (error) {
        throw new Error(error.message || "Function call failed");
      }
      
      return data as T;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    callFunction,
    loading,
    error,
    reset
  };
}
