
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseSupabaseFunctionReturn {
  callFunction: <T = any>(
    functionName: string,
    payload?: any,
    options?: CallFunctionOptions
  ) => Promise<T>;
  loading: boolean;
  error: Error | null;
  reset: () => void;
}

interface CallFunctionOptions {
  retries?: number;
  retryDelay?: number;
}

export function useSupabaseFunction(): UseSupabaseFunctionReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reset = () => {
    setError(null);
  };

  async function callFunction<T = any>(
    functionName: string,
    payload?: any,
    options: CallFunctionOptions = {}
  ): Promise<T> {
    const { retries = 0, retryDelay = 1000 } = options;
    
    setLoading(true);
    setError(null);
    
    const attempt = async (attemptsLeft: number): Promise<T> => {
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
        
        if (attemptsLeft > 0) {
          // Wait for the retry delay
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return attempt(attemptsLeft - 1);
        }
        
        setError(error);
        throw error;
      }
    };
    
    try {
      return await attempt(retries);
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
